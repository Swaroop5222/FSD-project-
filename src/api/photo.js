import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000'; // Update with your backend URL

// Upload photos to an album
export async function uploadPhoto(files, currentAlbum, setUploadMessage) {
  for (let file of files) {
    try {
      const formData = new FormData();
      formData.append('image', file); // 'image' must match multer field name
      formData.append('albumId', currentAlbum.albumId);

      await axios.post(`${APIBASEURL}/albums/${currentAlbum.albumId}/photos`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUploadMessage('Photo Uploaded Successfully!');
    } catch (error) {
      setUploadMessage('Error while uploading photo!');
      console.error('Error uploading photo:', error);
    }
  }
}

// Get photos in the root album
export const getRootPhotos = async (uid, setPhotos) => {
  try {
    // Replace ROOT with actual root album id if needed
    const response = await axios.get(`${API_BASE_URL}/photos/ROOT`);
    setPhotos(response.data);
  } catch (error) {
    console.error('Error fetching root photos', error);
  }
};

// Get photos in a specific album
export const getAlbumPhotos = async (currentAlbumId, setPhotos) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getalbums/${currentAlbumId}/photos`);
    setPhotos(response.data);
  } catch (error) {
    console.error('Error fetching album photos', error);
  }
};

// Delete a photo
export const deletePhoto = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/photos/${id}`);
  } catch (error) {
    alert('Error deleting photo');
    console.error(error);
  }
};
