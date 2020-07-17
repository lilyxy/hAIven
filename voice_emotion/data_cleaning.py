
import librosa
import numpy as np
import pandas as pd
import librosa.display
import IPython.display
import soundfile as sf
import os
import errno
import glob

# Need a function to remove dead space from audio files
# Checks a rolling average of signal over 1/10 sec and compares to threshold
# Returns a mask of True and False values that can be used to filter audio signals

def envelope(y, sr, threshold):
    mask = []
    y_abs = pd.Series(y).apply(np.abs)
    y_mean = y_abs.rolling(window = int(sr/10), min_periods = 1, center = True).mean()
    for mean in y_mean:
        if mean > threshold:
            mask.append(True)
        else:
            mask.append(False)
    return np.array(y[mask])



def clean_files(file_list):

    count = 0

    for file in file_list:
        y, sr = librosa.load(file)
        y = envelope(y, sr, 0.0005)
        save_file = 'clean/' + file
        
        if not os.path.exists(os.path.dirname(save_file)):
            try:
                os.makedirs(os.path.dirname(save_file))
            except OSError as exc: # Guard against race condition
                if exc.errno != errno.EEXIST:
                    raise
        
        with open(save_file, 'w') as new_file:
            sf.write(save_file, y, sr)
            new_file.close()
            
        count += 1
        if count % 100 == 0:
            print('cleaned and saved 100 files')
    
    print("cleaning complete!")

#ravdess_file_list = glob.glob('RAVDESS/*/*.wav')
#clean_files(ravdess_file_list)

#tess_file_list = glob.glob('TESS/*/*.wav')
#clean_files(tess_file_list)

#savee_file_list = glob.glob('SAVEE/*/*/*.wav')
#clean_files(savee_file_list)

# Now that all of the files have been cleaned lets create a simple csv with filenames and basic features
# Define function for building the RAVDESS index
def build_ravdess_index(file_list):
    
    emotion_key = {'01': 'neutral', '02': 'calm', '03': 'happy', '04': 'sad', '05': 'angry', '06': 'fearful', '07': 'disgusted', '08': 'surprised'}
    intensity_key = {'01': 'normal', '02': 'strong'}

    df = {'dataset': [], 'filename': [], 'actor': [], 'emotion': [], 'intensity': [], 'statement': [], 'repitition': [], 'length': [], 'gender': []}

    for file in file_list:
        
        file = file.replace('\\', '/')
        df['dataset'].append('RAVDESS')
        
        df['filename'].append(file)

        props = file.split('/')[3].split('.')[0].split('-')
        df['actor'].append(props[6])
        df['emotion'].append(emotion_key[props[2]])
        df['intensity'].append(intensity_key[props[3]])
        df['statement'].append(props[4])
        df['repitition'].append(props[5])

        if int(props[6]) % 2 == 0:
            df['gender'].append('female')
        else:
            df['gender'].append('male')

        y, sr = librosa.load(file)
        df['length'].append(y.shape[0]/sr)

    file_properties = pd.DataFrame(df)
    
    return file_properties

ravdess_clean_list = glob.glob('clean/RAVDESS/*/*.wav')
ravdess_index = build_ravdess_index(ravdess_clean_list)
    
# Define function for building the SAVEE index
def build_savee_index(file_list):
    
    emotion_key = {'n': 'neutral', 'h': 'happy', 'sa': 'sad', 'a': 'angry', 'f': 'fearful', 'd': 'disgusted', 'su': 'surprised'}

    df = {'dataset': [], 'filename': [], 'actor': [], 'emotion': [], 'repitition': [], 'length': [], 'gender': []}

    for file in file_list:
        df['dataset'].append('SAVEE')
        
        file = file.replace('\\', '/')
        
        df['filename'].append(file)
        

        props = file.split('/')
        df['actor'].append(props[4])
        df['emotion'].append(emotion_key[props[5][:-6]])
        df['repitition'].append(props[5][-6:-4])
        df['gender'].append('male')

        y, sr = librosa.load(file)
        df['length'].append(y.shape[0]/sr)

    file_properties = pd.DataFrame(df)
    
    return file_properties
 
savee_clean_list = glob.glob('clean/SAVEE/Data/AudioData/*/*.wav')   
savee_index = build_savee_index(savee_clean_list)


# Define function for building the TESS index

def build_tess_index(file_list):
    
    emotion_key = {'neutral': 'neutral', 'happy': 'happy', 'sad': 'sad', 'angry': 'angry',
                   'fear': 'fearful', 'disgust': 'disgusted', 'ps': 'surprised'}

    df = {'dataset': [], 'filename': [], 'actor': [], 'emotion': [], 'statement': [], 'length': [], 'gender': []}

    for file in file_list:
        
        file = file.replace('\\', '/')
        df['dataset'].append('TESS')
        
        df['filename'].append(file)
        props = file.split('/')[3].split('_')
        df['actor'].append(props[0])
        df['emotion'].append(emotion_key[props[2][:-4]])
        df['statement'].append(props[1])
        df['gender'].append('female')

        y, sr = librosa.load(file)
        df['length'].append(y.shape[0]/sr)

    file_properties = pd.DataFrame(df)
    
    return file_properties

tess_clean_list = glob.glob('clean/TESS/*/*.wav')
tess_index = build_tess_index(tess_clean_list)

# Now combine all the dataset indexes into one using their common columns
common_cols = ['dataset', 'filename', 'actor', 'emotion', 'length', 'gender']

complete_index = pd.concat([ravdess_index[common_cols], savee_index[common_cols], tess_index[common_cols]], axis = 0)
complete_index.reset_index(drop = True, inplace = True)

# drop calm because there is not enough data
complete_index = complete_index.drop(list(complete_index[complete_index['emotion'] == 'calm'].index), axis = 0).reset_index(drop = True)

# Lets split our dataset into training, validation, and test sets
from sklearn.model_selection import train_test_split


# For now I'm not going to worry about using a validation set.
# Later if I want to more finely tune my hyper parameters I just need to uncomment some lines to also get a validation set.
def assign_sets(complete_index):
    train, test = train_test_split(complete_index, test_size = 0.2, random_state = 42)
    #validation, test = train_test_split(_test, test_size = 0.5, random_state = 42)
    
    set_list = []
    
    for file in complete_index['filename']:
        if file in list(train['filename']):
            set_list.append('train')
#         if file in list(validation['filename']):
#             set_list.append('validation')
        if file in list(test['filename']):
            set_list.append('test')
    
    complete_index['set'] = set_list
    
    return complete_index


complete_index = assign_sets(complete_index)

complete_index.to_csv('complete_index.csv')