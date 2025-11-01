import React from 'react';
import '../css/Photo.css';

// function Photo({ id, data }) {
//   const openImage = () => {
//     window.open(data.path); // updated to use .path, not .photoURL
//   };

//   return (
//     <div className="photo">
//       <img
//         src={data.path}
//         alt={data.fileName}
//         className="photo-img"
//         draggable={false}
//         onClick={openImage}
//       />
//     </div>
//   );
// }

// function Photo({ data }) {
//   const openImage = () => {
//     window.open(`http://localhost:5000/${data.path}`);
//   };

//   return (
//     <div className="photo">
//       <img
//         src={`http://localhost:5000/${data.path}`}
//         alt={data.fileName}
//         className="photo-img"
//         draggable={false}
//         onClick={openImage}
//       />
//     </div>
//   );
// }


function Photo({ id, data }) {
  // Build an absolute URL to the backend image so the browser requests the file
  // from the server instead of navigating the SPA route (which causes "No routes matched").
  const serverBase = `${window.location.protocol}//${window.location.hostname}:5000`;

  const makeAbsolute = (path) => {
    if (!path) return path;
    if (path.startsWith('/')) return serverBase + path;
    return `${serverBase}/${path}`;
  };

  const imageUrl = makeAbsolute(data.path);
  const openImage = () => window.open(imageUrl);

  return (
    <div className="photo">
      <img
        src={imageUrl}
        alt={data.fileName}
        className="photo-img"
        draggable={false}
        onClick={openImage}
      />
    </div>
  );
}

export default Photo;