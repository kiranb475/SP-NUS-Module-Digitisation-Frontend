import { Typography, Box } from '@mui/material';
import './Activity3.css'

const DisplayTranscript = ({ activityMVCContent, highlightingNotAllowed }) => {

    // displays interviewee text
    const displayInterviewee = (data, key) => {
        return Object.entries(data).map(([key2, value]) => (
            <Typography
                display="inline"
                onClick={handleClick}
                dangerouslySetInnerHTML={{ __html: value.html }}
            ></Typography>
        ));
    };

    // handles highlighting
    const handleClick = (event) => {
        if (!highlightingNotAllowed) {
            //checks if background color is green
            if (event.target.style.backgroundColor === "rgb(23, 177, 105)") {
                //changes it to blue
                event.target.style.backgroundColor = "rgb(108, 180, 238)";
            //checks if background color is blue
            } else if (event.target.style.backgroundColor === "rgb(108, 180, 238)") {
                //changes it to green
                event.target.style.backgroundColor = "rgb(23, 177, 105)";
            } else if (event.target.style.backgroundColor === "") {
                //background color changed to yellow
                event.target.style.backgroundColor = "rgb(255, 199, 44)";
                event.target.style.borderRadius = "4px";
                event.target.style.padding = "2px"; 
            } else {
                event.target.style.backgroundColor = "";
                event.target.style.borderRadius = "";
                event.target.style.padding = ""; 
            }
        }
    };
    return (
        <Box id="content-container" className="contentContainer">
            {Object.entries(activityMVCContent).map(([key, value]) => {
                if (key % 2 !== 0) {
                    return (
                        <div style={{marginBottom:"20px"}}>
                            <Typography display="inline">{value.tag}: </Typography>
                            <Typography
                                display="inline"
                                dangerouslySetInnerHTML={{ __html: value.activity_mvc.html, }}
                            ></Typography>
                        </div>
                    );
                } else {
                    return (
                        <div style={{marginBottom:"20px"}}>
                            <Typography display="inline">
                                <strong>{value.tag}</strong>:{" "}
                            </Typography>
                            {displayInterviewee(value.activity_mvc, key)}
                        </div>
                    );
                }
            })}
        </Box>
    );
}

export default DisplayTranscript;
