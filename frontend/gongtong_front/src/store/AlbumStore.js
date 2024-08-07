import { create } from "zustand";
import { getAlbumDetail, getAlbums, getAlbumSort } from "./../service/AlbumAPI";

const useAlbumStore = create((set) => ({
  albumLists: [],
  hasMoreContent: true,
  fetchAlbumLists: async (page, countryCode) => {
    const albumLists = await getAlbums(page, countryCode);
    if (albumLists.length === 0) {
      set({ hasMoreContent: false });
    } else {
      set((state) => ({
        albumLists:
          page === 0 ? albumLists : [...state.albumLists, ...albumLists],
      }));
    }
  },
  albumSortLists: [],
  fetchAlbumSortLists: async () => {
    const albumSortLists = await getAlbumSort();
    set({ albumSortLists });
  },
  albumDetailImageLists: [],
  fetchAlbumDetailImageLists: async (folderId) => {
    const albumDetailImageLists = await getAlbumDetail(folderId);
    set({ albumDetailImageLists });
  },
}));

export default useAlbumStore;
