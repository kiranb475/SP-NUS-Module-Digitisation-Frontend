import { Container, TextField, Typography, Box, Button, List, Select, Menu, MenuItem, InputLabel, FormControlLabel, Switch } from "@mui/material"
import { lightBlue, yellow } from "@mui/material/colors";
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios'

const Act3 = () => {
    const [activityMVCContent, setActivityMVCContent] = useState({});
    const [userData, setUserData] = useState({})
    const [userData_ori, setUserData_ori] = useState({})
    const [AllowMLModel, setAllowMLModel] = useState(false)
    const [instructor,setInstructor] = useState(false)
    const [MLModel, setMLModel] = useState("")
    const [predefinedMLSelection, setPredefinedMLSelection] = useState(false)
    const [label, setLabel] = useState('Custom Text')
    const [instruction,setInstruction] = useState(`<Typography>The transcript you submitted was passed through an AI model trained to identify important sentences. The model’s sentence selection was then compared with yours. The sentences you and the model both selected are now highlighted in green. Sentences that the model classified as being important but you did not are highlighted in blue. Sentences you selected as being important but the model did not are highlighted in yellow.</Typography>
    <br /> <br/>
    <Typography>Please review the version of your transcript with the new highlights below. You’ll likely agree with some of the sentence selections and disagree with others. As you review the transcript, feel free to refine your sentence selections. When you are satisfied with your selections, click the Submit button to continue to the next activity. Only your choices about which sentences are important (yellow and green highlights) will be used in the next activity.</Typography>
    <br /> <br/>
    <Typography>You can refer to the following key to remind yourself of what the three colours mean.</Typography>
    <ul style={{ marginTop: 0 }}>
        <li><Typography>Only the model selected - blue</Typography></li>
        <li><Typography>Only you selected - yellow</Typography></li>
        <li><Typography>Both you and the model selected - green</Typography></li>
    </ul>
`)
    const navigate = useNavigate()
    const { id } = useParams()

    const getActivityMVCInterviewee = (data) => {
        //console.log(data)
        let content = {}
        Object.entries(data).map(([key, value]) => {
            content[key] = value.activity_mvc
        })
        return content
    }

    useEffect(() => {

        if (id === "null") {
            alert("Please go back to the previous activity and submit it to continue.")
        }

        if (sessionStorage.getItem("Occupation") == "Instructor") {
            setInstructor(true)
        }

        if (id) {
            axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/activitythree/byId/${id}`).then((response) => {
                if (response.data !== null) {

                    if (response.data.AllowMLModel) {
                        setAllowMLModel(response.data.AllowMLModel)
                    } else {
                        setAllowMLModel(false)
                    }

                    if (response.data.MLModel) {
                        setMLModel(response.data.MLModel)
                    } else {
                        setMLModel("None")
                    }

                    if (response.data.predefinedMLSelection) {
                        setPredefinedMLSelection(response.data.predefinedMLSelection)
                    } else { 
                        setPredefinedMLSelection(false)
                    }

                    setLabel(response.data.label)
                    setInstruction(response.data.instruction)

                    if (response.data.content) {
                        if (response.data.AllowMLModel) {
                            setUserData(RandomlyAssign(response.data, response.data))
                        }
                        setUserData_ori(response.data)
                        let activity_mvc_data = {}
                        for (let i = 1; i < Object.keys(response.data.content).length + 1; i++) {
                            if (response.data.content[i].questioner_tag !== undefined) {
                                activity_mvc_data[i] = { tag: response.data.content[i].questioner_tag, activity_mvc: response.data.content[i].activity_mvc }
                            } else {
                                activity_mvc_data[i] = { tag: response.data.content[i].response_tag, activity_mvc: getActivityMVCInterviewee(response.data.content[i].response_text) }
                            }
                        }
                        setActivityMVCContent(activity_mvc_data)
                    } else {
                        axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/activitytwo/byId/${sessionStorage.getItem("ActivityTwoId")}`).then((response) => {
                        if (response.data !== null) {
                            if (AllowMLModel) {
                                 setUserData(RandomlyAssign(response.data, response.data))
                            }
                            setUserData_ori(response.data)
                            let activity_mvc_data = {}
                            for (let i = 1; i < Object.keys(response.data.content).length + 1; i++) {
                                if (response.data.content[i].questioner_tag !== undefined) {
                                    activity_mvc_data[i] = { tag: response.data.content[i].questioner_tag, activity_mvc: response.data.content[i].activity_mvc }
                                } else {
                                    activity_mvc_data[i] = { tag: response.data.content[i].response_tag, activity_mvc: getActivityMVCInterviewee(response.data.content[i].response_text) }
                                }
                            }
                            setActivityMVCContent(activity_mvc_data)
                        }})
                    }
                }
            })
        } else {
            axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/activitytwo/byId/${sessionStorage.getItem("ActivityTwoId")}`).then((response) => {
                if (response.data !== null) {
                    setUserData(RandomlyAssign(response.data, response.data))
                    setUserData_ori(response.data)
                    let activity_mvc_data = {}
                    for (let i = 1; i < Object.keys(response.data.content).length + 1; i++) {
                        if (response.data.content[i].questioner_tag !== undefined) {
                            activity_mvc_data[i] = { tag: response.data.content[i].questioner_tag, activity_mvc: response.data.content[i].activity_mvc }
                        } else {
                            activity_mvc_data[i] = { tag: response.data.content[i].response_tag, activity_mvc: getActivityMVCInterviewee(response.data.content[i].response_text) }
                        }
                    }
                    setActivityMVCContent(activity_mvc_data)

                } else {
                    alert("Before progressing to Activity 3, please complete Activity 2.")
                }
            })
        }
    }, [])


    const changeContents = (key, key2, flag) => {
        let userContent = userData_ori
        const check = new RegExp('background-color: yellow', 'g');
        console.log(userContent.content[key].response_text[key2].activity_mvc)
        if (userContent.content[key].response_text[key2].activity_mvc.css.match(check)) {
            userContent.content[key].response_text[key2].activity_mvc.css = "display: inline;"
        } else {
            userContent.content[key].response_text[key2].activity_mvc.css = "display: inline; background-color: yellow;"
        }
        if (flag === 1) {
            userContent.content[key].response_text[key2].activity_mvc.html = userContent.content[key].response_text[key2].activity_mvc.html.replace(/style="display:\s*inline;"/g, 'style="display: inline; background-color: yellow;"')
        } else if (flag === 2) {
            userContent.content[key].response_text[key2].activity_mvc.html = userContent.content[key].response_text[key2].activity_mvc.html.replace(/style="display: inline; background-color: yellow;"/g, 'style="display: inline;"')
        }
        setUserData_ori(userContent)
    }

    // handles highlighting 
    const handleClick = (event, css, key, key2) => {
        if (event.target.style.backgroundColor === 'lightgreen') {
            event.target.style.backgroundColor = 'lightblue'
            changeContents(key, key2, 2)
        } else if (event.target.style.backgroundColor === 'lightblue') {
            changeContents(key, key2, 1)
            event.target.style.backgroundColor = 'lightgreen'
        } else if (event.target.style.backgroundColor === '') {
            event.target.style.backgroundColor = 'yellow'
            changeContents(key, key2, 1)
        } else {
            changeContents(key, key2, 2)
            event.target.style.backgroundColor = ''
        }

    };

    // displays relevant configurations if you are an instructor 
    const displayConfig = () => {
        if (sessionStorage.getItem("Occupation") === "Instructor") {
            return (
                <>
                    <Typography style={{ marginTop: 10, marginBottom: 10 }}>If no machine learning model is selected, machine learning selections will not be made.</Typography>
                <div style={{ display: "flex", width: "100%" }}>
                    <div style={{ width: "50%" }}>
                        <InputLabel>Machine Learning Model</InputLabel>
                        <Select value={MLModel} onChange={(e) => setMLModel(e.target.value)} fullWidth>
                            <MenuItem value={"None"}>None</MenuItem>
                            <MenuItem value={"Model1"}>Model 1</MenuItem>
                            <MenuItem value={"Model2"}>Model 2</MenuItem>
                            <MenuItem value={"Model3"}>Model 3</MenuItem>
                            <MenuItem value={"Model4"}>Model 4</MenuItem>
                        </Select>
                    </div>
                </div>
                <div style={{ width: "100%" }}>
                    <FormControlLabel style={{ marginTop: 10 }} control={<Switch checked={AllowMLModel} onChange={() => setAllowMLModel((prev) => !prev)} />} label="Allow Machine Learning Sentence Selections" />
                </div>
                <div style={{ width: "100%" }}>
                    <FormControlLabel style={{ marginTop: 10 }} control={<Switch checked={predefinedMLSelection} onChange={() => setPredefinedMLSelection((prev) => !prev)} />} label="Predefined Machine Learning Selection" />
                </div>
                </>
            )
        }
    }

    // displays interviewee sentences
    const displayInterviewee = (data, key) => {
        return Object.entries(data).map(([key2, value]) => (
            <Typography display="inline" style={{ backgroundColor: value.css.split(":")[1] }} onClick={(e) => { handleClick(e, value.css, key, key2) }} dangerouslySetInnerHTML={{ __html: value.html }}></Typography>
        ));
    };

    const getActivityMVC = (value) => {
        const element = document.querySelector(`[id="${value}"]`);
        if (element) {
            const htmlContent = element.outerHTML;
            const inlineStyles = element.getAttribute('style') || 'No inline styles';
            return { html: htmlContent, css: inlineStyles }
        } else {
            console.log('Element not found');
            return undefined
        }
    }

    function randNum() {
        const randVal = Math.random()
        if (randVal < 0.5) {
            return -1
        } else if (randVal < 0.6) {
            return 0
        } else if (randVal < 0.7) {
            return 1
        } else if (randVal < 0.8) {
            return 2
        } else if (randVal < 0.9) {
            return 3
        } else {
            return 4
        }
    }


    // handles submission
    const handleSubmit = async (e) => {
        e.preventDefault()
        let userContent = userData
        let userContent_ori = userData_ori
        userContent.user_ai_markup_id = "tbd"
        console.log(userContent_ori)

        console.log(userContent_ori)
        
        if (!id) {
            delete userContent_ori["predefinedHighlighting"]
            delete userContent_ori["predefinedTranscript"]
        }
        userContent_ori.MLModel = MLModel
        userContent_ori.AllowMLModel = AllowMLModel
        userContent_ori.predefinedMLSelection = predefinedMLSelection
        userContent_ori.label = document.getElementById("activity-three-label").innerHTML
        userContent_ori.instruction = document.getElementById("activity-three-instruction").innerHTML

        console.log(userContent_ori.AllowMLModel)
        let data = { id: sessionStorage.getItem("ActivitiesId"), content: userContent_ori }

        if (id) {
            await axios.post(`https://activities-alset-aef528d2fd94.herokuapp.com/activitythree/byId/${id}`, data)
        } else {
            await axios.post("https://activities-alset-aef528d2fd94.herokuapp.com/activitythree", data).then((response) => {
                const ActivityThreeId = response.data.id;
                sessionStorage.setItem("ActivityThreeId",ActivityThreeId)
            })
        }

        if (sessionStorage.getItem("ActivityFourId") !== "null" && sessionStorage.getItem("ActivityFourId") !== null) {
            navigate(`/activityfour/${sessionStorage.getItem("ActivityFourId")}`)
          } else {
            navigate('/activityfour')
          }
    }


    const RandomlyAssign = (data, data2) => {
        let userContent = data
        let userContent_ori = data2

        Object.entries(userContent.content).map(([key, value]) => {
            if (value.questioner_tag === undefined) {
                Object.entries(value.response_text).map(([key2, value2]) => {
                    let rand = randNum()
                    // userContent_ori.content[key].response_text[key2].AI_classified = rand
                    if (rand != -1 && value2.text !== '.' && value2.text !== ' ') {
                        userContent_ori.content[key].response_text[key2].AI_classified = rand
                        if (value2.activity_mvc.css === "display: inline; background-color: yellow;") {
                            value2.activity_mvc.html = value2.activity_mvc.html.replace(/background-color:.*?;/gi, 'background-color: lightgreen;')
                        } else {
                            value2.activity_mvc.html = value2.activity_mvc.html.replace(/style="display:\s*inline;"/g, 'style="display: inline; background-color: lightblue;"');
                        }
                    } else if (value2.text !== "." && value2.text !== " ") {
                        userContent_ori.content[key].response_text[key2].AI_classified = rand
                    }
                })
            }
        })
        setUserData_ori(data2)
        return data
    }


    return (
        <Container style={{ marginTop: 20 }}>
            <div style={{ display: "flex", direction: "row" }}>
                <h2>Activity 3:</h2>&nbsp;&nbsp;
                <h2 dangerouslySetInnerHTML={{ __html: ` ${label}` }} contentEditable="true" style={{ minHeight: 1, borderRight: "solid rgba(0,0,0,0) 1px", outline: "none" }} id="activity-three-label"></h2>
            </div>
            <form onSubmit={handleSubmit}>
                <Typography>Instructions (Editable by Instructors): </Typography>
                <Typography id="activity-three-instruction" dangerouslySetInnerHTML={{ __html: ` ${instruction}` }} contentEditable={instructor && true} style={{ minHeight: 1, borderRight: "solid rgba(0,0,0,0) 1px", outline: "none" }}></Typography>
                {/* {sessionStorage.getItem("Occupation") == "Student" && sessionStorage.getItem("predefinedHighlighting") && <Typography style={{ marginTop: 10 }}>You are not allowed to edit the highlighting of the transcript in this template.</Typography>} */}
                {displayConfig()}
                <Box sx={{ marginTop: 3, padding: 2, border: '1px solid black' }} id="content-container">
                    {Object.entries(activityMVCContent).map(([key, value]) => {
                        if (key % 2 !== 0) {
                            return (
                                <>
                                    <div>
                                        <Typography display="inline">{value.tag}: </Typography>
                                        <Typography display="inline" style={{ backgroundColor: value.activity_mvc.css.split(":")[1] }} dangerouslySetInnerHTML={{ __html: value.activity_mvc.html }}></Typography>
                                    </div>
                                    <div>
                                        <br />
                                    </div>
                                </>
                            )
                        } else {
                            return (
                                <>
                                    <div>
                                        <Typography display="inline">{value.tag}: </Typography>
                                        {displayInterviewee(value.activity_mvc, key)}
                                    </div>
                                    <div>
                                        <br />
                                    </div>
                                </>
                            )
                        }
                    })}
                </Box>
                <Button sx={{ marginTop: 3, marginBottom: 3 }} fullWidth type="submit" variant='outlined'>Submit</Button>
            </form>


        </Container>
    )
}

export default Act3