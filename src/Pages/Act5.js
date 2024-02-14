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
    const [alternateView, setAlternateView] = useState(false)
    const [AISetting, setAISetting] = useState(false)
    const [AIClusters, setAIClusters] = useState({})
    const [instructor, setInstructor] = useState(false)
    const [label, setLabel] = useState('Custom Text')
    const [instruction, setInstruction] = useState(`
    <Typography>For this activity, you will see two views of your clusters and labels. In the User view, you will see the arrangement you submitted in the previous activity or the arrangement you are currently working on. In the Alternative view, you will see how the AI model would have clustered the sentences you selected. The Alternative view does not provide labels for the clusters, but you might be able to infer them yourself.</Typography>
    <br />
    <br />
    <Typography>Compare the two arrangement and refine the arrangement in the User view in anyway that you feel improves it. When you are satisfied with the arrangement in the User view, click the Submit button to continue to the next activity.</Typography>`
    )
    const navigate = useNavigate()
    const { id } = useParams()

    useEffect(() => {

        if (id === "null") {
            alert("Please go back to the previous activity and submit it to continue.")
        }

        if (sessionStorage.getItem("Occupation") == "Instructor") {
            setInstructor(true)
        }

        let height = sessionStorage.getItem("mainContainerHeight")

        if (id) {
            axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/activityfive/byId/${id}`).then((response) => {
                if (response.data !== null) {

                    if (response.data.MLClusters) {
                        setMLClusters(response.data.MLClusters)
                    } else {
                        setMLClusters(false)
                    }

                    setLabel(response.data.label)
                    setInstruction(response.data.instruction)

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
                        Object.entries(clustData).map(([key3, value3]) => {
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


    }

    const createLabel = () => {
        const newKey = Object.keys(clustData).length;
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
    }
    const checkProximity = (x1, y1, x2, y2, type1, type2, height1, height2) => {
        if (Math.abs(x1 - x2) <= 260 && Math.abs(y1 - y2) <= (height1 / 2 + height2 / 2 + 30)) {
            return true
        } else {
            return false
        }
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
                                    <Typography style={{ border: '1px solid black', backgroundColor: alternateView ? value.ai_color : value.color, borderRadius: 5, padding: 1 }} onBlur={() => { let text = document.getElementById(value.id).innerHTML; text === '' || text === `<br>` ? removeLabel(value.id) : console.log(text) }} id={value.id} contenteditable="true" variant="h6">{value.text}</Typography>
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
            '-1': { content: {}, color: getColor() },
            '0': { content: {}, color: getColor() },
            '1': { content: {}, color: getColor() },
            '2': { content: {}, color: getColor() },
            '3': { content: {}, color: getColor() },
            '4': { content: {}, color: getColor() }
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
        final_data.label = document.getElementById("activity-five-label").innerHTML
        final_data.instruction = document.getElementById("activity-five-instruction").innerHTML
        console.log(final_data.MLClusters)

        let data = { id: sessionStorage.getItem("ActivitiesId"), content: final_data }

        if (id) {
            await axios.post(`https://activities-alset-aef528d2fd94.herokuapp.com/activityfive/byId/${id}`, data).then((response) => {
                console.log(response)
            })
        } else {
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
    }

    const removeLabel = (idToRemove) => {
        setClustData((prevData) => {
            const newData = { ...prevData };
            Object.entries(newData).forEach(([key, value]) => {
                if (value.id === idToRemove) {
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
            <div style={{ display: "flex", direction: "row" }}>
                <h2>Activity 5:</h2>&nbsp;&nbsp;
                <h2 dangerouslySetInnerHTML={{ __html: ` ${label}` }} contentEditable="true" style={{ minHeight: 1, borderRight: "solid rgba(0,0,0,0) 1px", outline: "none" }} id="activity-five-label"></h2>
            </div>
            <form onSubmit={handleSubmit}>
                <Typography>Instructions (Editable by Instructors): </Typography>
                <Typography id="activity-five-instruction" dangerouslySetInnerHTML={{ __html: ` ${instruction}` }} contentEditable={instructor && true} style={{ minHeight: 1, borderRight: "solid rgba(0,0,0,0) 1px", outline: "none" }}></Typography>
                {displayConfig()}
                {viewUser ?
                    <ButtonGroup fullWidth variant="outlined" sx={{ marginTop: 3, marginBottom: 3 }}>
                        <Button onClick={() => { localStorage.removeItem("clusteredDataActivity5"); window.location.reload(false); }} fullWidth variant="outlined" disabled>Reset</Button>
                        <Button onClick={() => { createLabel() }} fullWidth variant='outlined'>Add Label</Button>
                        <Button onClick={() => { checkClustering() }} fullWidth variant="outlined">Check clustering</Button>
                    </ButtonGroup>
                    : <div style={{ marginBottom: 20 }}></div>
                }
                {console.log("container height")}
                {console.log(containerHeight)}
                {/* <Button onClick={()=>{createLabel()}} sx={{marginTop:3,marginBottom:3}} fullWidth variant='outlined'>Add Label</Button> */}
                <Box style={{ backgroundColor: viewUser ? "lightyellow" : "lightblue", borderRadius: 10, minHeight: containerHeight, width: '100%', position: 'relative', overflow: 'hidden', display: 'flex', flexWrap: 'wrap', flexDirection: viewUser ? 'column' : 'row', alignContent: 'flex-start' }}>
                    <FormControlLabel disabled style={{ marginTop: 10, marginLeft: 10 }} control={<Switch checked={alternateView} onChange={() => { console.log("yay"); createAIClustering(); setAlternateView((prev) => !prev) }} />} label="View AI Clustering" />
                    {displayComponents()}
                </Box>
                <Button sx={{ marginTop: 3, marginBottom: 3 }} fullWidth type="submit" variant='outlined'>Submit</Button>
            </form>
        </Container>
    )
}

export default Act5