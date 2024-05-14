import { Typography, Box } from '@mui/material';
import './Activity2.css'

const DisplayTranscript = ({ activityMVCContent, highlightingNotAllowed }) => {

    const highlightedStyle = {
        backgroundColor: "rgb(255, 199, 44)",
    };

    // displays interviewee text
    const displayInterviewee = (data, key) => {
        return Object.entries(data).map(([key2, value]) => (
            <Typography
                sx={{ display: 'inline' }}
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
                        <div style={{ marginBottom: "20px" }}>
                            <Typography
                                sx={{ display: 'inline' }}
                                dangerouslySetInnerHTML={{ __html: `<span>${value.tag}:</span> ${value.activity_mvc.html}` }}
                            ></Typography>

                        </div>
                    );
                } else {
                    return (
                        <div style={{ marginBottom: "20px" }}>
                            <Typography sx={{ display: 'inline' }}>
                                <strong>{value.tag}</strong>:{" "}
                            </Typography>
                            {displayInterviewee(value.activity_mvc, key)}
                        </div>
                    );
                }
            })}
        </Box>
    )

}

export default DisplayTranscript;