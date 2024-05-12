import { Typography, Box } from '@mui/material';
import './Activity2.css'

const DisplayTranscript = ({activityMVCContent, highlightingNotAllowed}) => {

    const highlightedStyle = {
        backgroundColor: "rgb(255, 199, 44)",
    };

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

    // handles highlighting of interviewee text
    const handleClick = (event) => {
        if (!highlightingNotAllowed || sessionStorage.getItem("Occupation") === "Instructor") {
            const currentStyle = event.target.style;
            if (currentStyle.backgroundColor === "rgb(255, 199, 44)") {
                currentStyle.backgroundColor = "";
                currentStyle.borderRadius = "";
                currentStyle.padding = "";
            } else {
                currentStyle.backgroundColor = highlightedStyle.backgroundColor;
                currentStyle.borderRadius = "4px";
                currentStyle.padding = "2px"; 
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
                                dangerouslySetInnerHTML={{__html: value.activity_mvc.html,}}
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
    )

}

export default DisplayTranscript;