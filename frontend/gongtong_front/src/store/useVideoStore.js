import { create } from "zustand";

const useVideoStore = create((set) => ({
  OV: null,
  setOV: (OVObject) => set({ OV: OVObject }),

  selectedAudioDevice: null,
  selectedVideoDevice: null,
  setSelectedAudioDevice: (audioDevice) => {
    console.log("오디오 디바이스 변경 호출됨", audioDevice);
    set({ selectedAudioDevice: audioDevice });
  },
  setSelectedVideoDevice: (videoDevice) => {
    console.log("비디오 디바이스 변경 호출됨", videoDevice);
    set({ selectedVideoDevice: videoDevice });
  },

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

  liveClassImage: [null, null, null, null],
  setLiveClassImage: (index, value) =>
    set((state) => {
      console.log(state.liveClassImage);
      const newImage = [...state.liveClassImage];
      newImage[index] = value;
      return { liveClassImage: newImage };
    }),
  setRemoveLiveClassImage: (index) =>
    set((state) => {
      const newImage = [...state.liveClassImage];
      newImage[index].revokeObjectURL();
      newImage[index] = null;
      return { liveClassImage: newImage };
    }),
  setEmptyLiveClassImage: () =>
    set((state) => {
      state.liveClassImage.map((image, i) => image.revokeObjectURL());
    }),

  classData: null,
  setClassData: (data) => set({ classData: data }),
}));

export default useVideoStore;
