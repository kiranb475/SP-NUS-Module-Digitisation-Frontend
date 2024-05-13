import { Button, Container, FormControlLabel, Switch, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import DisplayTranscript from "./DisplayTranscript";
import './Activity3.css'
import InfoIcon from '@mui/icons-material/Info';

const Activity3 = () => {
    const [activityMVCContent, setActivityMVCContent] = useState({});
    const [userData, setUserData] = useState({});
    const [AllowMLModel, setAllowMLModel] = useState(false);
    const [instructor, setInstructor] = useState(false);
    const [MLModel, setMLModel] = useState("");
    const [predefinedHighlighting, setPredefinedHighlighting] = useState(false);
    const [newChain, setNewChain] = useState(false);
    const [predefinedMLSelection, setPredefinedMLSelection] = useState(false);
    const [blankTemplate, setBlankTemplate] = useState(false)
    const [label, setLabel] = useState("Activity 3 Label");
    const [author, setAuthor] = useState("")
    const [instruction, setInstruction] = useState(
        `<Typography>The transcript you submitted was passed through an AI model trained to identify important sentences. The model’s sentence selection was then compared with yours. The sentences you and the model both selected are now highlighted in green. Sentences that the model classified as being important but you did not are highlighted in blue. Sentences you selected as being important but the model did not are highlighted in yellow.</Typography>
        <br/> <br/>
        <Typography>Please review the version of your transcript with the new highlights below. You’ll likely agree with some of the sentence selections and disagree with others. As you review the transcript, feel free to refine your sentence selections. When you are satisfied with your selections, click the Submit button to continue to the next activity. Only your choices about which sentences are important (yellow and green highlights) will be used in the next activity.</Typography>
        <br/> <br/>
        <Typography>You can refer to the following key to remind yourself of what the three colours mean.</Typography>
        <ul style={{ marginTop: 0 }}>
            <li><Typography>Only the model selected - blue</Typography></li>
            <li><Typography>Only you selected - yellow</Typography></li>
            <li><Typography>Both you and the model selected - green</Typography></li>
        </ul>`
    );
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

        // checks whether user highlighting is predefined
        if (sessionStorage.getItem("predefinedHighlighting") == true) {
            setPredefinedHighlighting(true);
        }

        // if valid id exists, fetch data from activity 3 table
        if (id) {
            axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/activitythree/byId/${id}`).then((response) => {
                if (response.data !== null) {
                    if (response.data.AllowMLModel) {
                        setAllowMLModel(response.data.AllowMLModel);
                        sessionStorage.setItem("allowMLModel", response.data.AllowMLModel)
                    } else {
                        setAllowMLModel(false);
                        sessionStorage.setItem("allowMLModel", false)
                    }
                    if (response.data.MLModel) {
                        setMLModel(response.data.MLModel);
                    } else {
                        setMLModel("None");
                    }
                    if (response.data.predefinedMLSelection) {
                        setPredefinedMLSelection(response.data.predefinedMLSelection);
                    } else {
                        setPredefinedMLSelection(false);
                    }
                    setLabel(response.data.label);
                    setInstruction(response.data.instruction);

                    if (response.data.lastAuthored === "instructor") {
                        sessionStorage.setItem("new-chain", true)
                    }

                    if (sessionStorage.getItem("new-chain") !== "true") {
                        if (response.data.content != null) {
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
                }
            });
        }

        if (id === undefined || sessionStorage.getItem("new-chain") === "true") {
            // since instance of activity three doesn't exist, get data from activity two.
            axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/activitytwo/byId/${sessionStorage.getItem("ActivityTwoId")}`).then((response) => {
                if (response.data !== null) {
                    if (response.data.content != null && Object.entries(response.data.content).length !== 0) {
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

                        // Randomly assign should only be called when instructor allows ML - to be fixed
                        if (sessionStorage.getItem("allowMLModel") === "true") {
                            RandomlyAssign(response.data);
                        }

                        if (sessionStorage.getItem("new-chain") !== "true") {
                            setAllowMLModel(false);
                            setPredefinedMLSelection(false);
                            setPredefinedHighlighting(sessionStorage.getItem("predefinedHighlighting") === "false" ? false : true)
                        }

                    } else {
                        setBlankTemplate(true)
                    }
                }
            });
        } else if (id === "null") {
            alert("Before progressing to Activity 3, please complete Activity 2.");
        }
    }, []);

    const getActivityMVC = (value) => {
        const element = document.querySelector(`[id="${value}"]`);
        if (element) {
            const htmlContent = element.outerHTML;
            const inlineStyles = element.getAttribute("style") || "No inline styles";
            return { html: htmlContent, css: inlineStyles };
        } else {
            console.log("Element not found");
            return undefined;
        }
    };

    function randNum() {
        const randVal = Math.random();
        if (randVal < 0.5) {
            return -1;
        } else if (randVal < 0.6) {
            return 0;
        } else if (randVal < 0.7) {
            return 1;
        } else if (randVal < 0.8) {
            return 2;
        } else if (randVal < 0.9) {
            return 3;
        } else {
            return 4;
        }
    }

    // handles submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        let userContent = userData;

        if (!id) {
            delete userContent["predefinedHighlighting"];
            delete userContent["predefinedTranscript"];
        }
        userContent.MLModel = MLModel;
        userContent.UserId = sessionStorage.getItem("UserId");
        userContent.AllowMLModel = AllowMLModel;
        userContent.predefinedMLSelection = predefinedMLSelection;
        userContent.label = document.getElementById("activity-three-label").innerHTML;
        userContent.instruction = document.getElementById("activity-three-instruction").innerHTML;

        delete userContent["id"];

        //check for yellow
        const check1 = new RegExp("background-color: rgb\\(\\s*255\\s*,\\s*199\\s*,\\s*44\\s*\\)", "g");
        //check for blue
        const check2 = new RegExp("background-color: rgb\\(\\s*108\\s*,\\s*180\\s*,\\s*238\\s*\\)", "g");
        //check for green
        const check3 = new RegExp("background-color: rgb\\(\\s*23\\s*,\\s*177\\s*,\\s*105\\s*\\)", "g");

        if (userContent.activity_mvc !== undefined) {
            for (let i = 1; i < Object.keys(userContent.activity_mvc).length + 1; i++) {
                if (i % 2 != 0) {
                    let activity_mvc_value = getActivityMVC(i.toString());
                    userContent.activity_mvc[i] = activity_mvc_value;
                    userContent.content[i].sentenceUserHighlightA3 = false;
                } else {
                    for (let j = 1; j < Object.keys(userContent.activity_mvc[i]).length + 1; j++) {
                        let activity_mvc_value = getActivityMVC(i.toString() + j.toString());
                        userContent.activity_mvc[i][j] = activity_mvc_value;
                        if (activity_mvc_value.html.match(check1)) {
                            userContent.content[i].response_text[j].sentenceUserHighlightA3 = true;
                        } else if (activity_mvc_value.html.match(check2)) {
                            userContent.content[i].response_text[j].sentenceUserHighlightA3 = false;
                        } else if (activity_mvc_value.css.match(check3)) {
                            userContent.content[i].response_text[j].sentenceUserHighlightA3 = true;
                        } else {
                            userContent.content[i].response_text[j].sentenceUserHighlightA3 = false;
                        }
                    }
                }
            }
        }

        userContent.lastAuthored = "student"

        let data = {
            id: sessionStorage.getItem("ActivitiesId"),
            content: userContent,
        };

        let event;

        if (id && sessionStorage.getItem("new-chain") !== "true") {

            await axios.post(`https://activities-alset-aef528d2fd94.herokuapp.com/activitythree/byId/${id}`, data);


            if (newChain) {
                await axios.post(`https://activities-alset-aef528d2fd94.herokuapp.com/activitythree/byId/${sessionStorage.getItem("ActivitiesId")}/new-chain`);
                sessionStorage.setItem("new-chain", true)

                event = "Reinitialise";
            } else {
                event = "Update";
            }
        } else {
            await axios.post("https://activities-alset-aef528d2fd94.herokuapp.com/activitythree", data).then((response) => {
                const ActivityThreeId = response.data.id;
                sessionStorage.setItem("ActivityThreeId", ActivityThreeId);
            });

            event = "Create";

        }

        if (!instructor) {
            let data = {
                DateTime: Date.now(),
                StudentTemplateId: sessionStorage.getItem("ActivitiesId"),
                StudentId: sessionStorage.getItem("UserId"),
                Event: event,
                ActivityId: sessionStorage.getItem("ActivityThreeId"),
                ActivityType: "Activity 3",
            };
            await axios.post(`https://activities-alset-aef528d2fd94.herokuapp.com/studentlog/create`, data);
        } else {
            let data = {
                DateTime: Date.now(),
                ActivitySequenceId: sessionStorage.getItem("ActivitiesId"),
                InstructorId: sessionStorage.getItem("UserId"),
                Event: event,
                ActivityId: sessionStorage.getItem("ActivityThreeId"),
                ActivityType: "Activity 3",
            };
            await axios.post(`https://activities-alset-aef528d2fd94.herokuapp.com/instructorlog/create`, data);
        }

        if (sessionStorage.getItem("ActivityFourId") !== "null" && sessionStorage.getItem("ActivityFourId") !== null) {
            navigate(`/activityfour/${sessionStorage.getItem("ActivityFourId")}`);
        } else {
            navigate("/activityfour");
        }
    };

    const RandomlyAssign = (data) => {
        let userContent = data;

        for (let i = 1; i < Object.keys(userContent.activity_mvc).length + 1; i++) {
            if (i % 2 === 0) {
                for (let j = 1; j < Object.keys(userContent.activity_mvc[i]).length + 1; j++) {
                    let rand;
                    rand = randNum();
                    userContent.content[i].response_text[j].sentenceAIClassified = rand;
                    if (rand !== -1) {
                        userContent.content[i].response_text[j].sentenceMLHighlightA3 = true;
                        //checks whether background color is yellow
                        if (userContent.activity_mvc[i][j].css === "display: inline; background-color: rgb(255, 199, 44); border-radius: 4px; padding: 2px;") {
                            userContent.activity_mvc[i][j].html = userContent.activity_mvc[i][j].html.replace(
                                /background-color:.*?;/gi,
                                //changes the background color to green since it was selected by the user and ML model
                                "background-color: rgb(23, 177, 105); border-radius: 4px; padding: 2px;"
                            );
                        } else {
                            userContent.activity_mvc[i][j].html = userContent.activity_mvc[i][j].html.replace(
                                /style="display:\s*inline;"/g,
                                //changes the background color to blue since it was selected only by the ML model
                                'style="display: inline; background-color: rgb(108, 180, 238); border-radius: 4px; padding: 2px;"'
                            );
                        }
                    } else {
                        //checks if the background color is green
                        if (userContent.activity_mvc[i][j].css === "display: inline; background-color: rgb(23, 177, 105); border-radius: 4px; padding: 2px;") {
                            userContent.activity_mvc[i][j].html = userContent.activity_mvc[i][j].html.replace(
                                /background-color:.*?;/gi,
                                //changes the background color to yellow
                                "background-color: background-color: rgb(255, 199, 44); border-radius: 4px; padding: 2px;"
                            );
                            //checks if the background color is blue
                        } else if (userContent.activity_mvc[i][j].css === "display: inline; background-color: rgb(108, 180, 238); border-radius: 4px; padding: 2px;") {
                            userContent.activity_mvc[i][j].html = userContent.activity_mvc[i][j].html.replace(/background-color:.*?;/gi, "");
                        }
                        userContent.content[i].response_text[j].sentenceMLHighlightA3 = false;
                    }
                }
            } else {
                userContent.content[i].sentenceMLHighlightA3 = false;
            }
        }
        setUserData(userContent);
    };


    return (
        <div className="container-activity-3">
            <div className="header-activity-3">
                <h2 dangerouslySetInnerHTML={{ __html: ` ${label}` }} contentEditable="true" id="activity-three-label" className="editableLabel"></h2>
                <Button onClick={() => { window.location.reload(); }} className="resetButton">
                    Reset
                </Button>
            </div>
            <form onSubmit={handleSubmit}>
                <Typography id="activity-three-instruction" dangerouslySetInnerHTML={{ __html: ` ${instruction}` }} contentEditable={instructor && true} className="editableInstruction"></Typography>
                {!instructor && predefinedHighlighting && (
                    <Typography className="infoText">
                        You are not allowed to edit the highlighting of the transcript in this template.
                    </Typography>
                )}
                {!instructor && predefinedMLSelection && (
                    <Typography className="infoText">
                        The Machine Learning selection for the template has been predefined.
                    </Typography>
                )}
                {blankTemplate && <Typography className="infoText">
                    No transcript has been displayed since no data was entered in Activity 1.
                </Typography>}
                {!instructor && AllowMLModel && (
                    <Typography className="infoText">
                        The template utilises {MLModel} to generate results to assist you in your decision making.
                    </Typography>
                )}
                <FormControlLabel style={{ marginTop: 10 }} className="formControlLabelTop" control={
                    <Switch checked={newChain} onChange={() => {
                        if (!newChain) {
                            // eslint-disable-next-line no-restricted-globals
                            if (confirm("Caution: Data associated with the next three activities in this sequence will be permanently deleted")) {
                                setNewChain((prev) => !prev);
                            }
                        } else {
                            setNewChain((prev) => !prev);
                        }
                    }}
                    />
                }
                    label={
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            Re-initialise Activity 3 and subsequent activites
                            <Tooltip title="Use this switch when you want to edit activity three after you have already saved subsequent activities. It will erase the content of the next three activities.">
                                <InfoIcon style={{ marginLeft: 4 }} fontSize="small" />
                            </Tooltip>
                        </div>
                    }
                />
                {!blankTemplate ? <DisplayTranscript activityMVCContent={activityMVCContent} highlightingNotAllowed={predefinedHighlighting} /> : <></>}
                <Button className="submitButton" fullWidth type="submit" variant="outlined">
                    Submit
                </Button>
            </form>
        </div>
    );
};

export default Activity3;
