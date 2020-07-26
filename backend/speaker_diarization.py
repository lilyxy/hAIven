import io
import argparse
import json
from pydub import AudioSegment
import math
import os

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "/Users/elaine/Downloads/my-key.json"


def transcribe_gcs(gcs_uri):
    from google.cloud import speech_v1p1beta1 as speech
    client = speech.SpeechClient()

    audio = speech.types.RecognitionAudio(uri = gcs_uri)

    config =speech.types.RecognitionConfig(
    encoding = speech.enums.RecognitionConfig.AudioEncoding.LINEAR16,
    language_code = 'en-US',
    enable_word_time_offsets = True,
    enable_speaker_diarization = True,
    diarization_speaker_count = 2,
    audio_channel_count=2,
    model = 'phone_call')
    
    operation = client.long_running_recognize(config,audio)
    print("Waiting for operation to complete..")
    response = operation.result()

    result = response.results[0]
    alternative = result.alternatives[0]

    started = False
    start_time = 0
    end_time = 0
    speaker_timestamp = {}
    speaker_timestamp['Speaker1'] = []
    speaker_timestamp['Speaker2'] = []

    wanted_result = response.results[-1]
    prev_speaker_tag = wanted_result.alternatives[0].words[0].speaker_tag

    s="Speaker {}:".format(prev_speaker_tag)
    for i in wanted_result.alternatives[0].words:
        if not started:
            started = True
            start_time = i.start_time.seconds
            print("Start time" + str(start_time))
        if(i.speaker_tag != prev_speaker_tag):
            end_time = i.end_time.seconds-1
            timeStamp = {"startTime":start_time, "endTime":end_time}
            print(speaker_timestamp)
            speaker_timestamp['Speaker' + str(prev_speaker_tag)].append(timeStamp)
            started = False
            print("End time" + str(end_time))
            print(s+'\n')
            s = "Speaker {}:".format(i.speaker_tag)
        s+= " "+ i.word
        prev_speaker_tag = i.speaker_tag
    # print(s+'\n')
    return speaker_timestamp


def SplitWavAudio(filename, gcs_uri):
    speakers = transcribe_gcs(gcs_uri)
    i = 1
    for k1, v1 in speakers.items():
        for element in v1:
            t1 = element.get('startTime') * 1000
            t2 = element.get('endTime') * 1000
            split_audio = AudioSegment.from_wav(filename)
            split_audio = split_audio[t1:t2]
            split_audio.export("sample" + str(i) + '.wav', format="wav")
            i = i+1