import './Activity4.css'
import { Box, Button, Container, FormControlLabel, Switch, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { getColor } from "../../Components/Colors.js";
import DisplayComponents from './DisplayComponents.js';

const Activity4 = () => {
    const [selectedData, setSelectedData] = useState({});
    const [containerHeight, setContainerHeight] = useState(0);
    const [instructor, setInstructor] = useState(false);
    const [newChain, setNewChain] = useState(false);
    const [label, setLabel] = useState("Activity 4 Label");
    const [blankTemplate, setBlankTemplate] = useState(false)
    const [instruction, setInstruction] = useState(
        `<Typography>The sentences you selected in the previous activity have been arranged on the left side of the pane below. Use the space below to cluster the sentences into themes by arranging the sentences that go together near each other. It’s okay if the sentences in a cluster overlap a bit.</Typography>
      <br />
      <br />
      <Typography>You can then name the cluster by clicking the Add Label button to create a new text box. You can edit the label text by clicking on its text. You can drag the label anywhere in the clustering area by clicking and holding the label area. You can remove a label from the clustering area by deleting all of its text.</Typography>
      <br />
      <br />
      <Typography>Once you are satisfied with your clusters and their labels, you can save everything by clicking the Submit button. Once submitted, your clusters and labels will be used in the next activity.</Typography>`
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

        let height = sessionStorage.getItem("mainContainerHeight");

        let gridWidth = 120;
        let gridHeight = 70;
        let perRow = 2;

        // if valid id exists, fetch data from activity 4 table
        if (id) {
            axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/activityfour/byId/${id}`).then((response) => {
                setLabel(response.data.label);
                setInstruction(response.data.instruction);
                if (response.data.content !== null) {
                    setSelectedData(response.data.content);
                    if (Object.entries(response.data.content).length === 0) {
                        setBlankTemplate(true)
                    }
                    if (height != null) {
                        setContainerHeight(height);
                    }
                }
            });
        } else if (id !== "null") {
            axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/activitythree/byId/${sessionStorage.getItem("ActivityThreeId")}`).then((response) => {
                if (response.data !== null) {
                    let userData = response.data;
                    const check = new RegExp("background-color: yellow", "g");
                    const check2 = new RegExp("background-color: lightgreen", "g");
                    let index = 0;

                    if (userData.content !== null) {
                        Object.entries(userData.content).forEach(([key, value]) => {
                            if (value.questioner_tag === undefined) {
                                Object.entries(value.response_text).forEach(([key2, value2]) => {
                                    if (userData.activity_mvc[key][key2].css.match(check) || userData.activity_mvc[key][key2].css.match(check2)) {
                                        let x = (index % perRow) * gridWidth;
                                        let y = Math.floor(index / perRow) * gridHeight;
                                        userData.content[key].response_text[key2].clusterData = {
                                            id: uuidv4(),
                                            x: x,
                                            y: y,
                                            userClusterIndexA4: -1,
                                            type: "text",
                                            height: 0,
                                        };
                                        index++;
                                    }
                                });
                            }
                        });
                        setSelectedData(userData);
                    } else {
                        setBlankTemplate(true)
                    }

                } else if (id === "null") {
                    alert("Before progressing to Activity 4, please complete Activity 3.");
                }
            });
        }
    }, []);

    const checkClass = () => {
        let colorsUsedData = {};
        let checkClassData = {};
        let userData = selectedData;
        let currentClass = 0;
        let flag = false;
        let flag2 = false;

        // sets all userClusterIndexA4 to -1 irrespective of their initial state
        Object.entries(userData.content).forEach(([key, data]) => {
            if (data.type === "label") {
                data.userClusterIndexA4 = -1;
            } else if (data.response_id) {
                Object.entries(data.response_text).forEach(([key2, data2]) => {
                    if (data2.clusterData) {
                        data2.clusterData.userClusterIndexA4 = -1;
                    }
                });
            }
        });

        // creates an array of relevant components for clustering 
        Object.entries(userData.content).forEach(([key, data]) => {
            if (data.response_id) {
                Object.entries(data.response_text).forEach(([key2, data2]) => {
                    if (data2.clusterData) {
                        data2.clusterData.coreKey = key;
                        data2.clusterData.subKey = key2;
                        checkClassData[Object.keys(checkClassData).length + 1] = data2.clusterData;
                    }
                });
            } else if (data.type === "label") {
                data.coreKey = key;
                checkClassData[Object.keys(checkClassData).length + 1] = data;
            }
        });

        // checks for proximity between two components
        Object.entries(checkClassData).forEach(([key, value]) => {
            Object.entries(checkClassData).forEach(([key2, value2]) => {
                if (checkProximity(value.x, value.y, value2.x, value2.y, value.height, value2.height) && value2.userClusterIndexA4 === -1) {
                    if (flag === true) {
                        currentClass = currentClass + 1;
                        flag = false;
                        flag2 = true;
                    }
                    if (flag2 === true && value.userClusterIndexA4 !== -1) {
                        currentClass = currentClass - 1;
                        flag2 = false;

                        checkClassData[key2].userClusterIndexA4 = checkClassData[key].userClusterIndexA4;
                        if (checkClassData[key2].type == "label") {
                            colorsUsedData[checkClassData[key2].userClusterIndexA4] = checkClassData[key2].color;
                        }
                    } else {
                        checkClassData[key2].userClusterIndexA4 = currentClass;
                        flag2 = false;
                        if (checkClassData[key2].type == "label") {
                            colorsUsedData[checkClassData[key2].userClusterIndexA4] = checkClassData[key2].color;
                        }
                    }
                }
            });
            flag = true;
            flag2 = false;
        });

        Object.entries(checkClassData).forEach(([key, data]) => {
            if (data.subKey) {
                userData.content[data.coreKey].response_text[data.subKey].clusterData.userClusterIndexA4 = data.userClusterIndexA4;
            } else {
                userData.content[data.coreKey].userClusterIndexA4 = data.userClusterIndexA4;
            }
        });

        setSelectedData(userData);
        return colorsUsedData;
    };

    // checks whether two components are close to each other
    const checkProximity = (x1, y1, x2, y2, height1, height2) => {

        if (Math.abs(x1 - x2) <= 125) {
            if (height1 === 120 && height2 === 120) {
                if (Math.abs(y1 - y2) <= 70) {
                    return true;
                }
            }
            if (height1 === 40 && height2 === 40) {
                if (Math.abs(y1 - y2) <= 60) {
                    return true;
                }
            }
            if (height1 === 40 && height2 === 120) {
                if (Math.abs(y1 - y2) <= 70) {
                    return true;
                }
            }
            if (height1 === 120 && height2 === 40) {
                if (Math.abs(y1 - y2) <= 40) {
                    return true;
                }
            }
        } else {
            return false;
        }
    };

    // checks which components are next to each other
    const checkClustering = () => {

        // gets the height of the components - see if its still needed.
        Object.entries(selectedData.content).map(([key, data]) => {
            if (data.type === "label") {
                const element = document.querySelector(`[data-height-id="${data.id}"]`);
                selectedData.content[key].height = element.clientHeight;
            } else if (data.response_id) {
                Object.entries(data.response_text).map(([key2, data2]) => {
                    if (data2.clusterData) {
                        const element = document.querySelector(`[data-height-id="${data2.clusterData.id}"]`);
                        selectedData.content[key].response_text[key2].clusterData.height = element.clientHeight;
                    }
                });
            }
        });

        const mainContainer = document.getElementById("main-container");
        sessionStorage.setItem("mainContainerHeight", mainContainer.clientHeight);

        let colorsUsedData = {};
        colorsUsedData = checkClass();

        replaceLabelNames();
        const updatedSelectedData = { ...selectedData };

        Object.entries(updatedSelectedData.content).forEach(([key, value]) => {
            if (value.response_id) {
                Object.entries(value.response_text).forEach(([key2, value2]) => {
                    if (value2.clusterData) {
                        updatedSelectedData.content[key].response_text[key2].clusterData.color = colorsUsedData[value2.clusterData.userClusterIndexA4];
                    }
                });
            }
        });

        setSelectedData(updatedSelectedData);
    };

    const handleDrag = (e, data, coreKey, subKey) => {

        checkClustering();

        setSelectedData((prevState) => {
            const updatedContent = { ...prevState.content };
            if (subKey !== undefined) {
                const updatedSubItem = {
                    ...updatedContent[coreKey].response_text[subKey].clusterData,
                    x: data.x,
                    y: data.y,
                };
                updatedContent[coreKey].response_text[subKey].clusterData = updatedSubItem;
            } else {
                const updatedItem = {
                    ...updatedContent[coreKey],
                    x: data.x,
                    y: data.y,
                };
                updatedContent[coreKey] = updatedItem;
            }
            return { ...prevState, content: updatedContent };
        });
    };

    const removeLabel = (key) => {
        setSelectedData((prevData) => {
            const newData = { ...prevData };
            delete newData.content[key];
            return newData;
        });
    };

    const handleDeleteCopy = (coreKey, subKey) => {
        setSelectedData(prevData => {
            const newData = { ...prevData };
            delete newData.content[coreKey].response_text[subKey];
            return newData;
        });
    };

    const handleCreateCopy = (coreKey, subKey) => {
        setSelectedData(prevState => {
            const newData = { ...prevState };
            const itemToCopy = { ...newData.content[coreKey].response_text[subKey] };
            itemToCopy.clusterData = {
                ...itemToCopy.clusterData,
                id: uuidv4(),
                x: itemToCopy.clusterData.x,
                y: itemToCopy.clusterData.y + 10,
                userClusterIndexA4: -1,
                type: "text-copy",
                height: 0,
            };
            const newSubKey = Object.keys(newData.content[coreKey].response_text).length + 1;
            newData.content[coreKey].response_text[newSubKey] = itemToCopy;
            return newData;
        });
    };

    const handleDoubleClick = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top

        createLabelAtPosition(x / 2, y / 2);
    };

    const createLabelAtPosition = (x, y) => {

        setSelectedData((prevState) => {
            const newData = {
                ...prevState,
                content: {
                    ...prevState.content,
                    [Object.keys(prevState.content).length + 1]: {
                        id: uuidv4(),
                        clusterLabelA4: "Click to edit label",
                        x: x,
                        y: y,
                        userClusterIndexA4: -1,
                        type: "label",
                        color: getColor(),
                    },
                },
            };
            return newData;
        });
    };


    // searches for the current label name and replaces it
    const replaceLabelNames = () => {
        let data = selectedData;

        Object.entries(data.content).map(([key, value]) => {
            if (value.type === "label") {
                let val = document.getElementById(value.id).innerHTML;
                data.content[key].clusterLabelA4 = val;
            }
        });

        setSelectedData(data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedData.content !== undefined) {
            Object.entries(selectedData.content).map(([key, data]) => {
                if (data.type === "label") {
                    const element = document.querySelector(`[data-height-id="${data.id}"]`);
                    selectedData.content[key].height = element.clientHeight;
                } else if (data.response_id) {
                    Object.entries(data.response_text).map(([key2, data2]) => {
                        if (data2.clusterData) {
                            const element = document.querySelector(`[data-height-id="${data2.clusterData.id}"]`);
                            selectedData.content[key].response_text[key2].clusterData.height = element.clientHeight;
                        }
                    });
                }
            });
        }

        const mainContainer = document.getElementById("main-container");
        !blankTemplate && sessionStorage.setItem("mainContainerHeight", mainContainer.clientHeight);

        if (!blankTemplate) {
            checkClass();
            replaceLabelNames();
        }

        if (!id) {
            delete selectedData["MLModel"];
            delete selectedData["AllowMLMOdel"];
            delete selectedData["predefinedMLSelection"];
        }

        let finalData = {};
        finalData.UserId = sessionStorage.getItem("UserId");
        finalData.content = selectedData;
        finalData.label = document.getElementById("activity-four-label").innerHTML;
        finalData.instruction = document.getElementById("activity-four-instruction").innerHTML;
        finalData.activity_mvc = {};
        delete finalData["id"];
        let data = {
            id: sessionStorage.getItem("ActivitiesId"),
            content: finalData,
        };

        let event;

        if (id) {
            await axios.post(`https://activities-alset-aef528d2fd94.herokuapp.com/activityfour/byId/${id}`, data);
            if (newChain) {
                await axios.post(`https://activities-alset-aef528d2fd94.herokuapp.com/activityfour/byId/${sessionStorage.getItem("ActivitiesId")}/new-chain`);
                sessionStorage.removeItem("ActivityFiveId");
                sessionStorage.removeItem("ActivitySixId");

                event = "Reinitialise";
            } else {
                event = "Update";
            }
        } else {
            await axios.post("https://activities-alset-aef528d2fd94.herokuapp.com/activityfour", data).then((response) => {
                const ActivityFourId = response.data.id;
                sessionStorage.setItem("ActivityFourId", ActivityFourId);
            });

            event = "Create";
        }

        if (!instructor) {
            let data = {
                DateTime: Date.now(),
                StudentTemplateId: sessionStorage.getItem("ActivitiesId"),
                StudentId: sessionStorage.getItem("UserId"),
                Event: event,
                ActivityId: sessionStorage.getItem("ActivityFourId"),
                ActivityType: "Activity 4",
            };
            await axios.post(`https://activities-alset-aef528d2fd94.herokuapp.com/studentlog/create`, data);
        } else {
            let data = {
                DateTime: Date.now(),
                ActivitySequenceId: sessionStorage.getItem("ActivitiesId"),
                InstructorId: sessionStorage.getItem("UserId"),
                Event: event,
                ActivityId: sessionStorage.getItem("ActivityFourId"),
                ActivityType: "Activity 4",
            };
            await axios.post(`https://activities-alset-aef528d2fd94.herokuapp.com/instructorlog/create`, data);
        }

        if (sessionStorage.getItem("ActivityFiveId") !== "null" && sessionStorage.getItem("ActivityFiveId") !== null) {
            navigate(`/activityfive/${sessionStorage.getItem("ActivityFiveId")}`);
        } else {
            navigate("/activityfive");
        }
    };

    return (
        <Container className="container">
            <div className="header">
                <h2 dangerouslySetInnerHTML={{ __html: `${label}` }} contentEditable="true" id="activity-four-label" className="editableLabel"></h2>
                <Button onClick={() => window.location.reload()} className="resetButton">Reset</Button>
            </div>
            <form onSubmit={handleSubmit}>
                <Typography id="activity-four-instruction" dangerouslySetInnerHTML={{ __html: `${instruction}` }} contentEditable={true} className="editableInstruction"></Typography>
                {blankTemplate && <Typography className="infoText">
                    No transcript has been displayed since no data was entered in Activity 1.
                </Typography>}
                <FormControlLabel style={{ marginTop: 10 }} className="formControlLabelTop" control={
                    <Switch checked={newChain} onChange={() => {
                        if (!newChain) {
                            // eslint-disable-next-line no-restricted-globals
                            if (confirm("Caution: Data associated with the next two activities in this sequence will be permanently deleted")) {
                                setNewChain((prev) => !prev);
                            }
                        } else {
                            setNewChain((prev) => !prev);
                        }
                    }}
                    />
                }
                    label="Re-initialise Activity 4 and subsequent activities"
                />
                {!blankTemplate &&
                    <Box id="main-container" onDoubleClick={handleDoubleClick}>
                        <DisplayComponents selectedData={selectedData} handleDrag={handleDrag} removeLabel={removeLabel} handleCreateCopy={handleCreateCopy} handleDeleteCopy={handleDeleteCopy} />
                    </Box>}
                <Button fullWidth type="submit" variant="outlined" className="submitButton">Submit</Button>
            </form>
        </Container>
    );
};



export default Activity4;