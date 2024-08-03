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

  sessionId: null,
  setSessionId: (id) => set({ sessionId: id }),

  isVideoActive: true,
  isAudioActive: true,
  setIsVideoActive: () =>
    set((state) => ({
      isVideoActive: !state.isVideoActive,
    })),
  setIsAudioActive: () =>
    set((state) => ({
      isAudioActive: !state.isAudioActive,
    })),
}));

export default useVideoStore;
