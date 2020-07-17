import pandas as pd
import numpy as np
import librosa

# Load CSV
file_properties = pd.read_csv('voice_emotion/complete_index.csv')

# Spit data into train/test
train = file_properties[file_properties['set'] == 'train']
test = file_properties[file_properties['set'] == 'test']
train.drop('Unnamed: 0', inplace=True, axis=1)
test.drop('Unnamed: 0', inplace=True, axis=1)

classes = pd.DataFrame(
    {'emotion': ['neutral', 'happy', 'sad', 'angry', 'fearful', 'disgusted', 'surprised']})


# Set up configuration for mfcc
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

# Define training data


def build_train_data():

    X = []
    y = []

    iter = 0

    for row in train.iterrows():

        # Initialize min and max values for each file for scaling
        _min, _max = float('inf'), -float('inf')

        # Load the file
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
            # check min and max values
            _min = min(np.amin(X_mfccs), _min)
            _max = max(np.amax(X_mfccs), _max)
            # add features of window to X
            Xf.append(X_mfccs)

        # Put window data for file into array and scale
        Xf = np.array(Xf)
        Xf = (Xf - _min) / (_max - _min)

        # Now that data is scaled, pick out each window from Xf and add that to X
        for ar in Xf:
            X.append(ar)

        iter += 1

        if iter % 100 == 0:
            print('{} rows have loaded...'.format(iter))

        # if iter % 100 == 0:
        #     print('100 rows loaded')
        #     break

    # Once windows have been taken from every file reshape X
    X = np.array(X)
    X = X.reshape(X.shape[0], X.shape[1], X.shape[2], 1)
    y = np.eye(7)[y]

    return X, y
