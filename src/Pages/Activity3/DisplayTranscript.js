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
            if (event.target.style.backgroundColor === "lightgreen") {
                event.target.style.backgroundColor = "lightblue";
            } else if (event.target.style.backgroundColor === "lightblue") {
                event.target.style.backgroundColor = "lightgreen";
            } else if (event.target.style.backgroundColor === "") {
                event.target.style.backgroundColor = "yellow";
            } else {
                event.target.style.backgroundColor = "";
            }
        }
    };
    return (
        <Box id="content-container" className="contentContainer">
            {Object.entries(activityMVCContent).map(([key, value]) => {
                if (key % 2 !== 0) {
                    return (
                        <div>
                            <Typography display="inline">{value.tag}: </Typography>
                            <Typography
                                display="inline"
                                dangerouslySetInnerHTML={{ __html: value.activity_mvc.html, }}
                            ></Typography>
                            <br />
                            <br />
                        </div>
                    );
                } else {
                    return (
                        <div>
                            <Typography display="inline">
                                <strong>{value.tag}</strong>:{" "}
                            </Typography>
                            {displayInterviewee(value.activity_mvc, key)}
                            <br />
                            <br />
                        </div>
                    );
                }
            })}
        </Box>
    );
}

export default DisplayTranscript;
