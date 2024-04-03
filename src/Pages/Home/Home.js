import { Container } from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Home.css'
import WelcomeScreen from "./WelcomeScreen";
import Dashboard from "./Dashboard/Dashboard";

function Home() {
    const [instructor, setInstructor] = useState(false);

    useEffect(() => {

        // checks whether the occupation of the current user is instructor

        if (sessionStorage.getItem("Occupation") === "Instructor") {
            setInstructor(true);
        }
        
    }, []);

    return (
        <Container className="container">

            {/* 
                displays the following - 
                not logged in: welcome screen
                logged in: user dashboard
            */}

            {!sessionStorage.getItem("UserId") ? (<WelcomeScreen />) : (<Dashboard />)}
        </Container>
    );
}

export default Home;
