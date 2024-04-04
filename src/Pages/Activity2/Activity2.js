import { Container, Typography, Box, Button, FormControlLabel, Switch, Divider } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import DisplayTranscript from "./DisplayTranscript";
import './Activity2.css'

const Activity2 = () => {
    const [activityMVCContent, setActivityMVCContent] = useState({});
    const [userData, setUserData] = useState({});
    const [highlightingNotAllowed, setHighlightingNotAllowed] = useState(false);
    const [label, setLabel] = useState("Activity 2 Label");
    const [instruction, setInstruction] = useState(`Read through the transcript and click on sentences from the <strong>interviewee</strong> that you think provide insights or convey important information. Clicking a sentence will highlight it in yellow. Clicking a highlighted sentence again will unhighlight it. When you are satisfied with your sentence selections, click the Submit button to continue to the next activity. Your choices of which sentences to highlight will be carried forward to the next activity.`);
    const [newChain, setNewChain] = useState(false);
    const [instructor, setInstructor] = useState(false);
    const [blankTemplate, setBlankTemplate] = useState(false)
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {

        // checks if id passed in the url is null
        if (id === "null") {
            alert("Please go back to the previous activity and submit it to continue.");
            navigate("/")
        }

        // checks occupation of the user
        if (sessionStorage.getItem("Occupation") == "Instructor") {
            setInstructor(true);
        }

        // if valid id exists, fetch data from activity 2 table
        if (id) {
            axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/activitytwo/byId/${id}`)
                .then((response) => {

                    if (response.data !== null) {
                        if (response.data.predefinedHighlighting !== null) {
                            setHighlightingNotAllowed(response.data.predefinedHighlighting);
                        }
                        setLabel(response.data.label);
                        setInstruction(response.data.instruction);
                        setUserData(response.data);

                        // if transcript data has been entered
                        if (response.data.content !== null && Object.entries(response.data.content).length !== 0) {
                            let interviewer = response.data.content[1].questioner_tag;
                            let interviewee = response.data.content[2].response_tag;

                            let activity_mvc_data = {};

                            for (let i = 1; i < Object.keys(response.data.activity_mvc).length + 1; i++) {
                                if (i % 2 !== 0) {
                                    activity_mvc_data[i] = {
                                        tag: interviewer,
                                        activity_mvc: response.data.activity_mvc[i],
                                    };
                                } else {
                                    activity_mvc_data[i] = {
                                        tag: interviewee,
                                        activity_mvc: response.data.activity_mvc[i],
                                    };
                                }
                            }
                            setActivityMVCContent(activity_mvc_data);

                        } else {
                            setBlankTemplate(true)
                        }
                    }
                });

        } else if (id !== "null") {

            // since instance of activity two doesn't exist, get data from activity one.

            axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/activityone/byId/${sessionStorage.getItem("ActivityOneId")}`)
                .then((response) => {
                    if (response.data !== null) {
                        setUserData(response.data);
                        if (response.data.content !== null && Object.entries(response.data.content).length !== 0) {
                            let interviewer = response.data.content[1].questioner_tag;
                            let interviewee = response.data.content[2].response_tag;

                            let activity_mvc_data = {};

                            for (let i = 1; i < Object.keys(response.data.activity_mvc).length + 1; i++) {
                                if (i % 2 !== 0) {
                                    activity_mvc_data[i] = {
                                        tag: interviewer,
                                        activity_mvc: response.data.activity_mvc[i],
                                    };
                                } else {
                                    activity_mvc_data[i] = {
                                        tag: interviewee,
                                        activity_mvc: response.data.activity_mvc[i],
                                    };
                                }
                            }
                            setActivityMVCContent(activity_mvc_data);
                        } else {
                            setBlankTemplate(true)
                        }

                    } else {
                        alert(
                            "Before progressing to Activity 2, please complete Activity 1."
                        );
                    }
                });
        } else if (id === "null") {
            alert(
                "Please go back to the previous activity and submit it to continue."
            );
        }
    }, []);

    // gets activity mvc
    const getActivityMVC = (value) => {
        const element = document.querySelector(`[id="${value}"]`);
        if (element) {
            const htmlContent = element.outerHTML;
            const backgroundColor = element.style.backgroundColor;
            const inlineStyles = element.getAttribute("style")
                ? element.getAttribute("style")
                : "No inline styles";
            return { html: htmlContent, css: inlineStyles };
        } else {
            alert("Element not found");
            return undefined;
        }
    };

    // handles user submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        let userContent = userData;
        const check = new RegExp("background-color: yellow", "g");

        for (let i = 1; i < Object.keys(userContent.activity_mvc).length + 1; i++) {
            if (i % 2 != 0) {
                let activity_mvc_value = getActivityMVC(i.toString());
                userContent.activity_mvc[i] = activity_mvc_value;
                userContent.content[i].sentenceUserHighlightA2 = false;
            } else {
                for (
                    let j = 1; j < Object.keys(userContent.activity_mvc[i]).length + 1; j++) {
                    let activity_mvc_value = getActivityMVC(i.toString() + j.toString());
                    userContent.activity_mvc[i][j] = activity_mvc_value;
                    if (activity_mvc_value.css.match(check)) {
                        userContent.content[i].response_text[j].sentenceUserHighlightA2 = true;
                    } else {
                        userContent.content[i].response_text[j].sentenceUserHighlightA2 = false;
                    }
                }
            }
        }

        if (!id) {
            delete userContent["transcriptEditable"];
        }
        delete userContent["id"];
        userContent.predefinedHighlighting = highlightingNotAllowed;
        userContent.UserId = sessionStorage.getItem("UserId");
        userContent.label = document.getElementById("activity-two-label").innerHTML;
        userContent.instruction = document.getElementById("activity-two-instruction").innerHTML;
        let data = {
            id: sessionStorage.getItem("ActivitiesId"),
            content: userContent,
        };

        let event;

        if (id) {
            await axios.post(`https://activities-alset-aef528d2fd94.herokuapp.com/activitytwo/byId/${id}`, data);
            if (newChain) {
                await axios.post(`https://activities-alset-aef528d2fd94.herokuapp.com/activitytwo/byId/${sessionStorage.getItem("ActivitiesId")}/new-chain`);
                sessionStorage.removeItem("ActivityThreeId");
                sessionStorage.removeItem("ActivityFourId");
                sessionStorage.removeItem("ActivityFiveId");
                sessionStorage.removeItem("ActivitySixId");

                event = "Reinitialise";
            } else {
                event = "Update";
            }
        } else {
            await axios.post("https://activities-alset-aef528d2fd94.herokuapp.com/activitytwo", data)
                .then((response) => {
                    const ActivityTwoId = response.data.id;
                    sessionStorage.setItem("ActivityTwoId", ActivityTwoId);
                });

            event = "Create";
        }

        if (!instructor) {
            let data = {
                DateTime: Date.now(),
                StudentTemplateId: sessionStorage.getItem("ActivitiesId"),
                StudentId: sessionStorage.getItem("UserId"),
                Event: event,
                ActivityId: sessionStorage.getItem("ActivityTwoId"),
                ActivityType: "Activity 2",
            };
            await axios.post(`https://activities-alset-aef528d2fd94.herokuapp.com/studentlog/create`, data);
        } else {
            let data = {
                DateTime: Date.now(),
                ActivitySequenceId: sessionStorage.getItem("ActivitiesId"),
                InstructorId: sessionStorage.getItem("UserId"),
                Event: event,
                ActivityId: sessionStorage.getItem("ActivityTwoId"),
                ActivityType: "Activity 2",
            };
            await axios.post(`https://activities-alset-aef528d2fd94.herokuapp.com/instructorlog/create`, data);
        }

        sessionStorage.setItem("predefinedHighlighting", highlightingNotAllowed);
        if (sessionStorage.getItem("custom-activities-instructor") === "true") {
            navigate("/");
        } else if (sessionStorage.getItem("ActivityThreeId") !== "null" && sessionStorage.getItem("ActivityThreeId") !== null) {
            navigate(`/activitythree/${sessionStorage.getItem("ActivityThreeId")}`);
        } else {
            navigate("/activitythree");
        }
    };

    return (
        <Container className='container'>
            <div className="header">
                <h2
                    dangerouslySetInnerHTML={{ __html: label }}
                    contentEditable={true}
                    id="activity-two-label"
                ></h2>
                <Button onClick={() => window.location.reload()} className="resetButton">
                    Reset
                </Button>
            </div>
            {/* handleSubmit to be implemented */}
            <form onSubmit={handleSubmit}>
                <Typography id="activity-two-instruction" dangerouslySetInnerHTML={{ __html: ` ${instruction}` }} contentEditable={instructor && true} className="editableInstruction"></Typography>
                {instructor && <Divider className="divider" />}
                {instructor && (
                    <Typography className="infoText">
                        After submitting this activity, you will be automatically redirected to the home page. From there, you can return to select configurations for the remaining activities.
                    </Typography>
                )}

                {blankTemplate && <Typography className="infoText">
                    No transcript has been displayed since no data was entered in Activity 1.
                </Typography>}


                {instructor && (
                    <FormControlLabel className="formControlLabel" control={
                        <Switch checked={highlightingNotAllowed} onChange={() => setHighlightingNotAllowed((prev) => !prev)} />
                    }
                        label="Standardised Script Highlighting"
                    />
                )}
                {!instructor && highlightingNotAllowed && (
                    <Typography className="infoText">
                        You are not allowed to edit the highlighting of the transcript in this template.
                    </Typography>
                )}

                <FormControlLabel className="formControlLabel" control={
                    <Switch checked={newChain} onChange={() => {
                        if (!newChain) {
                            // eslint-disable-next-line no-restricted-globals
                            if (confirm("Caution: Data associated with the next four activities in this sequence will be permanently deleted")) {
                              setNewChain((prev) => !prev);
                            }
                          } else {
                            setNewChain((prev) => !prev);
                          }
                    }}
                    />
                }
                    label="Re-initialise Activity 2 and subsequent activities"
                />
                {!blankTemplate ? <DisplayTranscript activityMVCContent={activityMVCContent} highlightingNotAllowed={highlightingNotAllowed} /> : <></>}
                <Button className="submitButton" fullWidth type="submit" variant="outlined">
                    Submit
                </Button>
            </form>
        </Container>
    );
};

export default Activity2;