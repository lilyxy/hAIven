import pandas as pd
import numpy as np
import librosa
import librosa.display
from scipy.io import wavfile
import parselmouth
from parselmouth.praat import call
import wave
import statistics
import keras
from keras.models import load_model

std_len = 5

def hm_jit_shim(wav_file_path, f0min=75, f0max=300, unit=1):
    sound = parselmouth.Sound(wav_file_path) # read the sound
    #duration = call(sound, "Get total duration") # duration
    pitch = call(sound, "To Pitch", 0.0, f0min, f0max) #create a praat pitch object
    #meanF0 = call(pitch, "Get mean", 0, 0, unit) # get mean pitch
    #stdevF0 = call(pitch, "Get standard deviation", 0 ,0, unit) # get standard deviation
    harmonicity = call(sound, "To Harmonicity (cc)", 0.01, f0min, 0.1, 1.0)
    hnr = call(harmonicity, "Get mean", 0, 0)
    pointProcess = call(sound, "To PointProcess (periodic, cc)", f0min, f0max)
    localJitter = call(pointProcess, "Get jitter (local)", 0, 0, 0.0001, 0.02, 1.3)
    localabsoluteJitter = call(pointProcess, "Get jitter (local, absolute)", 0, 0, 0.0001, 0.02, 1.3)
    rapJitter = call(pointProcess, "Get jitter (rap)", 0, 0, 0.0001, 0.02, 1.3)
    ppq5Jitter = call(pointProcess, "Get jitter (ppq5)", 0, 0, 0.0001, 0.02, 1.3)
    ddpJitter = call(pointProcess, "Get jitter (ddp)", 0, 0, 0.0001, 0.02, 1.3)
    localShimmer =  call([sound, pointProcess], "Get shimmer (local)", 0, 0, 0.0001, 0.02, 1.3, 1.6)
    localdbShimmer = call([sound, pointProcess], "Get shimmer (local_dB)", 0, 0, 0.0001, 0.02, 1.3, 1.6)
    apq3Shimmer = call([sound, pointProcess], "Get shimmer (apq3)", 0, 0, 0.0001, 0.02, 1.3, 1.6)
    aqpq5Shimmer = call([sound, pointProcess], "Get shimmer (apq5)", 0, 0, 0.0001, 0.02, 1.3, 1.6)
    apq11Shimmer =  call([sound, pointProcess], "Get shimmer (apq11)", 0, 0, 0.0001, 0.02, 1.3, 1.6)
    ddaShimmer = call([sound, pointProcess], "Get shimmer (dda)", 0, 0, 0.0001, 0.02, 1.3, 1.6)
    
    return [hnr, localJitter, localabsoluteJitter, rapJitter, ppq5Jitter, ddpJitter, localShimmer, localdbShimmer, apq3Shimmer, aqpq5Shimmer, apq11Shimmer, ddaShimmer]

def get_formants(wav_file_path, f0min=75, f0max=300):
    sound = parselmouth.Sound(wav_file_path) # read the sound
    pitch = call(sound, "To Pitch (cc)", 0, f0min, 15, 'no', 0.03, 0.45, 0.01, 0.35, 0.14, f0max)
    pointProcess = call(sound, "To PointProcess (periodic, cc)", f0min, f0max)
    
    formants = call(sound, "To Formant (burg)", 0.0025, 5, 5000, 0.025, 50)
    numPoints = call(pointProcess, "Get number of points")

    f1_list = []
    f2_list = []
    f3_list = []
    f4_list = []
    
    # Measure formants only at glottal pulses
    for point in range(0, numPoints):
        point += 1
        t = call(pointProcess, "Get time from index", point)
        f1 = call(formants, "Get value at time", 1, t, 'Hertz', 'Linear')
        f2 = call(formants, "Get value at time", 2, t, 'Hertz', 'Linear')
        f3 = call(formants, "Get value at time", 3, t, 'Hertz', 'Linear')
        f4 = call(formants, "Get value at time", 4, t, 'Hertz', 'Linear')
        f1_list.append(f1)
        f2_list.append(f2)
        f3_list.append(f3)
        f4_list.append(f4)
    
    f1_list = [f1 for f1 in f1_list if str(f1) != 'nan']
    f2_list = [f2 for f2 in f2_list if str(f2) != 'nan']
    f3_list = [f3 for f3 in f3_list if str(f3) != 'nan']
    f4_list = [f4 for f4 in f4_list if str(f4) != 'nan']
    
    try:
        # calculate mean formants across pulses
        f1_mean = statistics.mean(f1_list)
        f2_mean = statistics.mean(f2_list)
        f3_mean = statistics.mean(f3_list)
        f4_mean = statistics.mean(f4_list)

        # calculate median formants across pulses, this is what is used in all subsequent calcualtions
        # you can use mean if you want, just edit the code in the boxes below to replace median with mean
        f1_median = statistics.median(f1_list)
        f2_median = statistics.median(f2_list)
        f3_median = statistics.median(f3_list)
        f4_median = statistics.median(f4_list)
    except statistics.StatisticsError:
        print("Not enough glottal information for sample")
        return [0]*8
    return [f1_mean, f2_mean, f3_mean, f4_mean, f1_median, f2_median, f3_median, f4_median]


PARSF = 120

def get_aud_features_all(wav_path, num_mfcc = 40, hop_length = 512, n_fft = 2048, duration = 3, pad_mode = 'wrap'):
    snd, r = librosa.load(wav_path, duration = 3)
    #print(librosa.get_duration(filename = wav_path))
    frames = r*duration #set default # of frames
    if len(snd) < frames:
        snd = np.pad(snd, frames-len(snd), mode = pad_mode)
    snd = snd[:frames]
    mfcc = librosa.feature.mfcc(snd, sr = r, n_mfcc = num_mfcc)
    avg_mfcc = np.mean(mfcc, axis = 0)
    #mel_freq_raw = librosa.feature.melspectrogram(snd, sr = r)
    mel_raw = np.abs(librosa.stft(snd, n_fft = n_fft, hop_length = hop_length))
    mel_freq = librosa.amplitude_to_db(mel_raw, ref = np.max)
    avg_mel_freq = np.mean(mel_freq, axis = 0)
    stft = np.abs(librosa.stft(snd)) #resolve complex values
    chroma = librosa.feature.chroma_stft(S=stft, sr = r)
    avg_chroma = np.mean(chroma, axis = 0)
    oenv = librosa.onset.onset_strength(y = snd, sr=r, hop_length=hop_length)
    tempogram = librosa.feature.tempogram(onset_envelope=oenv, sr=r, hop_length=512)
    avg_tempogram = np.mean(tempogram, axis = 0)
    #pars_aud = parselmouth.Sound(wav_path)
    #intensity_obj = pars_aud.to_intensity()
    intensity = [0]*1000#intensity_obj.xs()
    if len(intensity) < duration*PARSF:
        intensity = np.pad(intensity, (0, duration*PARSF-len(intensity)), mode = pad_mode)
        #print(intensity)
    intensity = intensity[:duration*PARSF]
    formants = get_formants(wav_path)
    glottal = hm_jit_shim(wav_path)
    #print(r, snd.shape, mfcc.shape, mel_freq.shape, chroma.shape, len(intensity), intensity.shape)#, tempogram.shape)
     
    return mfcc, avg_mfcc, mel_freq, avg_mel_freq, chroma, avg_chroma, intensity, formants, glottal, avg_tempogram

mfcc_model = load_model('mfcc.h5')    

#Use 1 for aggression
def predict_aggr(path):
    mfcc, avg_mfcc, mel_freq, avg_mel_freq, chroma, avg_chroma, intensity, formants, glottal, avg_tempogram = get_aud_features_all(path, hop_length=512, n_fft = 128, duration = std_len)
    score = mfcc_model.predict(mfcc.reshape(1, mfcc.shape[0], mfcc.shape[1], 1))
    prob = score[0][1] #labels are sorted alphabetically, we want label of 1 for aggression
    #print(mfcc.reshape(mfcc.shape[0], mfcc.shape[1], 1))
    pred = score.argmax(axis=-1)
    return pred[0], prob
