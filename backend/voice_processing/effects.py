import numpy as np
from vad import vad


def _get_edges(vact):

    edges = np.flatnonzero(np.diff(vact.astype(int)))
    edges = edges + 1

    if vact[0]:
        edges = np.hstack((0, edges))

    if vact[-1]:
        edges = np.hstack((0, vact.size))

    edges = np.minimum(edges, vact.size).reshape(-1, 2)
    edges = edges[(edges[:, 1] - edges[:, 0]) > 0]

    return edges


def _rms(arr):
    return np.sqrt((arr**2.0).mean())


def _drop_silence(waveform, edges, threshold_db):
    rms = []
    for s, e in edges:
        rms.append(_rms(waveform[s:e]))
    rms = 20 * np.log10(rms)
    
    return edges[rms >= threshold_db]


def trim(data, fs, fs_vad=16000, hop_length=30, vad_mode=0, threshold_db=-35.0):
    vact = vad(data, fs, fs_vad, hop_length, vad_mode)

    edges = _get_edges(vact)
    edges = _drop_silence(data, edges, threshold_db)

    edges = edges.ravel()

    if edges.any():
        return edges[0], edges[-1]
    else:
        return 0, 0


def split(data, fs, fs_vad=16000, hop_length=30, vad_mode=0, threshold_db=-35.0, min_dur=0.5):
    vact = vad(data, fs, fs_vad, hop_length, vad_mode)

    edges = _get_edges(vact)
    edges = edges[(edges[:, 1] - edges[:, 0]) > fs*min_dur]
    edges = _drop_silence(data, edges, threshold_db)

    return edges