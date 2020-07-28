import numpy as np
import pandas as pd
import librosa
import pickle

from tqdm import tqdm
from keras.utils import to_categorical
from keras.models import Sequential
from keras.layers import Conv2D, MaxPool2D, Flatten, Dropout, Dense
from sklearn.utils.class_weight import compute_class_weight


# Download csv file
file_properties = pd.read_csv('voice_emotion/complete_index.csv')

# Set train data
train = file_properties[file_properties['set'] == 'train']
train.drop('Unnamed: 0', inplace=True, axis=1)

# Set emotion classes
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


# Set the training data
def build_train_feats():

    print('''
    -------- Loading Train Data --------
    ''')

    X = []
    y = []

    iter = 0

    for row in tqdm(train.iterrows(), total=3238, ncols=100, desc='Training Data'):

        # Initialize min and max values for each file for scaling
        _min, _max = float('inf'), -float('inf')

        # Load the file
        '''
        .wav file: file format for storing audio bitstream, uncompressed audio in LPCM format
        librosa.load(filename): filename -> string variable containing the path to the audio file
        wav: time series -> 1D numpy floating point array
        sr: sampling rate -> # of samples per second of audio, default = 22050 Hz
        '''

        wav, sr = librosa.load('voice_emotion/' + row[1]['filename'])

        # Create an array to hold features for each window generated from specific file
        Xf = []

        # Create randomly selected 0.4s windows from each file. Select 1 random window for every 0.1s of audio in file.
        n_samples = int(10 * float(row[1]['length']))

        for i in range(n_samples):
            # Get the numerical label for the emotion of the file
            # This needs to be in for loop so that y.shape and X.shape match up
            y.append(classes[classes['emotion'] == row[1]['emotion']].index[0])

            # choose random starting point for window
            rand_ind = np.random.randint(0, wav.shape[0] - config.step)
            # create windowed sample

            X_sample = wav[rand_ind: rand_ind + config.step]
            # generate mfccs from sample
            X_mfccs = librosa.feature.mfcc(X_sample, sr, n_mfcc=config.n_mfcc, n_fft=config.n_fft,
                                           hop_length=config.n_fft)[1:config.n_feat + 1]
            '''
            The output of this funciton is the matrix mfcc -> numpy array of shape (n_mfcc, T)
            T -> track duration 
            '''
            # check min and max values
            _min = min(np.amin(X_mfccs), _min)
            _max = max(np.amax(X_mfccs), _max)
            # add features of window to X
            Xf.append(X_mfccs)

        iter += 1

        if iter % 50 == 0:
            break

        # Put window data for file into array and scale
        Xf = np.array(Xf)
        Xf = (Xf - _min) / (_max - _min)

        # Now that data is scaled, pick out each window from Xf and add that to X
        for ar in Xf:
            X.append(ar)

    # Once windows have been taken from every file reshape X
    X = np.asarray(X)
    X = X.reshape((X.shape[0], X.shape[1], X.shape[2], 1))
    y = to_categorical(y, num_classes=7)

    return X, y


# Build the training data
X, y = build_train_feats()
y_flat = np.argmax(y, axis=1)

# This will assign slightly more weight to the neutral class
class_weight = compute_class_weight('balanced', np.unique(y_flat), y_flat)

# Required input shape for CNN
input_shape = (X.shape[1], X.shape[2], 1)
print(input_shape)


# Define the model
def create_cnn():
    model = Sequential()
    model.add(Conv2D(16, (3, 3), activation='relu', strides=(
        1, 1), padding='same', input_shape=input_shape))
    model.add(Conv2D(32, (3, 3), activation='relu',
                     strides=(1, 1), padding='same'))
    model.add(Conv2D(64, (3, 3), activation='relu',
                     strides=(1, 1), padding='same'))
    model.add(Conv2D(128, (3, 3), activation='relu',
                     strides=(1, 1), padding='same'))
    model.add(MaxPool2D((2, 2)))
    model.add(Dropout(0.5))
    model.add(Flatten())
    model.add(Dense(128, activation='relu'))
    model.add(Dense(64, activation='relu'))
    model.add(Dense(7, activation='softmax'))
    model.summary()
    model.compile(loss='categorical_crossentropy',
                  optimizer='adam', metrics=['acc'])
    return model


# Instantiate and fit the model
print('''
    -------- Training the Model --------
    ''')

keras_model = create_cnn()
keras_model.fit(X, y, epochs=25, batch_size=32,
                shuffle=True, class_weight=class_weight)


# Save the model
pickle.dump(keras_model, open("voice_emotion/Keras/test_cnn.pkl", "wb"))

print('''
    -------- Model Saved --------
    ''')
