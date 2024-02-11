import { Accordion, AccordionDetails, AccordionSummary, Button, Container, Divider, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import axios from 'axios'
import { useNavigate, useParams } from "react-router-dom"


const Act6 = () => {

    const [clustData,setClustData] = useState({})
    const {id} = useParams()
    const navigate = useNavigate()


    useEffect(()=>{
        let data = {}
        //let clusteredDataActivity6 = JSON.parse(localStorage.getItem("clusteredDataActivity6"))

        let clusteredData = JSON.parse(localStorage.getItem("clusteredDataActivity5"))

        if (id === "null") {
            alert("Please go back to the previous activity and submit it to continue.")
        }
        
        if (id) {
            axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/activitysix/byId/${id}`).then((response)=>{
                if (response.data !== null) {
                    setClustData(response.data.content)
                } 
            })
        } else {
            axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/activityfive/byId/${sessionStorage.getItem("ActivityFiveId")}`).then((response)=>{
                if (response.data !== null) {

                    // Object.entries(response.data.content).map(([key,value])=>{
                    //     console.log(value)
                    //     if (response.data.content[value.class] === undefined && value.removed !== true) {
                    //         data[value.class] = {content:{},insights:{},needs:{}}
                    //     }
                    //     if (value.removed !== true) {
                    //         data[value.class].content[Object.keys(data[value.class].content).length] = value
                    //     }
                    // })

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
    
        // axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/activitysix/byId/${id}`).then((response)=>{
        //     if (response.data !== null) {
        //         setClustData(response.data.content)
        //     } else {
        //         Object.entries(clusteredData).map(([key,value])=>{
        //             if (data[value.class] === undefined && value.removed !== true) {
        //                 data[value.class] = {content:{},insights:{},needs:{}}
        //             }
        //             if (value.removed !== true) {
        //                 data[value.class].content[Object.keys(data[value.class].content).length] = value
        //             }
        //         })
        //         setClustData(data)
        //     }
        // })

        //console.log(clusteredData)
        // if (clusteredDataActivity6 === null) {
        //     Object.entries(clusteredData).map(([key,value])=>{
        //         if (data[value.class] === undefined && value.removed !== true) {
        //             data[value.class] = {content:{},insights:{},needs:{}}
        //         }
        //         if (value.removed !== true) {
        //             data[value.class].content[Object.keys(data[value.class].content).length] = value
        //         }
        //     })
        //     setClustData(data)
        // } else {
        //     setClustData(clusteredDataActivity6)
        // }
        console.log(clustData)
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
        // console.log(data)
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
            // console.log(value)
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
        finalData.UserId = sessionStorage.getItem("UserId")
        finalData.ActivityFiveId = sessionStorage.getItem("ActivityFiveId")

        let data = {id:sessionStorage.getItem("ActivitiesId"),content:finalData}


        if (id) {
            await axios.post(`https://activities-alset-aef528d2fd94.herokuapp.com/activitysix/byId/${id}`, data)
        } else {
            await axios.post("https://activities-alset-aef528d2fd94.herokuapp.com/activitysix", data).then((response) => {
                const ActivitySixId = response.data.id;
                sessionStorage.setItem("ActivitySixId",ActivitySixId)
            })
        }

        navigate('/home')

        

        // axios.post("https://activities-alset-aef528d2fd94.herokuapp.com/activitysix", data).then((response) => {
        //    // const ActivitySixId = response.data.id;
        //    // sessionStorage.setItem("ActivitySixId",ActivitySixId)
        // })

        // localStorage.setItem("clusteredDataActivity6",JSON.stringify(clustData));
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
            <h2>Activity 6</h2>
            <form onSubmit={handleSubmit}>
                <Typography>Instructions: </Typography>
                <Typography>The sentences and cluster labels you submitted for the previous activity have been arranged in the space below. For each cluster, add any number of insights that you think emerge from the selected sentences. After surfacing the insights, add a set of needs that relate to those insights one at a time. Identifying the insights and needs should be helpful when designing your prototype.</Typography>
                <br/>
                <Typography>When you are satisfied with your listed insights and needs, click the Submit button to complete this stage of the design thinking process. You can come back and make changes to your submissions whenever you like.</Typography>
                <Button onClick={()=>{localStorage.removeItem("clusteredDataActivity6");window.location.reload(false);}} sx={{marginTop:3}} fullWidth variant="outlined" disabled>Reset</Button>
                <div style={{ display: 'flex', width: '100%', justifyContent: 'space-around', marginTop: 20, marginBottom: 10}}>
                    <Typography>Cluster</Typography>
                    <Typography>Insights</Typography>
                    <Typography>Needs</Typography>
                </div>
                <Divider></Divider>
                {console.log(clustData)}
                {Object.entries(clustData).map(([key,value])=>{
                    // console.log(checkLabel(value).includes(true))
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