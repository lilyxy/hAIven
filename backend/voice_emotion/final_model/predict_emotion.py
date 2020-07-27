import numpy as np
import pandas as pd
import librosa
import pickle
import soundfile as sf
import os
from tqdm import tqdm
from keras.utils import to_categorical
from keras.models import Sequential
from keras.layers import Conv2D, MaxPool2D, Flatten, Dropout, Dense
from sklearn.utils.class_weight import compute_class_weight
# Create a configuration class
import tensorflow as tf
import tensorflow.keras as keras
print("Tensorflow version: "+tf.__version__)
print("Keras version: "+keras.__version__)
class Config:
    def __init__(self, n_mfcc=26, n_feat=13, n_fft=552, sr=22050, window=0.4, test_shift=0.1):
        self.n_mfcc = n_mfcc
        self.n_feat = n_feat
        self.n_fft = n_fft
        self.sr = sr
        self.window = window
        self.step = int(sr * window)
        self.test_shift = test_shift
        self.shift = int(sr * test_shift)


config = Config()


# Function to predict emotion
def predict_emotion(model, input_audio):

    local_results = []
    _min, _max = float('inf'), -float('inf')

    wav, sr = librosa.load(input_audio)

    X = []

    for i in range(int((wav.shape[0]/sr-config.window)/config.test_shift)):
        X_sample = wav[i*config.shift: i*config.shift +
                       config.step]  # slice out 0.4s window
        X_mfccs = librosa.feature.mfcc(X_sample, sr, n_mfcc=config.n_mfcc, n_fft=config.n_fft,
                                       hop_length=config.n_fft)[1:config.n_feat + 1]  # generate mfccs from sample

        _min = min(np.amin(X_mfccs), _min)
        _max = max(np.amax(X_mfccs), _max)  # check min and max values
        X.append(X_mfccs)  # add features of window to X

     # Put window data into array, scale, then reshape
    X = np.array(X)
    X = (X - _min) / (_max - _min)
    X = X.reshape(X.shape[0], X.shape[1], X.shape[2], 1)

    # Feed data for each window into model for prediction
    for i in range(X.shape[0]):
        window = X[i].reshape(1, X.shape[1], X.shape[2], 1)
        local_results.append(model.predict(window))

    # Aggregate predictions for file into one then append to all_results
    local_results = (np.sum(np.array(local_results),
                            axis=0)/len(local_results))[0]
    local_results = list(local_results)
    prediction = np.argmax(local_results)

    # Convert prediction from number to label
    emotions = {0: 'neutral', 1: 'happy', 2: 'sad', 3: 'angry',
                4: 'fearful', 5: 'disgusted', 6: 'surprised'}
    prediction = emotions[prediction]

    return prediction


def envelope(y, sr, threshold):
    mask = []
    y_abs = pd.Series(y).apply(np.abs)
    y_mean = y_abs.rolling(window=int(
        sr/10), min_periods=1, center=True).mean()
    for mean in y_mean:
        if mean > threshold:
            mask.append(True)
        else:
            mask.append(False)
    return np.array(y[mask])


def clean_audio(audio_file):
    y, sr = librosa.load(audio_file)
    y = envelope(y, sr, 0.0005)

    with open(audio_file, 'w') as new_file:
        sf.write(audio_file, y, sr)
        new_file.close()

    return audio_file
