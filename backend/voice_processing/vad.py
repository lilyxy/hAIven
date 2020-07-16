import numpy as np
import webrtcvad
from librosa.core import resample
from librosa.util import frame

def vad(data, fs, fs_vad=16000, hop_length=30, vad_mode=0):
    # # check data
    # if data.dtype.kind == 'i':
    #     if data.max() > 2**15 - 1 or data.min() < -2**15:
    #         raise ValueError(
    #             'When data.type is int, data must be -32768 < data < 32767.')
    #     data = data.astype('f') / 2.0**15

    # elif data.dtype.kind == 'f':
    #     if np.abs(data).max() > 1:
    #         raise ValueError(
    #             'When data.type is float, data must be -1.0 <= data <= 1.0.')
    #     data = data.astype('f')

    # else:
    #     raise ValueError('data.dtype must be int or float.')

    data = data.squeeze()
    if not data.ndim == 1: 
        raise ValueError('data must be mono (1 ch).')

    # resampling
    if fs != fs_vad:
        resampled = resample(data, fs, fs_vad)
        if np.abs(resampled).max() > 1.0:
            resampled *= (0.99 / np.abs(resampled).max())
            # warn('Resampling causes data clipping. data was rescaled.')
    else:
        resampled = data

    resampled = (resampled * 2.0**15).astype('int16')

    hop = fs_vad * hop_length // 1000
    framelen = resampled.size // hop + 1
    padlen = framelen * hop - resampled.size
    paded = np.lib.pad(resampled, (0, padlen), 'constant', constant_values=0)
    framed = frame(paded, frame_length=hop, hop_length=hop).T

    vad = webrtcvad.Vad()
    vad.set_mode(vad_mode)
    valist = [vad.is_speech(tmp.tobytes(), fs_vad) for tmp in framed]

    hop_origin = fs * hop_length // 1000
    va_framed = np.zeros([len(valist), hop_origin])
    va_framed[valist] = 1

    return va_framed.reshape(-1)[:data.size]

