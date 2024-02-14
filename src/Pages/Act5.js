import { Box, Button, ButtonGroup, Container, FormControlLabel, Switch, Tooltip, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import Draggable from "react-draggable"
import { json, useNavigate, useParams, useSearchParams } from "react-router-dom"
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios'
import { getColor } from '../Components/Colors.js'

const Act5 = () => {
    const [clustData, setClustData] = useState({})
    const [oriData, setOriData] = useState({})
    const [viewUser, setViewUser] = useState(true)
    const [containerHeight, setContainerHeight] = useState(0)
    const [containerWidth, setContainerWidth] = useState(0)
    const [MLClusters, setMLClusters] = useState(false)
    const [alternateView,setAlternateView] = useState(false)
    const [AISetting,setAISetting] = useState(false)
    const [AIClusters,setAIClusters] = useState({})
    const navigate = useNavigate()
    const { id } = useParams()

    useEffect(() => {

        if (id === "null") {
            alert("Please go back to the previous activity and submit it to continue.")
        }

        //let clusteredData = JSON.parse(localStorage.getItem("clusteredData"))
        //let originalData = JSON.parse(localStorage.getItem("userData"))
        let height = sessionStorage.getItem("mainContainerHeight")
        //let width = localStorage.getItem("mainContainerWidth")

        if (id) {
            axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/activityfive/byId/${id}`).then((response) => {
                if (response.data !== null) {

                    if (response.data.MLClusters) {
                        setMLClusters(response.data.MLClusters)
                    } else {
                        setMLClusters(false)
                    }

                    if (response.data.content) {
                        setClustData(response.data.content)
                    } else {
                        axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/activityfour/byId/${sessionStorage.getItem("ActivityFourId")}`).then((response) => {
                            if (response.data !== null) {
                                setClustData(response.data.content)

                                axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/activitythree/byId/${sessionStorage.getItem("ActivityThreeId")}`).then((response) => {
                                    if (response.data != null) {
                                        setOriData(response.data)
                                    }
                                })
                            }
                        })
                    }

                    if (height != null) { setContainerHeight(parseInt(height) + 50) }
                }
            })
            axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/activitythree/byId/${sessionStorage.getItem("ActivityThreeId")}`).then((response) => {
                if (response.data != null) {
                    setOriData(response.data)
                }
            })
        } else {
            axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/activityfour/byId/${sessionStorage.getItem("ActivityFourId")}`).then((response) => {
                if (response.data !== null) {
                    setClustData(response.data.content)

                    axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/activitythree/byId/${sessionStorage.getItem("ActivityThreeId")}`).then((response) => {
                        if (response.data != null) {
                            setOriData(response.data)
                        }
                    })

                    if (height != null) { setContainerHeight(parseInt(height) + 50) }
                } else {
                    alert("Before progressing to Activity 5, please complete Activity 4.")
                }
            })
        }
    
        


        //let clusteredDataActivity5 = JSON.parse(localStorage.getItem("clusteredDataActivity5"))
        //let height = localStorage.getItem("mainContainerHeight")
        //let width = localStorage.getItem("mainContainerWidth")
        //console.log(clusteredData)
        //console.log(originalData)
        // if (clusteredDataActivity5 === null) {
        //     clusteredDataActivity5 = clusteredData
        // }
        //setClustData(clusteredDataActivity5)
        //setOriData(originalData)
        // setContainerHeight(parseInt(height) + 50)
        // setContainerWidth(parseInt(width))
    }, [])

    const createAIClustering = () => {

        let clusters = {}
        console.log("to clusters")
            if (!AISetting) {
                console.log("should be once")
                clusters = AI_clusters()
                setAISetting(true)
                setAIClusters(clusters)
            } else {
                clusters = AIClusters
                console.log(clusters)
            }

            const check = new RegExp('background-color: yellow', 'g');
            // return Object.entries(oriData.content).map(([key,value]) => {
            //     if (value.questioner_tag === undefined) {
            //         return Object.entries(value.response_text).map(([key2,value2])=>{
            //             //console.log(value2)
            //             if ((value2.AI_classified !== -1 && value2.AI_classified !== undefined) || value2.activity_mvc.css.match(check)) {
            //                 return (
            //                     <Draggable defaultPosition={{x: value2.AI_classified === -1 ? 0 : 250 + 250*value2.AI_classified,y:0}} bounds="parent">
            //                         <div style={{ width: 200,  height: 100, backgroundColor: 'lightgrey', padding: 10, margin:10, cursor: 'move', borderRadius: 15, border: "1px solid black", overflow: "hidden"}}>
            //                             <Typography fontSize={13}>{value2.text}</Typography>
            //                         </div>
            //                     </Draggable>
            //                     )
            //             }
            //         })
            //     }
            // })
            console.log("AI Clusters")
            console.log(clusters)
            let x_coordinate = 200
            let y_coordinate = 200
            let count = 0
            if (MLClusters) {
                // return <>yay</>
                Object.entries(clusters).map(([key, value], index) => {
                    if (Object.entries(value.content).length != 0) {
                        Object.entries(value.content).map(([key2, value2]) => {
                            Object.entries(clustData).map(([key3,value3]) => {
                                if (value2.text == value3.text) {
                                    console.log(value2.text)
                                    console.log(value3.text)
                                    console.log(clusters[key].color)
                                    clustData[key3].ai_color = clusters[key].color
                                }
                            })
                        })
                    }
                })
            } else {
                return <>no</>
            }
            console.log(clustData)
            // return Object.entries(clusters).map(([key, value], index) => {
            //     const clusterComponents = Object.entries(value).map(([key2, value2]) => {
            //         console.log("alternatives")
            //         console.log(value2)
            //         return (
            //             <Draggable defaultPosition={{ x: value2.x_coordinate, y: value2.y_coordinate }} onStart={() => false} bounds="parent">
            //                 <div style={{ width: 200, height: 100, backgroundColor: 'lightgrey', padding: 10, margin: 10, cursor: 'move', borderRadius: 15, border: "1px solid black", overflow: "hidden" }}>
            //                     <Tooltip title={value2.text}>
            //                         <Typography fontSize={13}>{value2.text}</Typography>
            //                     </Tooltip>
            //                 </div>
            //             </Draggable>
            //         );
            //     });

            //     if (index < Object.keys(clusters).length - 1 && Object.keys(clusters[key]).length !== 0) {
            //         clusterComponents.push(
            //             <div style={{ width: '100%', height: '50px' }} />
            //         );
            //     }

            //     return clusterComponents;

            // })

    }

    const createLabel = () => {
        const newKey = Object.keys(clustData).length;
        // let data = selectedData
        // for (let i = newKey; i > 0; i = i - 1) {
        //     data[i] = data[i-1]
        // }
        // data[0] = { text: "Click to Edit", x: 0, y: 0, class: -1 }
        let data_y = 0
        let data = clustData
        let value = data[newKey - 1].y
        if (data[newKey - 1].type === "label") {
            data_y = value + 60
        } else {
            data_y = value + 100
        }

        const key = uuidv4()
        const currColor = getColor();
        data = { [newKey]: { id: key, text: "Click to edit label", x: 120, y: data_y, new_x: 0, new_y: 0, class: -1, type: "label", color: currColor }, ...clustData };
        console.log(data)
        setClustData(data);

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
    }
    const checkProximity = (x1, y1, x2, y2, type1, type2, height1, height2) => {
        if (Math.abs(x1 - x2) <= 260 && Math.abs(y1 - y2) <= (height1 / 2 + height2 / 2 + 30)) {
            return true
        } else {
            return false
        }
        // if (type1 === "label" || type2 === "label") {
        //     if (Math.abs(x1-x2) <= 240 && Math.abs(y1-y2) <= 100) {
        //         return true
        //     } else {
        //         return false
        //     }
        // } else if (Math.abs(x1-x2) <= 240 && Math.abs(y1-y2) <= 140) {
        //     return true
        // } else {
        //     return false
        // }
    }

    const checkClass = () => {
        let userData = clustData
        let currentClass = 0
        let flag = false
        let flag2 = false
        let colorsUsedData = {}
        console.log(userData)

        Object.entries(userData).map(([key, value]) => {
            value.class = -1
        })

        Object.entries(userData).map(([key, value]) => {
            Object.entries(userData).map(([key2, value2]) => {
                if (checkProximity(value.x + value.new_x, value.y + value.new_y, value2.x + value2.new_x, value2.y + value2.new_y, value.type, value2.type, value.height, value2.height) && value2.class === -1) {
                    console.log(value)
                    console.log(value2)
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
                            colorsUsedData[userData[key2].class] = userData[key2].color
                        }
                    }
                    console.log(currentClass)
                }
            })
            flag = true
            flag2 = false
        })
        console.log(userData)
        setClustData(userData)
        return colorsUsedData
    }

    const checkClustering = () => {

        Object.entries(clustData).map(([key, data]) => {
            console.log(key)
            const element = document.querySelector(`[height-id="${data.id}"]`)
            console.log(element.clientHeight)
            clustData[key].height = element.clientHeight
        })

        let colorsUsedData = {}
        colorsUsedData = checkClass()
        replaceLabelNames()
        const updatedClustData = { ...clustData };

        Object.entries(updatedClustData).forEach(([key, value]) => {
            updatedClustData[key].color = colorsUsedData[value.class];
        });

        console.log(updatedClustData)
        setClustData(updatedClustData);
    }

    const replaceLabelNames = () => {
        let data = clustData
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
        setClustData(data)
    }

    const displayConfig = () => {
        if (sessionStorage.getItem("Occupation") === "Instructor") {
            return (
                <div style={{ width: "100%" }}>
                    <FormControlLabel style={{ marginTop: 10 }} control={<Switch checked={MLClusters} onChange={() => setMLClusters((prev) => !prev)} />} label="Allow Machine Learning Clustering" />
                </div>
            )
        }
    }

    const handleDrag = (e, data, key) => {
        let userData = clustData
        // let ori_x = userData[key].x
        // let ori_y = userData[key].y
        setClustData((prevData) => ({
            ...prevData,
            [key]: { ...prevData[key], new_x: data.x, new_y: data.y },
        }));
        console.log(clustData)
    };

    const displayComponents = () => {
        if (viewUser === true) {
            console.log("clustered data")
            console.log(clustData)
            return Object.entries(clustData).map(([key, value]) => {
                console.log(value)
                if (value.type === "label") {
                    if (value.removed === true) {
                        return (
                            <Draggable defaultPosition={{ x: value.new_x, y: value.new_y }} key={value.id} onDrag={(e, data) => handleDrag(e, data, key)} bounds="parent">
                                <div height-id={value.id} style={{ width: 200, height: 20, padding: 10, margin: 10, cursor: 'move' }}>
                                    <Typography style={{ borderRadius: 5, padding: 1 }} id={value.id} variant="h6"></Typography>
                                </div>
                            </Draggable>
                        )
                    } else {
                        return (
                            <Draggable defaultPosition={{ x: value.new_x, y: value.new_y }} key={value.id} onDrag={(e, data) => handleDrag(e, data, key)} bounds="parent">
                                <div height-id={value.id} style={{ width: 200, height: 20, padding: 10, margin: 10, cursor: 'move' }}>
                                    <Typography style={{ border: '1px solid black', backgroundColor: alternateView ? value.ai_color :value.color, borderRadius: 5, padding: 1 }} onBlur={() => { let text = document.getElementById(value.id).innerHTML; text === '' || text === `<br>` ? removeLabel(value.id) : console.log(text) }} id={value.id} contenteditable="true" variant="h6">{value.text}</Typography>
                                </div>
                            </Draggable>
                        )
                    }

                } else {
                    return (
                        <Draggable defaultPosition={{ x: value.new_x, y: value.new_y }} key={value.id} onDrag={(e, data) => handleDrag(e, data, key)} bounds="parent">
                            <div height-id={value.id} style={{ width: 200, height: 100, backgroundColor: alternateView ? value.ai_color : value.color ? value.color : 'lightgrey', padding: 10, margin: 10, cursor: 'move', borderRadius: 15, border: "1px solid black", overflow: "hidden" }}>
                                <Tooltip title={value.text}>
                                    <Typography id={value.id} fontSize={13}>{value.text}</Typography>
                                </Tooltip>
                            </div>
                        </Draggable>
                    )
                }
            })
        }

    }

    const scrollNewLabelIntoView = (key) => {
        setTimeout(() => {
            const labelElement = document.getElementById(key);
            if (labelElement) {
                labelElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 0);
    }


    const AI_clusters = () => {

        let clusters = {
            '-1': {content:{},color:getColor()},
            '0': {content:{},color:getColor()},
            '1': {content:{},color:getColor()},
            '2': {content:{},color:getColor()},
            '3': {content:{},color:getColor()},
            '4': {content:{},color:getColor()}
        }

        const ori_y = 0
        const ori_x = 0
        const check = new RegExp('background-color: yellow', 'g');
        console.log("ori data")
        console.log(oriData)
        Object.entries(oriData.content).map(([key, value]) => {
            if (value.questioner_tag === undefined) {
                Object.entries(value.response_text).map(([key2, value2]) => {
                    console.log(value2)
                    if ((value2.AI_classified !== -1 && value2.AI_classified !== undefined) && value2.activity_mvc.css.match(check) || value2.activity_mvc.css.match(check)) {
                        clusters[value2.AI_classified.toString()].content[Object.keys(clusters[value2.AI_classified.toString()]).length - 1] = value2
                    }
                })
            }
        })
        console.log("returned")
        console.log(clusters)
        return clusters
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        Object.entries(clustData).map(([key, data]) => {
            console.log(key)
            const element = document.querySelector(`[height-id="${data.id}"]`)
            console.log(element.clientHeight)
            clustData[key].height = element.clientHeight
        })

        checkClass()
        replaceLabelNames()
        let final_data = {}
        final_data.content = clustData
        final_data.UserId = sessionStorage.getItem("UserId")
        final_data.MLClusters = MLClusters
        console.log(final_data.MLClusters)
        //final_data.ActivityFourId = sessionStorage.getItem("ActivityFourId")

        let data = { id: sessionStorage.getItem("ActivitiesId"), content: final_data }

        if (id) {
            console.log("yay1")
            await axios.post(`https://activities-alset-aef528d2fd94.herokuapp.com/activityfive/byId/${id}`, data).then((response) => {
                console.log(response)
            })
        } else {
            console.log("yay2")
            await axios.post("https://activities-alset-aef528d2fd94.herokuapp.com/activityfive", data).then((response) => {
                const ActivityFiveId = response.data.id;
                sessionStorage.setItem("ActivityFiveId", ActivityFiveId)
            })
        }

        if (sessionStorage.getItem("ActivitySixId") !== "null" && sessionStorage.getItem("ActivitySixId") !== null) {
            navigate(`/activitysix/${sessionStorage.getItem("ActivitySixId")}`)
        } else {
            navigate('/activitysix')
        }

        // axios.post("https://activities-alset-aef528d2fd94.herokuapp.com/activityfive", data).then((response) => {
        //    // const ActivityFiveId = response.data.id;
        //    // sessionStorage.setItem("ActivityFiveId",ActivityFiveId)
        // })

        // console.log(final_data)
        // localStorage.setItem("clusteredDataActivity5",JSON.stringify(clustData));
        // navigate('/activitysix')
    }


    // const removeLabel = (idToRemove) => {
    //     setClustData((prevData) => {
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

    const removeLabel = (idToRemove) => {
        setClustData((prevData) => {
            const newData = { ...prevData };
            Object.entries(newData).forEach(([key, value]) => {
                if (value.id === idToRemove) {
                    // newData[key].type = "null";
                    newData[key].removed = true
                    const labelElement = document.querySelector(`[height-id="${value.id}"] > h6`)
                    console.log(labelElement)
                    if (labelElement) {
                        labelElement.contentEditable = "false"
                        labelElement.style.border = "none"
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

    return (
        <Container style={{ marginTop: 20 }}>
            <h2>Activity 5</h2>
            <form onSubmit={handleSubmit}>
                <Typography>Instructions: </Typography>
                <Typography>For this activity, you will see two views of your clusters and labels. In the User view, you will see the arrangement you submitted in the previous activity or the arrangement you are currently working on. In the Alternative view, you will see how the AI model would have clustered the sentences you selected. The Alternative view does not provide labels for the clusters, but you might be able to infer them yourself.</Typography>
                <br />
                <Typography>Compare the two arrangement and refine the arrangement in the User view in anyway that you feel improves it. When you are satisfied with the arrangement in the User view, click the Submit button to continue to the next activity.</Typography>
                {displayConfig()}
                {/* <ButtonGroup fullWidth variant="outlined" sx={{ marginTop: 3 }}>
                    <Button style={{ backgroundColor: "lightyellow" }} onClick={() => setViewUser(true)}>User</Button>
                    <Button style={{ backgroundColor: "lightblue" }} onClick={() => { setViewUser(false); checkClass(); replaceLabelNames(); localStorage.setItem("clusteredDataActivity5", JSON.stringify(clustData)); }}>Alternative</Button>
                </ButtonGroup> */}
                {viewUser ?
                    <ButtonGroup fullWidth variant="outlined" sx={{ marginTop: 3, marginBottom: 3 }}>
                        <Button onClick={() => { localStorage.removeItem("clusteredDataActivity5"); window.location.reload(false); }} fullWidth variant="outlined" disabled>Reset</Button>
                        <Button onClick={() => { createLabel() }} fullWidth variant='outlined'>Add Label</Button>
                        <Button onClick={() => {checkClustering() }} fullWidth variant="outlined">Check clustering</Button>
                    </ButtonGroup>
                    : <div style={{ marginBottom: 20 }}></div>
                }
                {console.log("container height")}
                {console.log(containerHeight)}
                {/* <Button onClick={()=>{createLabel()}} sx={{marginTop:3,marginBottom:3}} fullWidth variant='outlined'>Add Label</Button> */}
                <Box style={{ backgroundColor: viewUser ? "lightyellow" : "lightblue", borderRadius: 10, minHeight: containerHeight, width: '100%', position: 'relative', overflow: 'hidden', display: 'flex', flexWrap: 'wrap', flexDirection: viewUser ? 'column' : 'row', alignContent: 'flex-start' }}>
                <FormControlLabel style={{ marginTop: 10, marginLeft:10 }} control={<Switch checked={alternateView} onChange={() =>  {console.log("yay");createAIClustering();setAlternateView((prev) => !prev)}} />} label="View AI Clustering" />
                    {displayComponents()}
                </Box>
                <Button sx={{ marginTop: 3, marginBottom: 3 }} fullWidth type="submit" variant='outlined'>Submit</Button>
            </form>
        </Container>
    )
}

export default Act5