import { Accordion, AccordionDetails, AccordionSummary, Button, Container, Divider, FormControlLabel, Switch, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import axios from 'axios'
import { useNavigate, useParams } from "react-router-dom"


const Act6 = () => {

    const [clustData,setClustData] = useState({})
    const [instructor, setInstructor] = useState(false)
    const [label, setLabel] = useState('Custom Text')
    const [newChain,setNewChain] = useState(false)
    const [logs,setLogs] = useState({})
    const [instruction,setInstruction] = useState(`
    <Typography>The sentences and cluster labels you submitted for the previous activity have been arranged in the space below. For each cluster, add any number of insights that you think emerge from the selected sentences. After surfacing the insights, add a set of needs that relate to those insights one at a time. Identifying the insights and needs should be helpful when designing your prototype.</Typography>
    <br/>
    <Typography>When you are satisfied with your listed insights and needs, click the Submit button to complete this stage of the design thinking process. You can come back and make changes to your submissions whenever you like.</Typography>`)
    const {id} = useParams()
    const navigate = useNavigate()


    useEffect(()=>{
        let data = {}

        if (sessionStorage.getItem("Occupation") == "Instructor") {
            setInstructor(true)
        }

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
        
        if (id) {
            axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/activitysix/byId/${id}`).then((response)=>{
                setLabel(response.data.label)
                setInstruction(response.data.instruction)    
                if (response.data.content !== null) {
                    setClustData(response.data.content)
                } else {
                    axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/activityfive/byId/${sessionStorage.getItem("ActivityFiveId")}`).then((response)=>{
                        if (response.data !== null) {
                            Object.entries(response.data.content).map(([key, value]) => {
                                if (value.class !== undefined && value.removed !== true) {
                                    if (data[value.class] === undefined) {
                                        data[value.class] = { content: {}, insights: {}, needs: {} };
                                    }
                                    data[value.class].content[Object.keys(data[value.class].content).length] = value;
                                }
                            })
        
                            setClustData(data)
                        } 
                    })
                }
            })
        } else {
            axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/activityfive/byId/${sessionStorage.getItem("ActivityFiveId")}`).then((response)=>{
                if (response.data !== null) {
                    Object.entries(response.data.content).map(([key, value]) => {
                        if (value.class !== undefined && value.removed !== true) {
                            if (data[value.class] === undefined) {
                                data[value.class] = { content: {}, insights: {}, needs: {} };
                            }
                            data[value.class].content[Object.keys(data[value.class].content).length] = value;
                        }
                    })

                    setClustData(data)
                } else {
                    alert("Before progressing to Activity 6, please complete Activity 5.")
                }
            })
        }
    },[])


    const getLabel = (data) => {
        return Object.entries(data.content).map(([key,value])=>{
            if (value.type === 'label') {
                return <>{value.text}</>
            }
        })
    }

    const checkLabel = (data) => {
        return Object.entries(data.content).map(([key,value])=>{
            if (value.type === 'label') {
                return true 
            }
        })
    }

    const getContent = (data) => {
        return Object.entries(data.content).map(([key,value])=>{
            if (value.type !== 'label') {
                return (
                    <div style={{borderRadius: 15, border: "1px solid black",padding:10, margin: 10}}>
                        {value.text}
                    </div>
                )                                                                                                                                                                                                                                                                                           
            }
        })
    }

    const deleteInsight = (baseKey, key) => {
        setClustData(prevData => {
            const newData = JSON.parse(JSON.stringify(prevData));
            delete newData[baseKey].insights[key];
            return newData;
        });
    }

    const deleteNeeds = (baseKey, key) => {
        setClustData(prevData => {
            const newData = JSON.parse(JSON.stringify(prevData));
            delete newData[baseKey].needs[key];
            return newData;
        });
    }

    const getInsight = (data,baseKey) => {
        return Object.entries(data.insights).map(([key,value])=>{
            console.log(value)
                return (
                    <div style={{borderRadius: 15, border: "1px solid black",padding:10, margin: 10, backgroundColor:'lightyellow'}}>
                        <Typography onBlur={()=>{let element = document.querySelector(`[Insight-id="${baseKey.toString() + key.toString()}"]`); (element.innerHTML === '' || element.innerHTML === `<br>`) ? deleteInsight(baseKey,key) : console.log(element.innerHTML)}} Insight-id={baseKey.toString() + key.toString()} contenteditable="true">{value}</Typography>
                    </div>
                )                                                                                                                                                                                                                                                                                           
        })
    }

    const getNeed = (data,baseKey) => {
        return Object.entries(data.needs).map(([key,value])=>{
                return (
                    <div style={{backgroundColor:'lightgreen',borderRadius: 15, border: "1px solid black",padding:10, margin: 10}}>
                        <Typography onBlur={()=>{let element = document.querySelector(`[Needs-id="${baseKey.toString() + key.toString()}"]`); (element.innerHTML === '' || element.innerHTML === `<br>`) ? deleteNeeds(baseKey,key) : console.log(element.innerHTML)}} Needs-id={baseKey.toString() + key.toString()} contenteditable="true">{value}</Typography>
                    </div>
                )                                                                                                                                                                                                                                                                                           
        })
    }

    const addInsight = (key) => {
        setClustData(prevData => {
            const newData = JSON.parse(JSON.stringify(prevData));
            newData[key].insights[Object.keys(newData[key].insights).length] = "Edit";
            return newData;
        });
    }

    const addNeed = (key) => {
        setClustData(prevData => {
            const newData = JSON.parse(JSON.stringify(prevData));
            newData[key].needs[Object.keys(newData[key].needs).length] = "Edit";
            return newData;
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        replaceName()
        console.log(clustData)

        if (!id) {
            delete clustData["MLClusters"]
        }

        let finalData = {};
        finalData.content = clustData;
        delete finalData['id']
        finalData.label = document.getElementById("activity-six-label").innerHTML
        finalData.instruction = document.getElementById("activity-six-instruction").innerHTML
        finalData.UserId = sessionStorage.getItem("UserId")
        finalData.ActivityFiveId = sessionStorage.getItem("ActivityFiveId")

        let data = {id:sessionStorage.getItem("ActivitiesId"),content:finalData}

        // if (newChain) {
        //     await axios.post("https://activities-alset-aef528d2fd94.herokuapp.com/activitysix/new-chain", data).then((response) => {
        //         const ActivitiesID = response.data.ActivitiesId.id
        //         const ActivitySixId = response.data.ActivitySixId
        //         sessionStorage.setItem("ActivitiesId", ActivitiesID)
        //         sessionStorage.setItem("ActivitySixId", ActivitySixId)
        //     })
        // } else 
        if (id) {
            await axios.post(`https://activities-alset-aef528d2fd94.herokuapp.com/activitysix/byId/${id}`, data)

            let logsData = logs
            logsData[Object.keys(logs).length] = { DateTime: Date.now(), EventType: "Activity 6 has been updated." }
            if (!instructor) {
                await axios.post(`https://activities-alset-aef528d2fd94.herokuapp.com/studentlog/update/byId/${sessionStorage.getItem("ActivitiesId")}`, logsData)
            } else {
                await axios.post(`https://activities-alset-aef528d2fd94.herokuapp.com/instructorlog/update/byId/${sessionStorage.getItem("ActivitiesId")}`, logsData)
            }            
            
        } else {
            await axios.post("https://activities-alset-aef528d2fd94.herokuapp.com/activitysix", data).then((response) => {
                const ActivitySixId = response.data.id;
                sessionStorage.setItem("ActivitySixId",ActivitySixId)
            })

            let logsData = logs
            logsData[Object.keys(logs).length] = { DateTime: Date.now(), EventType: "Activity 6 has been created." }
            if (!instructor) {
                await axios.post(`https://activities-alset-aef528d2fd94.herokuapp.com/studentlog/update/byId/${sessionStorage.getItem("ActivitiesId")}`, logsData)
            } else {
                await axios.post(`https://activities-alset-aef528d2fd94.herokuapp.com/instructorlog/update/byId/${sessionStorage.getItem("ActivitiesId")}`, logsData)
            }
        }

        navigate('/home')
    }

    const replaceName = () => {
        Object.entries(clustData).map(([key,value])=>{
            Object.entries(value.insights).map(([key2,value2]) => {
                let val = document.querySelector(`[Insight-id="${key.toString() + key2.toString()}"]`).innerHTML
                clustData[key].insights[key2] = val
            })
            Object.entries(value.needs).map(([key2,value2]) => {
                let val = document.querySelector(`[Needs-id="${key.toString() + key2.toString()}"]`).innerHTML
                clustData[key].needs[key2] = val
            })
        })
    }

    return (
        <Container style={{marginTop:20}}>
            <div style={{ display: "flex", direction: "row" }}>
                <h2>Activity 6:</h2>&nbsp;&nbsp;
                <h2 dangerouslySetInnerHTML={{ __html: ` ${label}` }} contentEditable="true" style={{ minHeight: 1, borderRight: "solid rgba(0,0,0,0) 1px", outline: "none" }} id="activity-six-label"></h2>
            </div>
            <form onSubmit={handleSubmit}>
                <Typography>Instructions (Editable by Instructors): </Typography>
                <Typography id="activity-six-instruction" dangerouslySetInnerHTML={{ __html: ` ${instruction}` }} contentEditable={instructor && true} style={{ minHeight: 1, borderRight: "solid rgba(0,0,0,0) 1px", outline: "none" }}></Typography>
                 <Button onClick={()=>{window.location.reload(false);}} sx={{marginTop:3}} fullWidth variant="outlined">Reset</Button>
                 {/* <FormControlLabel style={{marginTop: 10}} control={<Switch checked={newChain} onChange={() => setNewChain((prev) => !prev)} />} label="Create a new chain of activities" /> */}
                <div style={{ display: 'flex', width: '100%', justifyContent: 'space-around', marginTop: 20, marginBottom: 10}}>
                    <Typography>Cluster</Typography>
                    <Typography>Insights</Typography>
                    <Typography>Needs</Typography>
                </div>
                <Divider></Divider>
                {console.log(clustData)}
                {Object.entries(clustData).map(([key,value])=>{
                    if (checkLabel(value).includes(true)) {
                        return (
                            <>
                            <div key={key} style={{display:'flex', with:'100%',justifyContent:'space-around',marginTop:20,marginBottom:20}}>
                                <div style={{width:'100%'}}>
                                    <Accordion>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                        >
                                            <Typography>{getLabel(value)}</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                           {getContent(value)}
                                        </AccordionDetails>
                                    </Accordion>
                                </div>
                                <div style={{width:'100%'}}>
                                    {getInsight(value,key)}
                                    <Button variant="outlined" onClick={()=>addInsight(key)} style={{margin:10}}>Add</Button>
                                </div>
                                <div style={{width:'100%'}}>
                                    {getNeed(value,key)}
                                    <Button variant="outlined" onClick={()=>addNeed(key)} style={{margin:10}}>Add</Button>
                                </div>
                            </div>
                            <Divider/>
                            </>
    
                        )
                    }
                    
                })}
                <Button sx={{marginTop:3,marginBottom:3}} fullWidth type="submit" variant='outlined'>Submit</Button>
            </form>
        </Container>
    )
}

export default Act6