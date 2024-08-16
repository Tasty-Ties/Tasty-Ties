import { create } from "zustand";
import { getAlbumDetail, getAlbums, getAlbumSort } from "./../service/AlbumAPI";

const useAlbumStore = create((set) => ({
  // 앨범 목록
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
  // 앨범 페이지 정렬(국적 호출코드)
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
