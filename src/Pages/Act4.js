import { Box, Button, ButtonGroup, Container, FormControlLabel, Switch, TextField, Tooltip, Typography, selectClasses } from "@mui/material"
import { useEffect, useState } from "react";
import Draggable from "react-draggable";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios'
import { getColor } from '../Components/Colors.js'

const Act4 = () => {

    const [selectedData, setSelectedData] = useState({})
    const [containerHeight, setContainerHeight] = useState(0)
    const [instructor, setInstructor] = useState(false)
    const [newChain,setNewChain] = useState(false)
    const [logs,setLogs] = useState({})
    const [label, setLabel] = useState('Custom Text')
    const [instruction, setInstruction] = useState(`
    <Typography>The sentences you selected in the previous activity have been arranged on the left side of the pane below. Use the space below to cluster the sentences into themes by arranging the sentences that go together near each other. It’s okay if the sentences in a cluster overlap a bit.</Typography>
    <br />
    <br />
    <Typography>You can then name the cluster by clicking the Add Label button to create a new text box. You can edit the label text by clicking on its text. You can drag the label anywhere in the clustering area by clicking and holding the label area. You can remove a label from the clustering area by deleting all of its text.</Typography>
    <br />
    <br />
    <Typography>Once you are satisfied with your clusters and their labels, you can save everything by clicking the Submit button. Once submitted, your clusters and labels will be used in the next activity.</Typography>
    ` )
    const navigate = useNavigate()
    const { id } = useParams()


    useEffect(() => {


        if (id === "null") {
            alert("Please go back to the previous activity and submit it to continue.")
        } else {
            let ActivitiesId = sessionStorage.getItem("ActivitiesId")
            if (sessionStorage.getItem("Occupation") == "Student") {
                axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/studentlog/get/byId/${ActivitiesId}`).then((response) => {
                    setLogs(response.data[0].StudentEvent)
                })
            } else {
                axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/instructorlog/byId/${ActivitiesId}`).then((response) => {
                    setLogs(response.data[0].InstructorEvent)
                })
            }
        }

        if (sessionStorage.getItem("Occupation") == "Instructor") {
            setInstructor(true)
        }

        let height = sessionStorage.getItem("mainContainerHeight")
        let selected = {}
        let count = 0
        let x = 120
        let y = 70

        if (id) {
            axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/activityfour/byId/${id}`).then((response) => {
                setLabel(response.data.label)
                setInstruction(response.data.instruction)
                if (response.data.content !== null) {
                    setSelectedData(response.data.content)
                    if (height != null) { setContainerHeight(height) }
                } else {
                    axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/activitythree/byId/${sessionStorage.getItem("ActivityThreeId")}`).then((response) => {
                        if (response.data !== null) {
                            let userData = response.data
                            const check = new RegExp('background-color: yellow', 'g');
                            Object.entries(userData.content).map(([key, value]) => {
                                if (value.questioner_tag === undefined) {
                                    Object.entries(value.response_text).map(([key2, value2]) => {
                                        if ((value2.text !== "." && value2.text !== " " && value2.activity_mvc.css.match(check)) || value2.text !== "." && value2.text !== " " && value2.activity_mvc.css.match(check)) {
                                            selected[count] = { id: uuidv4(), text: value2.text, x: x, y: y, new_x: 0, new_y: 0, class: -1, type: "text", height: 0,AI_classified:value2.AI_classified }
                                            count = count + 1
                                            y = y + 140
                                        }
                                    })
                                }
                            })
                            setSelectedData(selected)
                        }
                    })
                }
            })
        } else {
            axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/activitythree/byId/${sessionStorage.getItem("ActivityThreeId")}`).then((response) => {
                if (response.data !== null) {
                    let userData = response.data
                    console.log('response')
                    console.log(response.data)
                    const check = new RegExp('background-color: yellow', 'g');
                    Object.entries(userData.content).map(([key, value]) => {
                        if (value.questioner_tag === undefined) {
                            Object.entries(value.response_text).map(([key2, value2]) => {
                                if ((value2.AI_classified !== -1 && value2.text !== "." && value2.text !== " " && value2.activity_mvc.css.match(check)) || value2.text !== "." && value2.text !== " " && value2.activity_mvc.css.match(check)) {
                                    selected[count] = { id: uuidv4(), text: value2.text, x: x, y: y, new_x: 0, new_y: 0, class: -1, type: "text", height: 0, AI_classified:value2.AI_classified }
                                    count = count + 1
                                    y = y + 140
                                }
                            })
                        }
                    })
                    console.log(selected)
                    setSelectedData(selected)
                } else {
                    alert("Before progressing to Activity 4, please complete Activity 3.")
                }
            })
        }

    }, [])

    const checkClass = () => {
        let colorsUsedData = {}
        let userData = selectedData
        let currentClass = 0
        let flag = false
        let flag2 = false

        Object.entries(userData).map(([key, value]) => {
            value.class = -1
        })

        console.log("user data is") 
        console.log(userData)


        // for (let i = 0; i < Object.keys(userData).length - 1; i++) {
        //         for (let j = i + 1; j < Object.keys(userData).length; j++) {
        //             let value = userData[i]
        //             let value2 = userData[j]
        //             if (checkProximity(value.x + value.new_x, value.y + value.new_y, value2.x + value2.new_x, value2.y + value2.new_y, value.type, value2.type, value.height, value2.height) && value2.class === -1) {
        //                 if (value.class === -1 && value2.class === -1) {
        //                     userData[i].class = currentClass
        //                     userData[j].class = currentClass
        //                     currentClass++
        //                 } else if (value.class !== -1 && value2.class === -1) {
        //                     userData[j].class = userData[i].class
        //                 } else if (value.class === -1 && value2.class !== -1) {
        //                     userData[i].class = userData[j].class
        //                 }
        //                 if (value.type === "label") {
        //                     colorsUsedData[userData[i].class] = userData[i].color
        //                 }
        //                 if (value2.type === "label") {
        //                     colorsUsedData[userData[j].class] = userData[j].color
        //                 }
        //             } else {
        //                 if (value.class === -1) {
        //                     userData[i].class = currentClass
        //                     currentClass++
        //                 } 
        //                 if (value2.class === -1) {
        //                     userData[j].class = currentClass
        //                     currentClass++
        //                 }
        //                 if (value.type === "label") {
        //                     colorsUsedData[userData[i].class] = userData[i].color
        //                 }
        //                 if (value2.type === "label") {
        //                     colorsUsedData[userData[j].class] = userData[j].color
        //                 } 
        //             }
        //         }
        //     }

        //     console.log("new state is")
        //     console.log(userData)


         Object.entries(userData).map(([key, value]) => {
           Object.entries(userData).map(([key2, value2]) => {

                if (checkProximity(value.x + value.new_x, value.y + value.new_y, value2.x + value2.new_x, value2.y + value2.new_y, value.height, value2.height) && value2.class === -1) {

                    if (flag === true) {
                        currentClass = currentClass + 1
                        flag = false
                        flag2 = true
                    }
                    if (flag2 === true && value.class !== -1) {
                        currentClass = currentClass - 1
                        flag2 = false
                        userData[key2].class = userData[key].class
                        if (userData[key2].type == "label") {
                            colorsUsedData[userData[key2].class] = userData[key2].color
                        }
                    } else {
                        userData[key2].class = currentClass
                        flag2 = false
                        if (userData[key2].type == "label") {
                            colorsUsedData[userData[key2].class] = userData[key2].color }
                    }
                }
            })
            flag = true
            flag2 = false
        })
        setSelectedData(userData)
        return colorsUsedData

        
    }

    // checks whether two components are close to each other
    const checkProximity = (x1, y1, x2, y2, height1, height2) => {
        if (Math.abs(x1 - x2) <= 230) {
            if (height1 == 120 && height2 == 120) {
                if (Math.abs(y1-y2) <= 140) {
                    return true
                }
            }
            if (height1 == 40 && height2 == 40) {
                if (Math.abs(y1-y2) <= 60) {
                    return true
                }
            } else {
                if (Math.abs(y1-y2) <= 110) {
                    return true
                }
            }
        } else {
            return false
        }
        // if (Math.abs(x1 - x2) <= 230 && Math.abs(y1 - y2) <= (height1 / 2 + height2 / 2)) {
        //     return true
        // } else {
        //     return false
        // }

    }

    // checks which components are next to each other
    const checkClustering = () => {

        Object.entries(selectedData).map(([key, data]) => {
            const element = document.querySelector(`[height-id="${data.id}"]`)
            selectedData[key].height = element.clientHeight
        })

        const mainContainer = document.getElementById('main-container');
        sessionStorage.setItem("mainContainerHeight", mainContainer.clientHeight)

        let colorsUsedData = {}
        colorsUsedData = checkClass()
        replaceLabelNames()
        const updatedSelectedData = { ...selectedData };

        console.log("updated")
        console.log(updatedSelectedData)

        console.log("colors")
        console.log(colorsUsedData)
        
        Object.entries(updatedSelectedData).forEach(([key, value]) => {
            if (value.type !== "label") {
                updatedSelectedData[key].color = colorsUsedData[value.class];
            }
        });

        setSelectedData(updatedSelectedData);
    }

    const handleDrag = (e, data, key) => {
        let userData = selectedData
        checkClustering()
        setSelectedData((prevData) => ({
            ...prevData,
            [key]: { ...prevData[key], new_x: data.x, new_y: data.y },
        }));
    };


    // if the label is blank, it will remove the label from the screen
    const removeLabel = (idToRemove) => {
        setSelectedData((prevData) => {
            const newData = { ...prevData };
            Object.entries(newData).forEach(([key, value]) => {
                if (value.id === idToRemove) {
                    //newData[key].type = "null";
                    newData[key].removed = true
                    const labelElement = document.querySelector(`[height-id="${value.id}"] > h6`)
                    if (labelElement) {
                        labelElement.contentEditable = "false"
                        labelElement.style.border = "none"
                        labelElement.style.height = 200
                    }
                    const labelElement2 = document.querySelector(`[height-id="${value.id}"]`)
                    if (labelElement2) {
                        labelElement2.style.cursor = "default"
                    }
                }
            });
            return newData;
        });
    }

    // displays the components on the screen
    const displayComponents = () => {
        return Object.entries(selectedData).map(([key, data]) => {
            if (data.type === "label") {
                if (data.removed === true) {
                    return (
                        <Draggable defaultPosition={{ x: data.new_x, y: data.new_y }} key={data.id} onDrag={(e, data) => handleDrag(e, data, key)} bounds="parent">
                            <div height-id={data.id} style={{ maxWidth: 200, maxHeight: 20, padding: 10, margin: 10, cursor: 'move',whiteSpace: 'nowrap' }}>
                                <Typography onKeyDown={(e) => {if (e.key === "Enter") {e.preventDefault()}}} style={{ borderRadius: 5, padding: 1, display:"flex", overflowX:"hidden" }} id={data.id} variant="h6">{data.text}</Typography>
                            </div>
                        </Draggable>
                    )
                } else {
                    return (
                        <Draggable defaultPosition={{ x: data.new_x, y: data.new_y }} key={data.id} onDrag={(e, data) => handleDrag(e, data, key)} bounds="parent">
                            <div height-id={data.id} style={{ maxWidth: 200, maxHeight: 20, padding: 10, margin: 10, cursor: 'move',  whiteSpace: 'nowrap'}}>
                                <Typography onKeyDown={(e) => {if (e.key === "Enter") {e.preventDefault()}}} style={{border: '1px solid black', backgroundColor: data.color, borderRadius: 5, padding: 1, display:"flex", overflowX:"hidden"}} id={data.id} onBlur={() => { let text = document.getElementById(data.id).innerHTML; text === '' || text === `<br>` ? removeLabel(data.id) : console.log(text) }} contenteditable="true" variant="h6">{data.text}</Typography>
                            </div>
                        </Draggable>
                    )
                }
            } else {
                return (
                    <Draggable defaultPosition={{ x: data.new_x, y: data.new_y }} key={data.id} onDrag={(e, data) => handleDrag(e, data, key)} bounds="parent">
                        <div height-id={data.id} style={{ width: 200, height: 100, backgroundColor: data.color ? data.color : 'lightgrey', padding: 10, margin: 10, cursor: 'move', borderRadius: 15, border: "1px solid black", overflow: "hidden" }}>
                            <Tooltip title={data.text}>
                                <Typography id={data.id} fontSize={13}>{data.text}</Typography>
                            </Tooltip>
                        </div>
                    </Draggable>
                )
            }
        })
    }

    // scrolls the screen to where the label has been generated
    const scrollNewLabelIntoView = (key) => {
        setTimeout(() => {
            const labelElement = document.getElementById(key);
            if (labelElement) {
                labelElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 0);
    }

    // creates a new label 
    const createLabel = () => {
        const newKey = Object.keys(selectedData).length;
        let data_y = 0
        let data = selectedData
        let value = data[newKey - 1].y
        if (data[newKey - 1].type === "label") {
            data_y = value + 60
        } else {
            data_y = value + 100
        }

        const key = uuidv4()
        const currColor = getColor();
        data = { [newKey]: { id: key, text: "Click to edit label", x: 120, y: data_y, new_x: 0, new_y: 0, class: -1, type: "label", color: currColor }, ...selectedData };
        setSelectedData(data);
        scrollNewLabelIntoView(key);
        setSelectedData(data);
    }

    // searches for the current label name and replaces it
    const replaceLabelNames = () => {
        let data = selectedData
        console.log(data)
        Object.entries(data).map(([key, value]) => {
            if (value.type === "label") {
                let val = document.getElementById(value.id).innerHTML
                data[key].text = val
            }
        })
        setSelectedData(data)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        Object.entries(selectedData).map(([key, data]) => {
            const element = document.querySelector(`[height-id="${data.id}"]`)
            selectedData[key].height = element.clientHeight
        })

        const mainContainer = document.getElementById('main-container');
        sessionStorage.setItem("mainContainerHeight", mainContainer.clientHeight)

        checkClass()
        replaceLabelNames()

        if (!id) {
            delete selectedData["MLModel"]
            delete selectedData["AllowMLMOdel"]
            delete selectedData["predefinedMLSelection"]
        }

        let finalData = {};
        finalData.UserId = sessionStorage.getItem("UserId")
        finalData.content = selectedData
        finalData.label = document.getElementById("activity-four-label").innerHTML
        finalData.instruction = document.getElementById("activity-four-instruction").innerHTML
        delete finalData['id']
        let data = { id: sessionStorage.getItem("ActivitiesId"), content: finalData }

        console.log("final data")
        console.log(data)
        
        // if (newChain) {
        //     await axios.post("https://activities-alset-aef528d2fd94.herokuapp.com/activityfour/new-chain", data).then((response) => {
        //         const ActivitiesID = response.data.ActivitiesId.id
        //         const ActivityFourId = response.data.ActivityFourId
        //         sessionStorage.setItem("ActivitiesId", ActivitiesID)
        //         sessionStorage.setItem("ActivityFourId", ActivityFourId)
        //         sessionStorage.removeItem("ActivityFiveId")
        //         sessionStorage.removeItem("ActivitySixId")
        //     })
        // } else 
        if (id) {
            await axios.post(`https://activities-alset-aef528d2fd94.herokuapp.com/activityfour/byId/${id}`, data)
            if (newChain) {
                await axios.post(`https://activities-alset-aef528d2fd94.herokuapp.com/activityfour/byId/${sessionStorage.getItem("ActivitiesId")}/new-chain`);
                sessionStorage.removeItem("ActivityFiveId")
                sessionStorage.removeItem("ActivitySixId")
            
                let logsData = logs
                logsData[Object.keys(logs).length] = { DateTime: Date.now(), EventType: "Activity 4 has been reinitialized." }
                if (!instructor) {
                    await axios.post(`https://activities-alset-aef528d2fd94.herokuapp.com/studentlog/update/byId/${sessionStorage.getItem("ActivitiesId")}`, logsData)
                } else {
                    await axios.post(`https://activities-alset-aef528d2fd94.herokuapp.com/instructorlog/update/byId/${sessionStorage.getItem("ActivitiesId")}`, logsData)
                }

            } else {
            
                let logsData = logs
                logsData[Object.keys(logs).length] = { DateTime: Date.now(), EventType: "Activity 4 has been updated." }
                if (!instructor) {
                    await axios.post(`https://activities-alset-aef528d2fd94.herokuapp.com/studentlog/update/byId/${sessionStorage.getItem("ActivitiesId")}`, logsData)
                } else {
                    await axios.post(`https://activities-alset-aef528d2fd94.herokuapp.com/instructorlog/update/byId/${sessionStorage.getItem("ActivitiesId")}`, logsData)
                }

            } 
        } else {
            await axios.post("https://activities-alset-aef528d2fd94.herokuapp.com/activityfour", data).then((response) => {
                const ActivityFourId = response.data.id;
                sessionStorage.setItem("ActivityFourId", ActivityFourId)
            })

            let logsData = logs
            logsData[Object.keys(logs).length] = { DateTime: Date.now(), EventType: "Activity 4 has been created." }
            if (!instructor) {
                await axios.post(`https://activities-alset-aef528d2fd94.herokuapp.com/studentlog/update/byId/${sessionStorage.getItem("ActivitiesId")}`, logsData)
            } else {
                await axios.post(`https://activities-alset-aef528d2fd94.herokuapp.com/instructorlog/update/byId/${sessionStorage.getItem("ActivitiesId")}`, logsData)
            }
        }

        if (sessionStorage.getItem("ActivityFiveId") !== "null" && sessionStorage.getItem("ActivityFiveId") !== null) {
            navigate(`/activityfive/${sessionStorage.getItem("ActivityFiveId")}`)
        } else {
            navigate('/activityfive')
        }
    }

    return (
        <Container style={{ marginTop: 20 }}>
            <div style={{ display: "flex", direction: "row" }}>
                <h2>Activity 4:</h2>&nbsp;&nbsp;
                <h2 dangerouslySetInnerHTML={{ __html: ` ${label}` }} contentEditable="true" style={{ minHeight: 1, borderRight: "solid rgba(0,0,0,0) 1px", outline: "none" }} id="activity-four-label"></h2>
            </div>
            <form onSubmit={handleSubmit}>
                <Typography>Instructions (Editable by Instructors): </Typography>
                <Typography id="activity-four-instruction" dangerouslySetInnerHTML={{ __html: ` ${instruction}` }} contentEditable={instructor && true} style={{ minHeight: 1, borderRight: "solid rgba(0,0,0,0) 1px", outline: "none" }}></Typography>
                <FormControlLabel style={{marginTop:5}} control={<Switch checked={newChain} onChange={() => {alert("Warning: All data in next two activities corresponding to this chain will be erased.");setNewChain((prev) => !prev)}} />} label="Create a new chain of activities" />
                <ButtonGroup fullWidth sx={{ marginTop: 2, marginBottom: 1 }}>
                    <Button onClick={() => { createLabel() }} fullWidth variant='outlined'>Add Label</Button>
                    <Button onClick={() => { window.location.reload(false); }} variant='outlined' fullWidth>Reset</Button>
                    {/* <Button onClick={() => checkClustering()} variant="outlined" fullWidth>Check clustering</Button> */}
                </ButtonGroup>

                <Box id="main-container" style={{ minHeight: containerHeight === 0 ? 900 : containerHeight, width: '100%', position: 'relative', overflow: 'hidden', display: 'flex', flexWrap: 'wrap', flexDirection: 'column' }}>
                    {displayComponents()}
                </Box>
                <Button sx={{ marginTop: 3, marginBottom: 3 }} fullWidth type="submit" variant='outlined'>Submit</Button>
            </form>
        </Container>
    )
}

export default Act4