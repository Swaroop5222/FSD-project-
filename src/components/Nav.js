import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, IconButton, Snackbar, Typography } from "@material-ui/core";
import PublishIcon from "@material-ui/icons/Publish";
import { setUser } from "../actions";
import "../css/Nav.css";

function Nav() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileRef = useRef();
  const [uploadMessage, setUploadMessage] = useState(null);
  const currentAlbum = useSelector((state) => state.currentAlbum);

  const logout = () => {
    dispatch(setUser(null));
    navigate("/login");
  };

  const getUploadImages = () => {
    fileRef.current?.click();
  };

  const handleUploadImage = async () => {
    const photoFiles = fileRef.current.files;
    if (!photoFiles.length) return;
    for (let photo of photoFiles) {
      if (!photo.type.startsWith("image")) {
        alert("Only image files can be uploaded!");
        return;
      }
    }
    for (let file of photoFiles) {
      const formData = new FormData();
      formData.append("image", file);
      try {
        await fetch(`http://localhost:5000/albums/${currentAlbum.albumId}/photos`, {
          method: "POST",
          body: formData,
        });
        setUploadMessage("Photo Uploaded Successfully!");
      } catch (error) {
        setUploadMessage("Error while uploading photo!");
        console.error("Error uploading photo:", error);
      }
    }
  };

  return (
    <div className="nav">
      <div className="nav-left">
        <Typography variant="h6">My Photos</Typography>
        {/* You may remove LOGOUT button if not needed */}
      </div>
      <div className="nav-right">
        <IconButton onClick={getUploadImages}>
          <PublishIcon />
        </IconButton>
        <input
          type="file"
          onChange={handleUploadImage}
          multiple
          ref={fileRef}
          style={{ display: "none" }}
          accept="image/*"
        />
        <Snackbar
          open={Boolean(uploadMessage)}
          autoHideDuration={6000}
          onClose={() => setUploadMessage(null)}
          message={uploadMessage}
        />
      </div>
    </div>
  );
}

export default Nav;
