import { Box, Button, Container, TextField, Tooltip, Typography, selectClasses } from "@mui/material"
import { useEffect, useState } from "react";
import Draggable from "react-draggable";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios'
import {getColor} from '../Components/Colors.js'

const Act4 = () => {

    const [selectedData, setSelectedData] = useState({})
    const [containerHeight, setContainerHeight] = useState(0)
    const navigate = useNavigate()
    const { id } = useParams()


    useEffect(() => {


        if (id === "null") {
            alert("Please go back to the previous activity and submit it to continue.")
        }

        let userData = JSON.parse(localStorage.getItem("userData"))
        let height = sessionStorage.getItem("mainContainerHeight")
        console.log(height == null)
        let selected = {}
        let count = 0
        let x = 120
        let y = 70

        if (id) {
            axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/activityfour/byId/${id}`).then((response) => {
                if (response.data !== null) {
                    setSelectedData(response.data.content)
                    if (height != null) { setContainerHeight(height) }

                }
            })
        } else {
            axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/activitythree/byId/${sessionStorage.getItem("ActivityThreeId")}`).then((response) => {
                if (response.data !== null) {
                    let userData = response.data
                    const check = new RegExp('background-color: yellow', 'g');
                    Object.entries(userData.content).map(([key, value]) => {
                        if (value.questioner_tag === undefined) {
                            Object.entries(value.response_text).map(([key2, value2]) => {
                                //console.log(value2)
                                if ((value2.AI_classified !== -1 && value2.text !== "." && value2.text !== " " && value2.activity_mvc.css.match(check)) || value2.text !== "." && value2.text !== " " && value2.activity_mvc.css.match(check)) {
                                    //console.log(value2.text)
                                    selected[count] = { id: uuidv4(), text: value2.text, x: x, y: y, new_x: 0, new_y: 0, class: -1, type: "text", height: 0 }
                                    count = count + 1
                                    y = y + 140
                                }
                            })
                        }
                    })
                    setSelectedData(selected)
                } else {
                    alert("Before progressing to Activity 4, please complete Activity 3.")
                }
            })
        }


        // axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/activityfour/byId/${id}`).then((response) => {
        //     if (response.data !== null) {
        //         setSelectedData(response.data.content)
        //         setContainerHeight(height)
        //     } else {
        //         const check = new RegExp('background-color: yellow', 'g');
        //         Object.entries(userData.content).map(([key, value]) => {
        //             if (value.questioner_tag === undefined) {
        //                 Object.entries(value.response_text).map(([key2, value2]) => {
        //                     //console.log(value2)
        //                     if ((value2.AI_classified !== -1 && value2.text !== "." && value2.text !== " " && value2.activity_mvc.css.match(check)) || value2.text !== "." && value2.text !== " " && value2.activity_mvc.css.match(check)) {
        //                         //console.log(value2.text)
        //                         selected[count] = { id: uuidv4(), text: value2.text, x: x, y: y, new_x: 0, new_y: 0, class: -1, type: "text", height: 0 }
        //                         count = count + 1
        //                         y = y + 140
        //                     }
        //                 })
        //             }
        //         })
        //         setSelectedData(selected)
        //     }
        // })

        //let clusteredData = JSON.parse(localStorage.getItem("clusteredData"))
        //let height = localStorage.getItem("mainContainerHeight")

        // if (clusteredData !== null) {
        //     //setSelectedData(clusteredData)
        //     //setContainerHeight(height)
        // } else {
        //     const check = new RegExp('background-color: yellow', 'g');
        // Object.entries(userData.content).map(([key,value])=>{
        //     if (value.questioner_tag === undefined) {
        //         Object.entries(value.response_text).map(([key2,value2])=>{
        //             //console.log(value2)
        //             if ((value2.AI_classified !== -1 && value2.text !== "." && value2.text !== " " && value2.activity_mvc.css.match(check)) || value2.text !== "." && value2.text !== " " && value2.activity_mvc.css.match(check)){
        //                 //console.log(value2.text)
        //                 selected[count] = {id: uuidv4(),text: value2.text, x: x, y: y, new_x: 0, new_y: 0, class:-1, type:"text", height:0}
        //                 count = count + 1
        //                 y = y + 140
        //             }
        //         })
        //     }
        // })
        // setSelectedData(selected)
        // }

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


        console.log("user data")
        console.log(userData)
        Object.entries(userData).map(([key, value]) => {
            Object.entries(userData).map(([key2, value2]) => {

                if (checkProximity(value.x + value.new_x, value.y + value.new_y, value2.x + value2.new_x, value2.y + value2.new_y, value.type, value2.type, value.height, value2.height) && value2.class === -1) {

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
                        console.log(userData[key2].type)
                        if (userData[key2].type == "label") {
                        colorsUsedData[userData[key2].class] = userData[key2].color
                    }}
                    console.log(currentClass)
                }
            })
            flag = true
            flag2 = false
        })
        setSelectedData(userData)
        return colorsUsedData
    }

    // checks whether two components are close to each other
    const checkProximity = (x1, y1, x2, y2, type1, type2, height1, height2) => {
        // console.log(height1)
        // console.log(height2)
        if (Math.abs(x1 - x2) <= 250 && Math.abs(y1 - y2) <= (height1 / 2 + height2 / 2 + 30)) {
            return true
        } else {
            return false
        }

    }

    const checkClustering = () => {

        Object.entries(selectedData).map(([key, data]) => {
            //console.log(key)
            const element = document.querySelector(`[height-id="${data.id}"]`)
            //console.log(element.clientHeight)
            selectedData[key].height = element.clientHeight
        })

        const mainContainer = document.getElementById('main-container');
        sessionStorage.setItem("mainContainerHeight", mainContainer.clientHeight)

        let colorsUsedData = {}
        colorsUsedData = checkClass()
        replaceLabelNames()
        const updatedSelectedData = { ...selectedData };

        Object.entries(updatedSelectedData).forEach(([key, value]) => {
            updatedSelectedData[key].color = colorsUsedData[value.class];
        });

        console.log(updatedSelectedData)
        setSelectedData(updatedSelectedData);
    }

    const handleDrag = (e, data, key) => {
        let userData = selectedData
        // let ori_x = userData[key].x
        // let ori_y = userData[key].y
        setSelectedData((prevData) => ({
            ...prevData,
            [key]: { ...prevData[key], new_x: data.x, new_y: data.y },
        }));
        //console.log(selectedData)
    };



    // const removeLabel = (idToRemove) => {
    //     setSelectedData((prevData) => {
    //         const filteredData = Object.entries(prevData)
    //             .filter(([_, value]) => value.id !== idToRemove)
    //             .map(([_, value]) => value);

    //         const newData = filteredData.reduce((acc, current, index) => {
    //             acc[String(index)] = { ...current };
    //             return acc;
    //         }, {});

    //         return newData;
    //     });
    // }

    // if the label is blank, it will remove the label from the screen
    const removeLabel = (idToRemove) => {
        setSelectedData((prevData) => {
            const newData = { ...prevData };
            Object.entries(newData).forEach(([key, value]) => {
                if (value.id === idToRemove) {
                    //newData[key].type = "null";
                    newData[key].removed = true
                    const labelElement = document.querySelector(`[height-id="${value.id}"] > h6`)
                    console.log(labelElement)
                    if (labelElement) {
                        labelElement.contentEditable = "false"
                        labelElement.style.border = "none"
                        labelElement.style.height = 200
                    }
                    const labelElement2 = document.querySelector(`[height-id="${value.id}"]`)
                    if (labelElement2) {
                        console.log(labelElement2)
                        labelElement2.style.cursor = "default"
                    }
                }
            });
            return newData;
        });
    }

    const displayComponents = () => {
        {console.log(selectedData) }
        return Object.entries(selectedData).map(([key, data]) => {
            if (data.type === "label") {
                if (data.removed === true) {
                    return (
                        <Draggable defaultPosition={{ x: data.new_x, y: data.new_y }} key={data.id} onDrag={(e, data) => handleDrag(e, data, key)} bounds="parent">
                            <div height-id={data.id} style={{ width: 200, height: 20, padding: 10, margin: 10, cursor: 'move' }}>
                                <Typography style={{ borderRadius: 5, padding: 1 }} id={data.id} variant="h6">{data.text}</Typography>
                            </div>
                        </Draggable>
                    )
                } else {
                    return (
                        <Draggable defaultPosition={{ x: data.new_x, y: data.new_y }} key={data.id} onDrag={(e, data) => handleDrag(e, data, key)} bounds="parent">
                            <div height-id={data.id} style={{ width: 200, height: 20, padding: 10, margin: 10, cursor: 'move' }}>
                                <Typography style={{ border: '1px solid black',backgroundColor:data.color, borderRadius: 5, padding: 1 }} id={data.id} onBlur={() => { let text = document.getElementById(data.id).innerHTML; text === '' || text === `<br>` ? removeLabel(data.id) : console.log(text) }} contenteditable="true" variant="h6">{data.text}</Typography>
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
        // let data = selectedData
        // for (let i = newKey; i > 0; i = i - 1) {
        //     data[i] = data[i-1]
        // }
        // data[0] = { text: "Click to Edit", x: 0, y: 0, class: -1 }
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
        data = { [newKey]: { id: key, text: "Click to edit label", x: 120, y: data_y, new_x: 0, new_y: 0, class: -1, type: "label", color:currColor}, ...selectedData };
        setSelectedData(data);

        scrollNewLabelIntoView(key);
        // const newLabel = { 'key': { text: "Click to edit label", x: 120, y: 100, new_x: 0, new_y: 0, class: -1, type: "label", height:0 }};
        // let data = {};
        // data[0] = newLabel['key'];
        // Object.keys(selectedData).forEach(key => {
        //     const incrementedKey = parseInt(key) + 1;
        //     data[incrementedKey] = selectedData[key];
        // if (data[incrementedKey].type === 'text' && data[incrementedKey - 1].type === 'label') {
        //     data[incrementedKey].y = data[incrementedKey - 1].y + 100
        // } else if (data[incrementedKey].type === 'text' && data[incrementedKey - 1].type === 'text') {
        //     data[incrementedKey].y = data[incrementedKey - 1].y + 140
        // } else {
        //     data[incrementedKey].y = data[incrementedKey - 1].y + 60
        // }
        // });

        console.log(data);
        setSelectedData(data);
    }

    const replaceLabelNames = () => {
        let data = selectedData
        console.log(data)
        Object.entries(data).map(([key, value]) => {
            if (value.type === "label") {
                let val = document.getElementById(value.id).innerHTML
                data[key].text = val
            }
        })
        // Object.entries(data).map(([key,value]) => {
        //     if (value.text === '') {
        //         delete data[key]
        //     }
        // })
        setSelectedData(data)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        Object.entries(selectedData).map(([key, data]) => {
            //console.log(key)
            const element = document.querySelector(`[height-id="${data.id}"]`)
            //console.log(element.clientHeight)
            selectedData[key].height = element.clientHeight
        })

        const mainContainer = document.getElementById('main-container');
        sessionStorage.setItem("mainContainerHeight", mainContainer.clientHeight)

        //console.log(selectedData)

        // Object.entries(selectedData).forEach((key,data) => {
        //     if (parseInt(key[0]) === 0) {
        //         selectedData[parseInt(key[0])].y = 10 + (selectedData[parseInt(key[0])].height / 2)
        //     } else {
        //         selectedData[parseInt(key[0])].y = selectedData[parseInt(key[0]) - 1].y + (selectedData[parseInt(key[0]) - 1].height / 2) + (selectedData[parseInt(key[0])].height / 2) + 20
        //     }
        // })

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
        //finalData.ActivityThreeId = sessionStorage.getItem("ActivityThreeId");

        let data = { id: sessionStorage.getItem("ActivitiesId"), content: finalData }

        if (id) {
            await axios.post(`https://activities-alset-aef528d2fd94.herokuapp.com/activityfour/byId/${id}`, data)
        } else {
            await axios.post("https://activities-alset-aef528d2fd94.herokuapp.com/activityfour", data).then((response) => {
                const ActivityFourId = response.data.id;
                sessionStorage.setItem("ActivityFourId", ActivityFourId)
            })
        }

        if (sessionStorage.getItem("ActivityFiveId") !== "null" && sessionStorage.getItem("ActivityFiveId") !== null) {
            navigate(`/activityfive/${sessionStorage.getItem("ActivityFiveId")}`)
        } else {
            navigate('/activityfive')
        }

        // axios.post("https://activities-alset-aef528d2fd94.herokuapp.com/activityfour", data).then((response) => {
        //     // const ActivityFourId = response.data.id;
        //     // sessionStorage.setItem("ActivityFourId",ActivityFourId)
        // })

        // console.log("how")
        // console.log(finalData)
        // localStorage.setItem("clusteredData", JSON.stringify(selectedData));
        // localStorage.removeItem("clusteredDataActivity5")


        //navigate('/activityfive')
    }

    return (
        <Container style={{ marginTop: 20 }}>
            <h2>Activity 4</h2>
            <form onSubmit={handleSubmit}>
                <Typography>Instructions: </Typography>
                <Typography>The sentences you selected in the previous activity have been arranged on the left side of the pane below. Use the space below to cluster the sentences into themes by arranging the sentences that go together near each other. It’s okay if the sentences in a cluster overlap a bit.</Typography>
                <br />
                <Typography>You can then name the cluster by clicking the Add Label button to create a new text box. You can edit the label text by clicking on its text. You can drag the label anywhere in the clustering area by clicking and holding the label area. You can remove a label from the clustering area by deleting all of its text.</Typography>
                <br />
                <Typography>Once you are satisfied with your clusters and their labels, you can save everything by clicking the Submit button. Once submitted, your clusters and labels will be used in the next activity.</Typography>
                {/* <TextField margin='normal' label='Label Name' error={labelNameError} fullWidth onChange={(e)=>setLabelName(e.target.value)}></TextField> */}
                <Button onClick={() => { createLabel() }} sx={{ marginTop: 3, marginBottom: 3 }} fullWidth variant='outlined'>Add Label</Button>
                <Button onClick={() => {window.location.reload(false); }} sx={{ marginBottom: 2 }} variant='outlined' fullWidth disabled>Reset</Button>
                <Button onClick={() => checkClustering()} variant="outlined" fullWidth>Check clustering</Button>
                <Box id="main-container" style={{ minHeight: containerHeight === 0 ? 900 : containerHeight, width: '100%', position: 'relative', overflow: 'hidden', display: 'flex', flexWrap: 'wrap', flexDirection: 'column' }}>
                    {displayComponents()}
                </Box>
                <Button sx={{ marginTop: 3, marginBottom: 3 }} fullWidth type="submit" variant='outlined'>Submit</Button>
            </form>
        </Container>
    )
}

export default Act4