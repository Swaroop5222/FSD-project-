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
  const openImage = () => window.open(data.path);

  // Updated to use data.path, not data.photoURL
  return (
    <div className="photo">
      <img
        src={data.path}
        alt={data.fileName}
        className="photo-img"
        draggable={false}
        onClick={openImage}
      />
    </div>
  );
}

export default Photo;