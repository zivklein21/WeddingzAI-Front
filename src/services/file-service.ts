import apiClient from "./api-client";

interface UploadResponse {
  url: string;
}

// For uploading JSON files
const uploadJsonFile = async (json: File) => {
  const formData = new FormData();
  formData.append("file", json);

  const response = await apiClient.post<UploadResponse>("/file", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response;
};

// For uploading image files
const uploadImageFile = async (image: File) => {
  const formData = new FormData();
  formData.append("file", image);

  const response = await apiClient.post<UploadResponse>("/file", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response;
};

export default { uploadJsonFile, uploadImageFile };
