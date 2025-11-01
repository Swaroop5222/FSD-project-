import React, { useState, useEffect } from "react";
import "../css/HomePage.css";
import Album from "../components/Album";
import Photo from "../components/Photo";
import CreateAlbumModal from "../components/CreateAlbumModal";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentAlbum } from "../actions";
import axios from 'axios';


function HomePage() {
  const dispatch = useDispatch();
  const currentAlbum = useSelector((state) => state.currentAlbum);
  const [albums, setAlbums] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [isCreateAlbumOpen, setIsCreateAlbumOpen] = useState(false);
  const API_BASE_URL = 'http://localhost:5000';

  // useEffect(() => {
  //   let cancel = false;

  //   async function fetchAlbums() {
  //     try {
  //       const res = await fetch("http://localhost:5000/albums");
  //       const data = await res.json();
  //       if (!cancel) setAlbums(data);
  //     } catch (e) {
  //       console.error(e);
  //     }
  //   }

  //   fetchAlbums();

  //   return () => {
  //     cancel = true;
  //   };
  // }, []);

  // useEffect(() => {
  //   let cancel = false;

  //   async function fetchPhotos() {
  //     try {
  //       const url =
  //         currentAlbum?.albumId === "ROOT"
  //           ? "http://localhost:5000/photos"
  //           : `http://localhost:5000/albums/${currentAlbum.albumId}/photos`;
  //       const res = await fetch(url);
  //       const data = await res.json();
  //       if (!cancel) setPhotos(data);
  //     } catch (e) {
  //       console.error(e);
  //     }
  //   }

  //   fetchPhotos();

  //   return () => {
  //     cancel = true;
  //   };
  // }, [currentAlbum]);

  useEffect(() => {
    let cancel = false;
    async function fetchAlbums() {
      try {
        const res = await axios.get(`${API_BASE_URL}/albums`);
        if (!cancel) setAlbums(res.data);
        if (!cancel && res.data.length > 0) {
          dispatch(setCurrentAlbum(res.data[0])); // Set first album initially
        }
      } catch (error) {
        console.error("Error fetching albums:", error);
      }
    }
    fetchAlbums();
    return () => {
      cancel = true;
    };
  }, [dispatch]);

  useEffect(() => {
    if (!currentAlbum?._id) {
      setPhotos([]);
      return;
    }

    let cancel = false;
    async function fetchPhotos() {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/albums/${currentAlbum._id}/photos`
        );
        if (!cancel) setPhotos(response.data);
      } catch (error) {
        console.error("Error fetching photos:", error);
      }
    }
    fetchPhotos();

    return () => {
      cancel = true;
    };
  }, [currentAlbum]);


  const openCreateAlbumModal = () => setIsCreateAlbumOpen(true);

  async function handleDeleteAlbum(albumId) {
    if (!window.confirm("Are you sure you want to delete this album?")) return;
    try {
      const res = await fetch(`http://localhost:5000/albums/${albumId}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error('Failed to delete album');
      const data = await res.json();
      alert(data.message);
      setAlbums(prev => prev.filter(album => album._id !== albumId));
    } catch (error) {
      alert('Error deleting album: ' + error.message);
    }
  }

  return (
    <div className="homepage-albums">
      {albums.map(album => (
        <div key={album._id} className="album-item">
          <Album id={album._id} data={album} />
          <button onClick={() => handleDeleteAlbum(album._id)}>Delete Album</button>
        </div>
      ))}
      <div onClick={openCreateAlbumModal} title="Create New Album" className="homepage-photoAlbum" style={{ backgroundColor: "#D0D0D0" }}>
        <AddIcon fontSize="large" /> Create Album
      </div>
      <CreateAlbumModal
        isCreateAlbumOpen={isCreateAlbumOpen}
        setIsCreateAlbumOpen={setIsCreateAlbumOpen}
        refresh={() => {
          // Refetch albums
          fetch("http://localhost:5000/albums")
            .then((res) => res.json())
            .then(setAlbums)
            .catch(console.error);
        }}
      />
    </div>
    // <div className="homepage">
    //   <Typography variant="h5">Albums</Typography>

    //   <div className="homepage-albums">
    //     <div
    //       onClick={openCreateAlbumModal}
    //       title="Create New Album"
    //       className="homepage-photoAlbum"
    //       style={{ backgroundColor: "#D0D0D0" }}
    //     >
    //       <AddIcon fontSize="large" />
    //       Create Album
    //     </div>
    //     {albums.map((album) => (
    //       <Album key={album._id} id={album._id} data={album} />
    //     ))}
    //   </div>
    //   <Typography variant="h5">Photos</Typography>
    //   <div className="homepage-photos">
    //     {photos.map((photo) => (
    //       <Photo key={photo._id} id={photo._id} data={photo} />
    //     ))}
    //   </div>
    //   <CreateAlbumModal
    //     isCreateAlbumOpen={isCreateAlbumOpen}
    //     setIsCreateAlbumOpen={setIsCreateAlbumOpen}
    //     refresh={() => {
    //       // Refetch albums
    //       fetch("http://localhost:5000/albums")
    //         .then((res) => res.json())
    //         .then(setAlbums)
    //         .catch(console.error);
    //     }}
    //   />
    // </div>
  );
}

export default HomePage;

