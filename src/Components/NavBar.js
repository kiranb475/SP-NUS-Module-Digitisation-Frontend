import { AppBar, Button, Dialog, DialogActions, DialogContent, DialogTitle, InputLabel, MenuItem, Select, TextField, Toolbar, Typography, } from "@mui/material";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './NavBar.css'

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

  //user login/registration
  const onSubmit = (action) => {

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

    axios.post(`https://activities-alset-aef528d2fd94.herokuapp.com/activityone/auth/${action}`, data)
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
  }

  //content displayed within the dialog
  const dialogContent = () => {
    return (
      <>
        <TextField
          variant="standard"
          required
          margin="normal"
          label="Username"
          error={usernameError}
          fullWidth
          onChange={(e) => setUsername(e.target.value)}
          className="username-input"
        ></TextField>
        <TextField
          className="password-input"
          type="password"
          variant="standard"
          required
          margin="normal"
          label="Password"
          fullWidth
          error={passwordError}
          onChange={(e) => setPassword(e.target.value)}
        ></TextField>
        <InputLabel required className="occupation-input" >
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
      </>
    )
  }

  return (

    <AppBar position="static">
      {/*Dialog for user login*/}
      <Dialog open={openLogin} onClose={() => setOpenLogin(false)}>
        <DialogTitle className="login-header">
          <Typography className="login-title"><strong>Welcome back!</strong></Typography>
        </DialogTitle>
        <DialogContent>
          {dialogContent()}
        </DialogContent>
        <DialogActions className="login-action">
          <Button fullWidth onClick={() => { setOpenLogin(false); }} className="login-button">
            Cancel
          </Button>
          <Button fullWidth type="submit" onClick={() => onSubmit("login")} className="login-button">
            Log In
          </Button>
        </DialogActions>
      </Dialog>

      {/*Dialog for user registration*/}
      <Dialog open={openRegister} onClose={() => setOpenRegister(false)}>
        <DialogTitle className="register-header">
          <Typography className="register-title"><strong>Hello there!</strong></Typography>
        </DialogTitle>
        <DialogContent>
          {dialogContent()}
        </DialogContent>
        <DialogActions className="register-action">
          <Button fullWidth onClick={() => { setOpenRegister(false) }} className="register-button">
            Cancel
          </Button>
          <Button fullWidth type="submit" onClick={() => onSubmit("register")} className="register-button">
            Register
          </Button>
        </DialogActions>
      </Dialog>

      {/*Contents of navigation bar*/}
      <Toolbar className="toolbar-container">
        <Typography
          onClick={() => { navigate("/home"); }}
          variant="h6"
          className="toolbar-title"
        >
          Singapore Polytechnic
        </Typography>
        {sessionStorage.getItem("UserId") && (
          <Typography className="toolbar-username">
            {sessionStorage.getItem("Username")}
          </Typography>
        )}
        {!sessionStorage.getItem("UserId") && (
          <Button disableRipple onClick={() => setOpenLogin(true)} color="inherit" className="toolbar-login">
            Login
          </Button>
        )}
        {!sessionStorage.getItem("UserId") && (
          <Button disableRipple onClick={() => setOpenRegister(true)} color="inherit" className="toolbar-register">
            Register
          </Button>
        )}
        {sessionStorage.getItem("UserId") && (
          <Button disableRipple onClick={() => {
            sessionStorage.clear();
            localStorage.clear();
            navigate("/");
          }}
            color="inherit" className="toolbar-logout"
          >
            Logout
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
