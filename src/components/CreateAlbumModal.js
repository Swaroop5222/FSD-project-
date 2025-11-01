import React, { useRef, useState } from "react";
import { Button, Typography } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

function CreateAlbumModal({ isCreateAlbumOpen, setIsCreateAlbumOpen, refresh }) {
  const [error, setError] = useState(false);
  const inputRef = useRef();

  const handleCreateAlbum = async (e) => {
    e.preventDefault();
    setError(false);
    const newName = inputRef.current.value.trim();
    if (newName.length < 1 || newName.length > 16) return setError(true);

    try {
      const response = await fetch("http://localhost:5000/albums", { // Use full backend URL
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      });
      if (!response.ok) {
        setError(true);
        return;
      }
      await response.json();
      if (refresh) refresh();
      setIsCreateAlbumOpen(false);
    } catch (e) {
      setError(true);
      console.error(e);
    }
  };

  const handleClose = () => {
    setError(false);
    setIsCreateAlbumOpen(false);
  };

  return (
    <Dialog open={isCreateAlbumOpen} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">New Album</DialogTitle>
      <form onSubmit={handleCreateAlbum} autoComplete="off">
        <DialogContent>
          <Typography>Enter a name for your new Album</Typography>
          <TextField
            error={error}
            id="filled-error-helper-text"
            autoFocus
            margin="dense"
            label="Album Name"
            type="text"
            fullWidth
            required
            inputRef={inputRef}
            helperText="Name should be between 1 and 16 characters"
            variant="filled"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button type="submit" color="primary" variant="contained">
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default CreateAlbumModal;
