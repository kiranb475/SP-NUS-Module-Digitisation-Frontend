import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Container, Divider, FormControlLabel, InputLabel, MenuItem, Select, StepLabel, Switch, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';


function Home() {

    const [listOfActivities, setListOfActivities] = useState({})
    const [listOfActivitiesInstructor, setListOfActivitiesInstructor] = useState({})
    const [instructor, setInstructor] = useState(false)
    const [switchValues, setSwitchValues] = useState({});
    const [AllowMLModel, setAllowMLModel] = useState({})
    const [MLModel, setMLModel] = useState({})
    const [predefinedMLSelection, setPredefinedMLSelection] = useState({})
    const [transcriptError, setTranscriptError] = useState({})
    const [helperText, setHelperText] = useState({})
    const [transcript, setTranscript] = useState({})
    const [MLClusters, setMLClusters] = useState({})
    const [listOfActivitiesStudents, setListOfActivitiesStudents] = useState({})
    const [activityTitle, setActivityTitle] = useState({})
    const [activityDescription, setActivityDescription] = useState({})
    const [predefinedHighlighting, setPredefinedHighlighting] = useState({})
    const [activityTitleInstructor, setActivityTitleInstructor] = useState({})
    const [activityDescriptionInstructor, setActivityDescriptionInstructor] = useState({})
    const [activityTitleStudent, setActivityTitleStudent] = useState({})
    const [activityDescriptionStudent, setActivityDescriptionStudent] = useState({})
    const [activityLabel, setActivityLabel] = useState('Custom Label')
    const [activityInstruction, setActivityInstruction] = useState('')
    const navigate = useNavigate()

    useEffect(() => {

        // checks whether the occupation of the current user is instructor
        if (sessionStorage.getItem("Occupation") === "Instructor") {
            setInstructor(true)
            // gets a list of all activities created by students
            axios.get("https://activities-alset-aef528d2fd94.herokuapp.com/home/students").then((response) => {
                if (response.data != null) {
                    Object.entries(response.data).map((data) => {
                        axios.post("https://activities-alset-aef528d2fd94.herokuapp.com/home", { UserId: parseInt(data[1].id) }).then((response) => {
                            if (response.data != null) {
                                const final = response.data
                                setListOfActivitiesStudents((prevValues) => ({ ...prevValues, [data[1].id]: final }))
                                Object.entries(response.data).map((data) => {
                                    if (data[1].ActivityOneId) {
                                        axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/activityone/byId/${parseInt(data[1].ActivityOneId)}`).then((response) => {
                                            setActivityTitleStudent((prevValues) => ({ ...prevValues, [data[1].ActivityOneId]: response.data.transcript_source_id }))
                                            setActivityDescriptionStudent((prevValues) => ({ ...prevValues, [data[1].ActivityOneId]: response.data.activity_description }))
                                        })
                                    }
                                })
                            }
                        })
                    })
                }
            })
        } else {
            // gets a list of all activities created by instructors
            axios.get("https://activities-alset-aef528d2fd94.herokuapp.com/home/instructors").then((response) => {
                if (response.data !== null) {
                    Object.entries(response.data).map((data) => {
                        axios.post("https://activities-alset-aef528d2fd94.herokuapp.com/home", { UserId: parseInt(data[1].id) }).then((response) => {
                            if (response.data != null) {
                                const final = response.data
                                setListOfActivitiesInstructor((prevValues) => ({ ...prevValues, [data[1].id]: final }))
                                Object.entries(response.data).map((data) => {
                                    if (data[1].ActivityOneId) {
                                        axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/activityone/byId/${parseInt(data[1].ActivityOneId)}`).then((response) => {
                                            setActivityTitleInstructor((prevValues) => ({ ...prevValues, [data[1].ActivityOneId]: response.data.transcript_source_id }))
                                            setActivityDescriptionInstructor((prevValues) => ({ ...prevValues, [data[1].ActivityOneId]: response.data.activity_description }))
                                        })
                                    }
                                })
                            }
                        })
                    })
                }
            })
        }

        // gets a list of activities created by the user
        const UserId = sessionStorage.getItem("UserId")
        axios.post("https://activities-alset-aef528d2fd94.herokuapp.com/home", { UserId: UserId }).then((response) => {
            setListOfActivities(response.data);
            Object.entries(response.data).map((data) => {
                if (data[1].ActivityOneId) {
                    axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/activityone/byId/${parseInt(data[1].ActivityOneId)}`).then((response) => {
                        if (sessionStorage.getItem("Occupation") === "Instructor") {
                            let transcriptText = ''
                            Object.entries(response.data.content).map(([key, value]) => {
                                if (value.questioner_tag !== undefined) {
                                    if (transcriptText === '') {
                                        transcriptText = transcriptText + value.questioner_tag + ': ' + value.question_text
                                    } else {
                                        transcriptText = transcriptText + '\n\n' + value.questioner_tag + ': ' + value.question_text
                                    }
                                } else {
                                    transcriptText = transcriptText + '\n\n' + value.response_tag + ': '
                                    Object.entries(value.response_text).map(([key2, value2]) => {
                                        transcriptText = transcriptText + value2.text
                                    })
                                }
                            })
                            setTranscript((prevValues) => ({ ...prevValues, [data[1].ActivityOneId]: transcriptText }))
                        }
                        setActivityTitle((prevValues) => ({ ...prevValues, [data[1].ActivityOneId]: response.data.transcript_source_id }))
                        setActivityDescription((prevValues) => ({ ...prevValues, [data[1].ActivityOneId]: response.data.activity_description }))
                        setSwitchValues((prevValues) => ({ ...prevValues, [data[1].ActivityOneId]: response.data.transcriptEditable }))
                        setActivityLabel((prevValues) => ({ ...prevValues, [1 + data[1].ActivityOneId.toString()]: response.data.label }))
                        if (response.data.instruction) {
                            setActivityInstruction((prevValues) => ({ ...prevValues, [1 + data[1].ActivityOneId.toString()]: response.data.instruction }))
                        } else {
                            setActivityInstruction((prevValues) => ({ ...prevValues, [1 + data[1].ActivityOneId.toString()]: 'Use the text boxes below to provide the details of your interview transcript. After you fill in the boxes, click the Preview button to see how the transcript looks before proceeding to the next activity. If you would like to make any changes you can do so by editing the transcript text directly. Click the Submit button when you are satisfied with the look of your interview transcript. The final version of your transcript will be used in the next activity.' }))
                        }
                    })
                }
                if (data[1].ActivityTwoId && sessionStorage.getItem("Occupation") === "Instructor") {
                    axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/activitytwo/byId/${parseInt(data[1].ActivityTwoId)}`).then((response) => {
                        setPredefinedHighlighting((prevValues) => ({ ...prevValues, [data[1].ActivityTwoId]: response.data.predefinedHighlighting }))
                        setActivityLabel((prevValues) => ({ ...prevValues, [2 + data[1].ActivityTwoId.toString()]: response.data.label }))
                    if (response.data.instruction) {
                        setActivityInstruction((prevValues) => ({ ...prevValues, [2 + data[1].ActivityTwoId.toString()]: response.data.instruction }))
                    } else {
                        setActivityInstruction((prevValues) => ({ ...prevValues, [2 + data[1].ActivityTwoId.toString()]: `Read through the transcript and click on sentences from the <strong>interviewee</strong> that you think provide insights or convey important information. Clicking a sentence will highlight it in yellow. Clicking a highlighted sentence again will unhighlight it. When you are satisfied with your sentence selections, click the Submit button to continue to the next activity. Your choices of which sentences to highlight will be carried forward to the next activity.` }))
                    }
                    })
                    
                    
                }
                if (data[1].ActivityThreeId && sessionStorage.getItem("Occupation") === "Instructor") {
                    axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/activitythree/byId/${parseInt(data[1].ActivityThreeId)}`).then((response) => {
                        setMLModel((prevValues) => ({ ...prevValues, [data[1].ActivityThreeId]: response.data.MLModel }))
                        setAllowMLModel((prevValues) => ({ ...prevValues, [data[1].ActivityThreeId]: response.data.AllowMLModel }))
                        setPredefinedMLSelection((prevValues) => ({ ...prevValues, [data[1].ActivityThreeId]: response.data.predefinedMLSelection }))
                    })
                }
                if (data[1].ActivityFiveId && sessionStorage.getItem("Occupation") === "Instructor") {
                    axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/activityfive/byId/${parseInt(data[1].ActivityFiveId)}`).then((response) => {
                        setMLClusters((prevValues) => ({ ...prevValues, [data[1].ActivityFiveId]: response.data.MLClusters }))
                    })
                }
            })
        })

    }, [])

    // handles the change in state for transcriptEditable
    const handleSwitchChange = (activityId) => {
        setSwitchValues((prevValues) => ({
            ...prevValues,
            [activityId]: !prevValues[activityId],
        }));
    };

    // handles the change in state for predefinedHighlighting
    const handleSwitchChangeHighlighting = (activityId) => {
        setPredefinedHighlighting((prevValues) => ({
            ...prevValues,
            [activityId]: !prevValues[activityId],
        }));
    };

    // creates a copy of the template
    const newActivity = async (data) => {
        const UserId = sessionStorage.getItem("UserId")

        if (data.ActivityOneId) {
            const response = await axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/activityone/byId/${data.ActivityOneId}`)
            const ActivityOneData = response.data
            delete ActivityOneData['id']
            delete ActivityOneData['createdAt']
            delete ActivityOneData['updatedAt']

            if (ActivityOneData !== null) {
                let data = { id: sessionStorage.getItem("UserId"), content: ActivityOneData }
                const ActivityOneIdResponse = await axios.post("https://activities-alset-aef528d2fd94.herokuapp.com/activityone/fromtemplate", data)
                const ActivitiesID = ActivityOneIdResponse.data.ActivitiesId.id
                const ActivityOneId = ActivityOneIdResponse.data.ActivityOneId
                sessionStorage.setItem("ActivitiesId", ActivitiesID)
                sessionStorage.setItem("ActivityOneId", ActivityOneId)
            }
        }

        if (data.ActivityTwoId) {
            const response2 = await axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/activitytwo/byId/${data.ActivityTwoId}`)
            const ActivityTwoData = response2.data
            delete ActivityTwoData['id']
            delete ActivityTwoData['createdAt']
            delete ActivityTwoData['updatedAt']

            if (ActivityTwoData !== null) {
                let data = { id: sessionStorage.getItem("ActivitiesId"), content: ActivityTwoData }
                const ActivityTwoIdResponse = await axios.post("https://activities-alset-aef528d2fd94.herokuapp.com/activitytwo", data)
                const ActivityTwoId = ActivityTwoIdResponse.data.id;
                sessionStorage.setItem("ActivityTwoId", ActivityTwoId)
            }
        }

        if (data.ActivityThreeId) {
            const response3 = await axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/activitythree/byId/${data.ActivityThreeId}`)
            const ActivityThreeData = response3.data
            delete ActivityThreeData['id']
            delete ActivityThreeData['createdAt']
            delete ActivityThreeData['updatedAt']

            if (ActivityThreeData !== null) {
                let data = { id: sessionStorage.getItem("ActivitiesId"), content: ActivityThreeData }
                const ActivityThreeIdResponse = await axios.post("https://activities-alset-aef528d2fd94.herokuapp.com/activitythree", data)
                const ActivityThreeId = ActivityThreeIdResponse.data.id;
                sessionStorage.setItem("ActivityThreeId", ActivityThreeId)
            }
        }

        if (data.ActivityFourId) {
            const response4 = await axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/activityfour/byId/${data.ActivityFourId}`)
            const ActivityFourData = response4.data
            delete ActivityFourData['id']
            delete ActivityFourData['createdAt']
            delete ActivityFourData['updatedAt']

            if (ActivityFourData !== null) {
                let data = { id: sessionStorage.getItem("ActivitiesId"), content: ActivityFourData }
                const ActivityFourIdResponse = await axios.post("https://activities-alset-aef528d2fd94.herokuapp.com/activityfour", data)
                const ActivityFourId = ActivityFourIdResponse.data.id;
                sessionStorage.setItem("ActivityFourId", ActivityFourId)
            }
        }

        if (data.ActivityFiveId) {
            const response5 = await axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/activityfive/byId/${data.ActivityFiveId}`)
            const ActivityFiveData = response5.data
            delete ActivityFiveData['id']
            delete ActivityFiveData['createdAt']
            delete ActivityFiveData['updatedAt']

            if (ActivityFiveData !== null) {
                let data = { id: sessionStorage.getItem("ActivitiesId"), content: ActivityFiveData }
                const ActivityFiveIdResponse = await axios.post("https://activities-alset-aef528d2fd94.herokuapp.com/activityfive", data)
                const ActivityFiveId = ActivityFiveIdResponse.data.id;
                sessionStorage.setItem("ActivityFiveId", ActivityFiveId)
            }
        }

        if (data.ActivitySixId) {
            const response6 = await axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/activitysix/byId/${data.ActivitySixId}`)
            const ActivitySixData = response6.data
            delete ActivitySixData['id']
            delete ActivitySixData['createdAt']
            delete ActivitySixData['updatedAt']

            if (ActivitySixData !== null) {
                let data = { id: sessionStorage.getItem("ActivitiesId"), content: ActivitySixData }
                const ActivitySixIdResponse = await axios.post("https://activities-alset-aef528d2fd94.herokuapp.com/activitysix", data)
                const ActivitySixId = ActivitySixIdResponse.data.id;
                sessionStorage.setItem("ActivityFourId", ActivitySixId)
            }
        }

        window.location.reload(false)
    }

    // stores all id's of all the activities in sessionStorage
    const storeDetails = (data) => {
        sessionStorage.setItem("ActivityOneId", data[1].ActivityOneId)
        sessionStorage.setItem("ActivityTwoId", data[1].ActivityTwoId)
        sessionStorage.setItem("ActivityThreeId", data[1].ActivityThreeId)
        sessionStorage.setItem("ActivityFourId", data[1].ActivityFourId)
        sessionStorage.setItem("ActivityFiveId", data[1].ActivityFiveId)
        sessionStorage.setItem("ActivitySixId", data[1].ActivitySixId)
    }

    // stores all id's of all the activities in sessionStorage
    const storeDetailsStudents = (data) => {
        sessionStorage.setItem("ActivityOneId", data.ActivityOneId)
        sessionStorage.setItem("ActivityTwoId", data.ActivityTwoId)
        sessionStorage.setItem("ActivityThreeId", data.ActivityThreeId)
        sessionStorage.setItem("ActivityFourId", data.ActivityFourId)
        sessionStorage.setItem("ActivityFiveId", data.ActivityFiveId)
        sessionStorage.setItem("ActivitySixId", data.ActivitySixId)
    }

    // removes all id's of all the activities in sessionStorage
    const removeDetails = () => {
        sessionStorage.removeItem("ActivityOneId")
        sessionStorage.removeItem("ActivityTwoId")
        sessionStorage.removeItem("ActivityThreeId")
        sessionStorage.removeItem("ActivityFourId")
        sessionStorage.removeItem("ActivityFiveId")
        sessionStorage.removeItem("ActivitySixId")
    }

    // updates instructor configurations 
    const handleChanges = (data) => {
        const activityId = data[1].id
        const activityOneId = data[1].ActivityOneId
        const activityTwoId = data[1].ActivityTwoId
        const activityThreeId = data[1].ActivityThreeId
        const activityFiveId = data[1].ActivityFiveId
        if (activityOneId) {
            axios.post(`https://activities-alset-aef528d2fd94.herokuapp.com/activityone/home/${activityOneId}`, { transcriptEditable: switchValues[data[1].ActivityOneId] })
        } else {
            axios.post("https://activities-alset-aef528d2fd94.herokuapp.com/activityone", { transcriptEditable: switchValues[data[1].ActivityOneId] })
        }

        if (activityTwoId) {
            axios.post(`https://activities-alset-aef528d2fd94.herokuapp.com/activitytwo/home/${activityTwoId}`, { predefinedHighlighting: predefinedHighlighting[data[1].ActivityTwoId] })
        } else {
            axios.post('https://activities-alset-aef528d2fd94.herokuapp.com/activitytwo/', { id: activityId, content: { predefinedHighlighting: predefinedHighlighting[data[1].ActivityTwoId] } })
        }

        if (activityThreeId) {
            axios.post(`https://activities-alset-aef528d2fd94.herokuapp.com/activitythree/home/${activityThreeId}`, { MLModel: MLModel[data[1].ActivityThreeId], AllowMLModel: AllowMLModel[data[1].ActivityThreeId], predefinedMLSelection: predefinedMLSelection[data[1].ActivityThreeId] })
        } else {
            axios.post('https://activities-alset-aef528d2fd94.herokuapp.com/activitythree', { id: activityId, content: { MLModel: MLModel[data[1].ActivityThreeId], AllowMLModel: AllowMLModel[data[1].ActivityThreeId], predefinedMLSelection: predefinedMLSelection[data[1].ActivityThreeId] } })
        }

        if (activityFiveId) {
            axios.post(`https://activities-alset-aef528d2fd94.herokuapp.com/activityfive/home/${activityFiveId}`, { MLClusters: MLClusters[data[1].ActivityFiveId] })
        } else {
            axios.post(`https://activities-alset-aef528d2fd94.herokuapp.com/activityfive/`, { id: activityId, content: { MLClusters: MLClusters[data[1].ActivityFiveId] } })
        }
    }

    // redirectes the user depending on whether activity one is predefined when they start the activity
    const startActivity = (data) => {
        removeDetails()
        storeDetails(data)
        if (switchValues[data[1].ActivityOneId]) {
            navigate(`/activitytwo/${data[1].ActivityTwoId}`)
        } else {
            navigate(`/activityone/${data[1].ActivityOneId}`)
        }
    }

    // displayes different sets of activities created by instructors and students
    const displayActivities = () => {
        let ActivityCount = 0
        let templateCount = 0
        let StudentActivityCount = 0
        return (
            <Box>
                <Typography variant='h5'>Username: {sessionStorage.getItem("Username")}</Typography>
                <Typography variant='h5'>Occupation: {sessionStorage.getItem("Occupation")}</Typography>
                <Divider style={{ marginTop: 20, marginBottom: 20 }} />
                <Button style={{ marginTop: 10, marginBottom: 10 }} fullWidth variant='outlined' onClick={() => { removeDetails(); navigate("/activityone") }}>Create a new activity</Button>
                <Typography variant='h5' style={{ marginTop: 10 }}>Your Activities</Typography>
                {Object.entries(listOfActivities).map((data) => {
                    { ActivityCount++ }
                    return (
                        <Accordion style={{ marginTop: 10, marginBottom: 10 }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />} id={data[1].id}><Typography>{activityTitle[data[1].ActivityOneId]}</Typography></AccordionSummary>
                            <AccordionDetails>
                                <div style={{ marginTop: 0, marginBottom: 20 }}>
                                    <Typography>Activity Description: {activityDescription[data[1].ActivityOneId]}</Typography>
                                </div>
                                <div>
                                    {instructor && <Typography style={{ marginBottom: 10 }} variant='h6'>Activity 1</Typography>}
                                    <Button onClick={() => { sessionStorage.setItem("ActivitiesId", data[1].id); storeDetails(data); navigate(`/activityone/${data[1].ActivityOneId}`) }} fullWidth style={{ backgroundColor: data[1].ActivityOneId ? "green" : "red" }} variant='contained'>
                                        Activity 1
                                    </Button>
                                    <div style={{ display: "flex", direction: "row", marginTop:10 }}>
                                        <Typography>Label:</Typography>&nbsp;&nbsp;
                                        <Typography dangerouslySetInnerHTML={{ __html: activityLabel[1 + data[1].ActivityOneId.toString()] }} contentEditable="true" style={{ minHeight: 1, borderRight: "solid rgba(0,0,0,0) 1px", outline: "none" }} id="activity-one-label"></Typography>
                                    </div>
                                    <Typography style={{marginTop:10}}>Instructions: </Typography>
                                    <Typography id="activity-one-instruction" dangerouslySetInnerHTML={{ __html: activityInstruction[1 + data[1].ActivityOneId.toString()] }} contentEditable={instructor && true} style={{minHeight:1,borderRight:"solid rgba(0,0,0,0) 1px",outline: "none"}}></Typography>
                                    <Divider style={{marginTop:10}}/>
                                    {instructor && <FormControlLabel style={{ marginTop: 10, marginBottom: !switchValues[data[1].ActivityOneId] ? 10 : 0 }} control={<Switch checked={switchValues[data[1].ActivityOneId] || false} onChange={() => handleSwitchChange(data[1].ActivityOneId)} />} label="Predefined Interview Text" />}
                                    {instructor && <Typography style={{ marginBottom: 10 }}>In order to make changes in the transcript, please go to Activity 1 and make the relevant changes.</Typography>}
                                    {instructor && switchValues[data[1].ActivityOneId] && <TextField helperText={helperText[data[1].ActivityOneId] || false} error={transcriptError[data[1].ActivityOneId] || false} margin='normal' value={transcript[data[1].ActivityOneId] || ""} rows={15} fullWidth multiline variant='outlined' label="Transcript" onChange={(e) => setTranscript((prevValues) => ({ ...prevValues, [data[1].ActivityOneId]: e.target.value }))}></TextField>}
                                </div>
                                <div>
                                    {instructor && <Typography style={{ marginBottom: 10 }} variant='h6'>Activity 2</Typography>}
                                    <Button onClick={() => { sessionStorage.setItem("ActivitiesId", data[1].id); storeDetails(data); navigate(`/activitytwo/${data[1].ActivityTwoId}`) }} fullWidth style={{ backgroundColor: data[1].ActivityTwoId ? "green" : "red" }} variant='contained'>
                                        Activity 2
                                    </Button>
                                    <div style={{ display: "flex", direction: "row", marginTop:10 }}>
                                        <Typography>Label:</Typography>&nbsp;&nbsp;
                                        <Typography dangerouslySetInnerHTML={{ __html:activityLabel[2 + data[1].ActivityTwoId.toString()] }} contentEditable="true" style={{ minHeight: 1, borderRight: "solid rgba(0,0,0,0) 1px", outline: "none" }} id="activity-one-label"></Typography>
                                    </div>
                                    <Typography style={{marginTop:10}}>Instructions: </Typography>
                                    <Typography id="activity-one-instruction" dangerouslySetInnerHTML={{ __html: activityInstruction[2 + data[1].ActivityTwoId.toString()] }} contentEditable={instructor && true} style={{minHeight:1,borderRight:"solid rgba(0,0,0,0) 1px",outline: "none"}}></Typography>
                                    <Divider style={{marginTop:10}}/>
                                    {instructor && <FormControlLabel style={{ marginTop: 10, marginBottom: 10 }} control={<Switch checked={predefinedHighlighting[data[1].ActivityTwoId] || false} onChange={() => handleSwitchChangeHighlighting(data[1].ActivityTwoId)} />} label="Use Predefined Interview Highlighting" />}
                                </div>
                                <div>
                                    {!instructor && <Button onClick={() => { sessionStorage.setItem("ActivitiesId", data[1].id); storeDetails(data); navigate(`/activitythree/${data[1].ActivityThreeId}`) }} fullWidth style={{ backgroundColor: data[1].ActivityThreeId ? "green" : "red" }} variant='contained'>
                                        Activity 3
                                    </Button>}
                                    {instructor && <Typography variant='h6'>Activity 3</Typography>}
                                    {instructor && <>
                                        <Typography style={{ marginTop: 10, marginBottom: 10 }}>If no machine learning model is selected, machine learning selections will not be made.</Typography>
                                        <Typography>Selected machine learning model: {MLModel[data[1].ActivityThreeId]}</Typography>
                                        <Typography style={{ marginTop: 10, marginBottom: 10 }}>Please select another machine learning model below if you would like to change.</Typography>
                                        <div style={{ display: "flex", width: "100%" }}>
                                            <div style={{ width: "50%" }}>
                                                <Select value={MLModel[data[1].ActivityThreeId]} onChange={(e) => { setMLModel((prevValues) => ({ ...prevValues, [data[1].ActivityThreeId]: e.target.value })) }} fullWidth>
                                                    <MenuItem value={"None"}>None</MenuItem>
                                                    <MenuItem value={"Model1"}>Model 1</MenuItem>
                                                    <MenuItem value={"Model2"}>Model 2</MenuItem>
                                                    <MenuItem value={"Model3"}>Model 3</MenuItem>
                                                    <MenuItem value={"Model4"}>Model 4</MenuItem>
                                                </Select>
                                            </div>
                                        </div>
                                        <div style={{ width: "100%" }}>
                                            <FormControlLabel style={{ marginTop: 10 }} control={<Switch checked={AllowMLModel[data[1].ActivityThreeId]} onChange={() => { setAllowMLModel((prevValues) => ({ ...prevValues, [data[1].ActivityThreeId]: !prevValues[data[1].ActivityThreeId], })); }} />} label="Allow Machine Learning Sentence Selections" />
                                        </div>
                                        <div style={{ width: "100%" }}>
                                            <FormControlLabel style={{ marginTop: 10 }} control={<Switch checked={predefinedMLSelection[data[1].ActivityThreeId]} onChange={() => { setPredefinedMLSelection((prevValues) => ({ ...prevValues, [data[1].ActivityThreeId]: !prevValues[data[1].ActivityThreeId], })); }} />} label="Predefined Machine Learning Selection" />
                                        </div></>}
                                </div>
                                <div>
                                    {instructor && <Typography variant='h6'>Activity 4</Typography>}
                                    {!instructor && <Button onClick={() => { sessionStorage.setItem("ActivitiesId", data[1].id); storeDetails(data); navigate(`/activityfour/${data[1].ActivityFourId}`) }} fullWidth style={{ backgroundColor: data[1].ActivityFourId ? "green" : "red" }} variant='contained'>
                                        Activity 4
                                    </Button>}
                                </div>
                                <div>
                                    {instructor && <Typography variant='h6'>Activity 5</Typography>}
                                    {!instructor && <Button onClick={() => { sessionStorage.setItem("ActivitiesId", data[1].id); storeDetails(data); navigate(`/activityfive/${data[1].ActivityFiveId}`) }} fullWidth style={{ backgroundColor: data[1].ActivityFiveId ? "green" : "red" }} variant='contained'>
                                        Activity 5
                                    </Button>}
                                    {instructor && <FormControlLabel style={{ marginTop: 10, marginBottom: 10 }} control={<Switch checked={MLClusters[data[1].ActivityFiveId]} onChange={() => { setMLClusters((prevValues) => ({ ...prevValues, [data[1].ActivityFiveId]: !prevValues[data[1].ActivityFiveId], })); }} />} label="Allow Machine Learning Clustering" />}
                                </div>
                                <div>
                                    {instructor && <Typography variant='h6'>Activity 6</Typography>}
                                    {!instructor && <Button onClick={() => { sessionStorage.setItem("ActivitiesId", data[1].id); storeDetails(data); navigate(`/activitysix/${data[1].ActivitySixId}`) }} fullWidth style={{ backgroundColor: data[1].ActivitySixId ? "green" : "red" }} variant='contained'>
                                        Activity 6
                                    </Button>}
                                </div>
                                {!instructor && <Button fullWidth style={{ marginTop: 10 }} onClick={() => { startActivity(data) }} variant='contained'>Start Activity</Button>}
                                {instructor && <Button fullWidth style={{ marginTop: 10 }} onClick={() => handleChanges(data)} variant='contained'>Save Changes</Button>}
                            </AccordionDetails>
                        </Accordion>
                    )
                })}
                {!instructor && <Divider style={{ marginTop: 20, marginBottom: 20 }} />}
                {!instructor && <Typography variant='h5' style={{ marginTop: 10 }}>Templates</Typography>}
                {Object.entries(listOfActivitiesInstructor).flatMap(([key, array]) => {
                    return array.map(data => {
                        templateCount++
                        if (data != null) {
                            return (
                                <Accordion style={{ marginTop: 10, marginBottom: 10 }}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />} id={data.id}><Typography>{activityTitleInstructor[data.ActivityOneId]}</Typography></AccordionSummary>
                                    <AccordionDetails>
                                        <div style={{ marginTop: 0, marginBottom: 5 }}>
                                            <Typography>Activity Description: {activityDescriptionInstructor[data.ActivityOneId]}</Typography>
                                        </div>
                                        <Button onClick={() => { newActivity(data) }} fullWidth style={{ marginTop: 10 }} variant='contained'>Copy Template</Button>
                                    </AccordionDetails>
                                </Accordion>
                            )
                        }
                    })
                })}

                {instructor && <Divider style={{ marginTop: 20, marginBottom: 20 }} />}
                {instructor && <Typography variant='h5' style={{ marginTop: 10 }}>Student Activities</Typography>}
                {Object.entries(listOfActivitiesStudents).flatMap(([key, array]) => {
                    return array.map(data => {
                        StudentActivityCount++
                        if (data != null) {
                            return (
                                <Accordion style={{ marginTop: 10, marginBottom: 10 }}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />} id={data.id}><Typography>{activityTitleStudent[data.ActivityOneId]}</Typography></AccordionSummary>
                                    <AccordionDetails>
                                        <div style={{ marginTop: 0, marginBottom: 10 }}>
                                            <Typography>Activity Description: {activityDescriptionStudent[data.ActivityOneId]}</Typography>
                                        </div>
                                        <div>
                                            <Button onClick={() => { sessionStorage.setItem("ActivitiesId", data.id); storeDetailsStudents(data); navigate(`/activityone/${data.ActivityOneId}`) }} style={{ backgroundColor: data.ActivityOneId ? "green" : "red" }} fullWidth variant='contained'>
                                                Activity 1
                                            </Button>
                                        </div>
                                        <div>
                                            <Button onClick={() => { sessionStorage.setItem("ActivitiesId", data.id); storeDetailsStudents(data); navigate(`/activitytwo/${data.ActivityTwoId}`) }} style={{ backgroundColor: data.ActivityTwoId ? "green" : "red" }} fullWidth variant='contained'>
                                                Activity 2
                                            </Button>
                                        </div>
                                        <div>
                                            <Button onClick={() => { sessionStorage.setItem("ActivitiesId", data.id); storeDetailsStudents(data); navigate(`/activitythree/${data.ActivityThreeId}`) }} style={{ backgroundColor: data.ActivityThreeId ? "green" : "red" }} fullWidth variant='contained'>
                                                Activity 3
                                            </Button>
                                        </div>
                                        <div>
                                            <Button onClick={() => { sessionStorage.setItem("ActivitiesId", data.id); storeDetailsStudents(data); navigate(`/activityfour/${data.ActivityFourId}`) }} style={{ backgroundColor: data.ActivityFourId ? "green" : "red" }} fullWidth variant='contained'>
                                                Activity 4
                                            </Button>
                                        </div>
                                        <div>
                                            <Button onClick={() => { sessionStorage.setItem("ActivitiesId", data.id); storeDetailsStudents(data); navigate(`/activityfive/${data.ActivityFiveId}`) }} style={{ backgroundColor: data.ActivityFiveId ? "green" : "red" }} fullWidth variant='contained'>
                                                Activity 5
                                            </Button>
                                        </div>
                                        <div>
                                            <Button onClick={() => { sessionStorage.setItem("ActivitiesId", data.id); storeDetailsStudents(data); navigate(`/activitysix/${data.ActivitySixId}`) }} style={{ backgroundColor: data.ActivitySixId ? "green" : "red" }} fullWidth variant='contained'>
                                                Activity 6
                                            </Button>
                                        </div>
                                    </AccordionDetails>
                                </Accordion>
                            )

                        }

                    })
                })
                }
            </Box>
        )
    }


    return (
        <Container style={{ marginTop: 50 }}>
            <div>
                {!sessionStorage.getItem("Username") && <Typography variant='h5'>Please login/register to access/create activities</Typography>}
                {sessionStorage.getItem("Username") && displayActivities()}
            </div>
        </Container>
    )
}

export default Home