import { create } from "zustand";

const useVideoStore = create((set) => ({
  OV: null,
  setOV: (OVObject) => set({ OV: OVObject }),

  selectedAudioDevice: null,
  selectedVideoDevice: null,

  setSelectedAudioDevice: (audioDevice) =>
    set({ selectedAudioDevice: audioDevice }),
  setSelectedVideoDevice: (videoDevice) =>
    set({ selectedVideoDevice: videoDevice }),
}));

export default useVideoStore;
