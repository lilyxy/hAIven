import glob
WavFiles = glob.glob("backend/splittedWav/*.wav")
from backend.speaker_diarization import SplitWavAudio
import librosa.display
import matplotlib.pyplot as plt
import pickle
from voice_emotion.final_model.predict_emotion import *

#Pipeline 2 - voice separation
# filename = "/Users/elaine/Documents/hAIven/slid.wav"
# gcs_uri = "gs://audio_analsis_haiven/Ontiva.com_Example_of_a_telephone_call_Call_center_call_conversation.wav"
# SplitWavAudio(filename, gcs_uri)


print(glob.glob("audio_pipeline_sample/*.wav"))

# Load the model
model = pickle.load(open("voice_emotion/final_model/emotion_cnn.pkl", "rb"))

# Preprocess audio data
audio_files = glob.glob("audio_pipeline_sample/*.wav")

for i in audio_files:
    cleaned_audio = clean_audio(i)
    prediction = predict_emotion(model, cleaned_audio)
    print('Predicted Emotion: {}'.format(prediction))

# Predicted Emotion: angry audio_file
# Predicted Emotion: sad audio_file


