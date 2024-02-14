import { AppBar, Button, Dialog, DialogActions, DialogContent, DialogTitle, InputLabel, MenuItem, Select, TextField, Toolbar, Typography, alertClasses } from '@mui/material'
import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function NavBar() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [occupation, setOccupation] = useState('')
    const [usernameError, setUsernameError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)
    const [occupationError, setOccupationError] = useState(false)
    const [openLogin, setOpenLogin] = useState(false)
    const [openRegister, setOpenRegister] = useState(false)
    const navigate = useNavigate()

    // when the user registers a new account
    const onSubmitRegister = () => {
        setUsernameError(false);
        setPasswordError(false);
        setOccupationError(false);
        let flag = false
        if (username === '') {
            setUsernameError(true)
            flag = true
        }
        if (password === '') {
            setPasswordError(true)
            flag = true
        }
        if (occupation === '') {
            setOccupationError(true)
            flag = true
        }
        if (flag) {
            return
        }

        const data = { username: username, password: password, occupation: occupation }
        axios.post("https://activities-alset-aef528d2fd94.herokuapp.com/activityone/auth/register", data).then((response) => {
            if (response.data.error) {
                alert(response.data.error)
                return
            }
            sessionStorage.setItem("UserId", response.data)
            sessionStorage.setItem("Username", username)
            sessionStorage.setItem("Occupation", occupation)
            setOpenRegister(false)
            navigate('\home')
        })

    }

    // when the user logs in to an exisitng account
    const onSubmitLogin = () => {
        setUsernameError(false);
        setPasswordError(false);
        setOccupationError(false);
        let flag = false
        if (username === '') {
            setUsernameError(true)
            flag = true
        }
        if (password === '') {
            setPasswordError(true)
            flag = true
        }
        if (occupation === '') {
            setOccupationError(true)
            flag = true
        }
        if (flag) {
            return
        }

        const data = { username: username, password: password, occupation: occupation }
        axios.post("https://activities-alset-aef528d2fd94.herokuapp.com/activityone/auth/login", data).then((response) => {
            if (response.data.error) {
                alert(response.data.error)
                return
            }
            sessionStorage.setItem("UserId", response.data)
            sessionStorage.setItem("Username", username)
            sessionStorage.setItem("Occupation", occupation)
            setOpenLogin(false);
            navigate('\home')
        })

    }

    return (
        <AppBar position="static">

            {/*Dialog for user login*/}
            <Dialog open={openLogin} onClose={() => setOpenLogin(false)}>
                <DialogTitle>Login</DialogTitle>
                <DialogContent>
                    <TextField margin='normal' label='Username' error={usernameError} fullWidth onChange={(e) => setUsername(e.target.value)}></TextField>
                    <TextField margin='normal' label='Password' fullWidth error={passwordError} onChange={(e) => setPassword(e.target.value)}></TextField>
                    <InputLabel style={{ marginTop: 10 }}>Occupation</InputLabel>
                    <Select fullWidth error={occupationError} onChange={(e) => setOccupation(e.target.value)}>
                        <MenuItem value="Student">Student</MenuItem>
                        <MenuItem value="Instructor">Instructor</MenuItem>
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button type='submit' onClick={onSubmitLogin}>Submit</Button>
                </DialogActions>
            </Dialog>

            {/*Dialog for user registration*/}
            <Dialog open={openRegister} onClose={() => setOpenRegister(false)}>
                <DialogTitle>Register</DialogTitle>
                <DialogContent>
                    <TextField margin='normal' label='Username' error={usernameError} fullWidth onChange={(e) => setUsername(e.target.value)}></TextField>
                    <TextField margin='normal' label='Password' fullWidth error={passwordError} onChange={(e) => setPassword(e.target.value)}></TextField>
                    <InputLabel style={{ marginTop: 10 }}>Occupation</InputLabel>
                    <Select fullWidth error={occupationError} onChange={(e) => setOccupation(e.target.value)}>
                        <MenuItem value="Student">Student</MenuItem>
                        <MenuItem value="Instructor">Instructor</MenuItem>
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button type='submit' onClick={onSubmitRegister}>Submit</Button>
                </DialogActions>
            </Dialog>

            <Toolbar>
                <Typography onClick={() => { navigate('/home') }} variant="h6" sx={{ flexGrow: 1 }}>
                    NUS ALSET
                </Typography>
                {sessionStorage.getItem('Username') &&
                    <Typography style={{ marginRight: 10 }}>Welcome {sessionStorage.getItem("Username")}</Typography>
                }
                <Button onClick={() => setOpenLogin(true)} color="inherit">Login</Button>
                <Button onClick={() => setOpenRegister(true)} color="inherit">Register</Button>
                <Button onClick={() => { sessionStorage.clear(); localStorage.clear(); window.location.reload() }} color='inherit'>Logout</Button>
            </Toolbar>
        </AppBar>
    )
}

export default NavBar