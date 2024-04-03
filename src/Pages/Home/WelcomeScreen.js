import { Divider, Typography } from "@mui/material";
import './Home.css'

const WelcomeScreen = () => {
    return (
        <div>
            <Typography className="welcome-title">
                Welcome To Our Platform!
            </Typography>
            <Typography className="welcome-message">
                In order to access or create activities, please Log in or Register to unlock the full experience.
            </Typography>
            <Divider className="divider" />
        </div>
    )
}

export default WelcomeScreen;