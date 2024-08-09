import api from "./Api";

// 앨범 목록
export const getAlbums = async (page) => {
  try {
    const response = await api.get("/albums", {
      params: {
        page: page,
        size: 12,
      },
    });
    return response.data.data.folderListDtoPage.content;
  } catch (error) {
    console.log("AlbumAPI - getAlbumsError : " + error);
    return [];
  }
};

// 앨범 상세
export const getAlbumDetail = async (folderId) => {
  try {
    const response = await api.get(`/albums/${folderId}`);
    return response.data.data;
  } catch (error) {
    console.log("AlbumAPI - getAlbumDetailError : " + error);
  }
};

// 앨범 사진 순서 수정
export const patchAlbumImagesOrder = async (folderId, photoOrderChangeDtos) => {
  try {
    await api.patch(`/albums/${folderId}/order`, photoOrderChangeDtos);
  } catch (error) {
    console.log("AlbumAPI - patchAlbumImagesOrderError : " + error);
  }
};

// 앨범 필터
export const getAlbumSort = async () => {
  try {
    const response = await api.get("/albums");
    return response.data.data.countrySearchDtoList;
  } catch (error) {
    console.log("AlbumAPI - getAlbumSortError : " + error);
  }
};
