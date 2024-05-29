import { Typography } from "@mui/material";
import './Home.css'
import { Typewriter } from 'react-simple-typewriter'
import GridLines from 'react-gridlines';

const WelcomeScreen = () => {
    return (
        <div className="welcome-container">
            {/*Grid lines is a JavaScript library for displaying grid lines in the background*/}
            <GridLines className="grid-area" cellWidth={40} strokeWidth={0.2} cellWidth2={40}>
                <Typography className="welcome-title">
                    CC1001
                </Typography>
                <Typography className="welcome-message">Thinking Critically about the UN SDGs</Typography>
            </GridLines>
        </div>
    )
}

export default WelcomeScreen;