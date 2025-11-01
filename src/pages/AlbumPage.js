import React, { useState, useEffect } from "react";
import "../css/HomePage.css";
import Photo from "../components/Photo";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";

function AlbumPage() {
  const navigate = useNavigate();
  const currentAlbum = useSelector((state) => state.currentAlbum);
  const [photos, setPhotos] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (currentAlbum.albumId === "ROOT") navigate(`/`, { replace: true });
  }, [navigate, currentAlbum.albumId]);

  useEffect(() => {
    let cancel = false;

    async function fetchPhotos() {
      try {
        const res = await fetch(
          `http://localhost:5000/getalbums/${currentAlbum.albumId}/photos`
        );
        const data = await res.json();
        if (!cancel) setPhotos(data);
      } catch (e) {
        console.error(e);
      }
    }

    fetchPhotos();

    return () => {
      cancel = true;
    };
  }, [currentAlbum.albumId]);

  const openDeleteModal = () => setOpen(true);
  const closeDeleteModal = () => setOpen(false);

  const handleDeleteAlbum = async () => {
    try {
      await fetch(`http://localhost:5000/albums/${currentAlbum.albumId}`, {
        method: "DELETE",
      });
      closeDeleteModal();
      navigate(`/`, { replace: true });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="albumpage">
      <div className="albumpage-header">
        <Typography variant="h5">{currentAlbum.albumName}</Typography>
        <IconButton onClick={openDeleteModal}>
          <DeleteIcon />
        </IconButton>
      </div>
      <div className="albumpage-photos">
        {photos.map((photo) => (
          <Photo key={photo._id} id={photo._id} data={photo} />
        ))}
      </div>
      <Dialog
        open={open}
        onClose={closeDeleteModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Album Delete Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Deleting the Album will also delete the Photos inside it. Do you want to delete this Album?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteModal} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteAlbum} color="primary" autoFocus variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AlbumPage;
