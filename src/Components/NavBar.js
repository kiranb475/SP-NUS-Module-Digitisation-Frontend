import {
  AppBar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Toolbar,
  Typography,
  alertClasses,
} from "@mui/material";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function NavBar() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [occupation, setOccupation] = useState("");
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [occupationError, setOccupationError] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const navigate = useNavigate();

  // when the user registers a new account
  const onSubmitRegister = () => {
    setUsernameError(false);
    setPasswordError(false);
    setOccupationError(false);
    let flag = false;
    if (username === "") {
      setUsernameError(true);
      flag = true;
    }
    if (password === "") {
      setPasswordError(true);
      flag = true;
    }
    if (occupation === "") {
      setOccupationError(true);
      flag = true;
    }
    if (flag) {
      return;
    }

    const data = {
      username: username,
      password: password,
      occupation: occupation,
    };
    axios
      .post(
        "https://activities-alset-aef528d2fd94.herokuapp.com/activityone/auth/register",
        data
      )
      .then((response) => {
        if (response.data.error) {
          alert(response.data.error);
          return;
        }
        sessionStorage.setItem("UserId", response.data);
        sessionStorage.setItem("Username", username);
        sessionStorage.setItem("Occupation", occupation);
        setOpenRegister(false);
        navigate("home");
        window.location.reload();
      });
  };

  // when the user logs in to an exisitng account
  const onSubmitLogin = () => {
    setUsernameError(false);
    setPasswordError(false);
    setOccupationError(false);
    let flag = false;
    if (username === "") {
      setUsernameError(true);
      flag = true;
    }
    if (password === "") {
      setPasswordError(true);
      flag = true;
    }
    if (occupation === "") {
      setOccupationError(true);
      flag = true;
    }
    if (flag) {
      return;
    }

    const data = {
      username: username,
      password: password,
      occupation: occupation,
    };
    axios
      .post(
        "https://activities-alset-aef528d2fd94.herokuapp.com/activityone/auth/login",
        data
      )
      .then((response) => {
        if (response.data.error) {
          alert(response.data.error);
          return;
        }
        sessionStorage.setItem("UserId", response.data);
        sessionStorage.setItem("Username", username);
        sessionStorage.setItem("Occupation", occupation);
        setOpenLogin(false);
        navigate("home");
        window.location.reload();
      });
  };

  return (
    <AppBar position="static">
      {/*Dialog for user login*/}
      <Dialog open={openLogin} onClose={() => setOpenLogin(false)}>
        <DialogTitle
          style={{
            fontFamily: `"Lato", sans-serif`,
            fontSize: 25,
            paddingBottom: 0,
          }}
        >
          Enter your login details
        </DialogTitle>
        <DialogContent>
          <TextField
            style={{ marginBottom: 0, marginTop: 10 }}
            variant="standard"
            required
            margin="normal"
            label="Username"
            error={usernameError}
            fullWidth
            onChange={(e) => setUsername(e.target.value)}
          ></TextField>
          <TextField
            type="password"
            style={{ marginTop: 15 }}
            variant="standard"
            required
            margin="normal"
            label="Password"
            fullWidth
            error={passwordError}
            onChange={(e) => setPassword(e.target.value)}
          ></TextField>
          <InputLabel required style={{ marginTop: 25 }}>
            Occupation
          </InputLabel>
          <Select
            fullWidth
            error={occupationError}
            onChange={(e) => setOccupation(e.target.value)}
          >
            <MenuItem value="Student">Student</MenuItem>
            <MenuItem value="Instructor">Instructor</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenLogin(false);
            }}
          >
            Cancel
          </Button>
          <Button type="submit" onClick={onSubmitLogin}>
            Log In
          </Button>
        </DialogActions>
      </Dialog>

      {/*Dialog for user registration*/}
      <Dialog open={openRegister} onClose={() => setOpenRegister(false)}>
        <DialogTitle
          style={{
            fontFamily: `"Lato", sans-serif`,
            fontSize: 25,
            paddingBottom: 0,
          }}
        >
          Register with your details
        </DialogTitle>
        <DialogContent>
          <TextField
            style={{ marginBottom: 0, marginTop: 10 }}
            variant="standard"
            required
            margin="normal"
            label="Username"
            error={usernameError}
            fullWidth
            onChange={(e) => setUsername(e.target.value)}
          ></TextField>
          <TextField
            type="password"
            style={{ marginTop: 15 }}
            variant="standard"
            required
            margin="normal"
            label="Password"
            fullWidth
            error={passwordError}
            onChange={(e) => setPassword(e.target.value)}
          ></TextField>
          <InputLabel required style={{ marginTop: 25 }}>
            Occupation
          </InputLabel>
          <Select
            fullWidth
            error={occupationError}
            onChange={(e) => setOccupation(e.target.value)}
          >
            <MenuItem value="Student">Student</MenuItem>
            <MenuItem value="Instructor">Instructor</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenRegister(false);
            }}
          >
            Cancel
          </Button>
          <Button type="submit" onClick={onSubmitRegister}>
            Register
          </Button>
        </DialogActions>
      </Dialog>

      <Toolbar style={{ backgroundColor: "black" }}>
        <Typography
          onClick={() => {
            navigate("/home");
          }}
          variant="h6"
          sx={{
            flexGrow: 1,
            fontFamily: `"Playfair Display", serif`,
            fontSize: 30,
            paddingBottom: 1,
          }}
        >
          Singapore Polytechnic
        </Typography>
        {sessionStorage.getItem("UserId") && (
          <Typography
            style={{
              marginRight: 10,
              fontFamily: `"Bebas Neue", sans-serif`,
              fontSize: 25,
              paddingTop: 5,
            }}
          >
            {sessionStorage.getItem("Username")}
          </Typography>
        )}
        {!sessionStorage.getItem("UserId") && (
          <Button
            onClick={() => setOpenLogin(true)}
            color="inherit"
            style={{ fontFamily: `"Oswald", sans-serif`, fontSize: 20 }}
          >
            Log in
          </Button>
        )}
        {!sessionStorage.getItem("UserId") && (
          <Button
            onClick={() => setOpenRegister(true)}
            color="inherit"
            style={{ fontFamily: `"Oswald", sans-serif`, fontSize: 20 }}
          >
            Register
          </Button>
        )}
        {sessionStorage.getItem("UserId") && (
          <Button
            onClick={() => {
              sessionStorage.clear();
              localStorage.clear();
              navigate("/");
            }}
            color="inherit"
            style={{ fontFamily: `"Oswald", sans-serif`, fontSize: 20 }}
          >
            Log out
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
