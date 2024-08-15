import { pushApiErrorNotification } from "../components/common/Toast";
import api from "./Api";

// 앨범 목록
export const getAlbums = async (page, countryCode) => {
  try {
    const response = await api.get("/albums", {
      params: {
        page: page - 1,
        size: 12,
        countryCode: countryCode,
      },
    });
    return response.data.data;
  } catch (e) {
    pushApiErrorNotification(e);
    return [];
  }
};

// 앨범 상세
export const getAlbumDetail = async (folderId) => {
  try {
    const response = await api.get(`/albums/${folderId}`);
    return response.data.data;
  } catch (e) {
    pushApiErrorNotification(e);
  }
};

// 앨범 사진 순서 수정
export const patchAlbumImagesOrder = async (folderId, photoOrderChangeDtos) => {
  try {
    await api.patch(`/albums/${folderId}/order`, photoOrderChangeDtos);
  } catch (e) {
    pushApiErrorNotification(e);
  }
};

// 앨범 필터
export const getAlbumSort = async () => {
  try {
    const response = await api.get("/albums");
    return response.data.data.countrySearchDtoList;
  } catch (e) {
    pushApiErrorNotification(e);
  }
};
