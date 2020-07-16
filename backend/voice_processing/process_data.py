from effects import trim, split
from vad import vad 
from librosa import load
import matplotlib.pyplot as plt
import numpy as np
import scipy.io.wavfile

name = "audio_01.wav"
data, fs = load(name)
vact = vad(data, fs, fs_vad = 16000, hop_length = 30, vad_mode=3)
edges = trim(data, fs, fs_vad = 16000, hop_length = 30, vad_mode=3)

trimed = data[edges[0]:edges[1]]
scipy.io.wavfile.write("audio_removed_silence.wav", fs, trimed)

time = np.linspace(0, len(trimed)/fs, len(trimed)) # time axis
fig, ax1 = plt.subplots()

ax1.plot(time, trimed, label='speech waveform')
ax1.set_xlabel("TIME [s]")

plt.show()

edges = split(data, fs)

for i, edge in enumerate(edges):
    seg = data[edge[0]:edge[1]]
    time = np.linspace(0, len(seg)/fs, len(seg)) # time axis
    scipy.io.wavfile.write("seg" + str(i) + ".wav", fs, seg)
    fig, ax1 = plt.subplots()
    print("Testing")
    print(type(seg))
    ax1.plot(time, seg, label='speech waveform')
    ax1.set_xlabel("TIME [s]")

    plt.show()