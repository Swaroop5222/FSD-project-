import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000'; // Change to your backend URL

// Get albums for user
export const getAlbums = async (cb, uid) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/albums/${uid}`);
    cb(response.data);
  } catch (error) {
    console.error('Error fetching albums', error);
  }
};

// Create new album
export const createAlbum = async (albumName, uid) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/albums`, {
      name: albumName,
      uid,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating album', error);
  }
};

// Delete album and associated photos
export const deleteAlbum = async (photos, currentAlbumId) => {
  try {
    await axios.delete(`${API_BASE_URL}/albums/${currentAlbumId}`);
  } catch (error) {
    console.error('Error deleting album', error);
  }
};
