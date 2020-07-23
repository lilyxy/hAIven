import numpy as np
import pandas as pd
import librosa
import pickle

from tqdm import tqdm
from keras.utils import to_categorical
from keras.models import Sequential
from keras.layers import Conv2D, MaxPool2D, Flatten, Dropout, Dense
from sklearn.utils.class_weight import compute_class_weight


model = pickle.load(open("voice_emotion/final_model/emotion_cnn.pkl", "rb"))

# Set test data
file_properties = pd.read_csv('voice_emotion/complete_index.csv')
test = file_properties[file_properties['set'] == 'test']
test.drop('Unnamed: 0', inplace=True, axis=1)

classes = pd.DataFrame(
    {'emotion': ['neutral', 'happy', 'sad', 'angry', 'fearful', 'disgusted', 'surprised']})


# Create a configuration class
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


def test_model(model, input_files):

    print('''
    -------- Loading Test Data --------
    ''')

    # initialize a total results list
    all_results = []

    for row in tqdm(input_files.iterrows(), total=810, ncols=100, desc='Testing Data'):
        # Initialize a local results list
        local_results = []

        # Initialize min and max values for each file for scaling
        _min, _max = float('inf'), -float('inf')

        # Get the numerical label for the emotion of the file
        label = classes[classes['emotion'] == row[1]['emotion']].index[0]

        # Load the file
        wav, sr = librosa.load('voice_emotion/' + row[1]['filename'])

        # Create an array to hold features for each window
        X = []

        # Iterate over sliding 0.4s windows of the audio file
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
        local_results.append(prediction)
        local_results.append(label)
        local_results.append(row[1]['filename'])
        all_results.append(local_results)

    print('''
    -------- Computing Accuracy --------
        ''')

    # Turn all results into a dataframe
    df_cols = ['neutral', 'happy', 'sad', 'angry', 'fearful',
               'disgusted', 'surprised', 'prediction', 'ground_truth', 'filename']
    all_results = pd.DataFrame(all_results, columns=df_cols)

    # Compute accuracy
    corrects = (all_results['prediction'] ==
                all_results['ground_truth']).value_counts().loc[True]
    incorrects = (all_results['prediction'] ==
                  all_results['ground_truth']).value_counts().loc[False]
    accuracy = corrects / all_results.shape[0]
    print(f'Test Set Accuracy: {accuracy}')

    return all_results, accuracy


results, accuracy = test_model(model, test)
