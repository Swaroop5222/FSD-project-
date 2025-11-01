// import React, { useState, useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { Button, CircularProgress } from "@material-ui/core";
// import { useNavigate } from "react-router-dom";
// import { setUser } from "../actions";

// function Login() {
//   const dispatch = useDispatch();
//   const [isLoading, setIsLoading] = useState(true);
//   const navigate = useNavigate();

//   // useEffect(() => {
//   //   const unsubscribe = onAuthStateChanged(auth, (user) => {
//   //     if (user) {
//   //       const loggedUser = {
//   //         uid: user.uid,
//   //         displayName: user.displayName,
//   //         photoURL: user.photoURL,
//   //         email: user.email,
//   //       };
//   //       dispatch(setUser(loggedUser));
//   //     } else setIsLoading(false);
//   //   });
//   //   return unsubscribe;
//   // }, [dispatch]);

//   const login = () => {
//     navigate("/homepage");
//   };

//   return (
//     <div style={styles}>
//       {isLoading ? (
//         <CircularProgress />
//       ) : (
//         <>
//           <img
//             src="https://www.google.com/photos/about/static/images/ui/logo-photos.png"
//             alt=""
//           />
//           <Button onClick={login} variant="contained" color="primary">
//             Sign In With Google
//           </Button>
//         </>
//       )}
//     </div>
//   );
// }

// const styles = {
//   width: "100%",
//   height: "100vh",
//   display: "grid",
//   placeItems: "center",
// };

// export default Login;

import React from "react";
import { useDispatch } from "react-redux";
import Button from "@material-ui/core/Button";
import { useNavigate } from "react-router-dom";
import { setUser } from "../actions";
import '../css/Login.css';



function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const login = () => {
    // Set a dummy user, since you're not using real authentication
    const dummyUser = {
      uid: "123",
      displayName: "Sample User",
    };
    dispatch(setUser(dummyUser));
    navigate("/");
  };

  const styles = {
    width: "100%",
    height: "100vh",
    display: "grid",
    placeItems: "center",
  };

  return (
    <div style={styles}>
      <img
        src="https://www.google.com/photos/about/static/images/ui/logo-photos.png"
        alt=""
        style={{ marginBottom: "24px" }}
      />
      <Button onClick={login} variant="contained" color="primary">
        Start
      </Button>
    </div>
  );
}

export default Login;
