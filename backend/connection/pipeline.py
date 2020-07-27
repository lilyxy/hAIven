import glob
WavFiles = glob.glob("backend/splittedWav/*.wav")
import librosa.display
import sys
sys.path.append('../')
import matplotlib.pyplot as plt
import pickle
from backend.voice_processing.speaker_diarization import *
from backend.voice_emotion.final_model.predict_emotion import *
from backend.aggression_model.predict import *

# aggression detection
filename = "/Users/elaine/Documents/hAIven/slid.wav"
result = predict_aggr(filename)


# voice separation
if (result[0] == 1)
    gcs_uri = "gs://audio_analsis_haiven/"
    SplitWavAudio(filename, gcs_uri)

    # Load the model
    model = pickle.load(open("backend/voice_emotion/final_model/emotion_cnn.pkl", "rb"))

    # Preprocess audio data
    audio_files = glob.glob("audio_pipeline_sample/*.wav")

    for i in audio_files:
        cleaned_audio = clean_audio(i)
        prediction = predict_emotion(model, cleaned_audio)
        print('Predicted Emotion: {}'.format(prediction))

    # Predicted Emotion: angry audio_file
    # Predicted Emotion: sad audio_file


