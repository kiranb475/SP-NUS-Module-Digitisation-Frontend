import { Container, TextField, Typography, Box, Button, FormControlLabel, Switch } from "@mui/material"
import { yellow } from "@mui/material/colors";
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios'

const Act2 = () => {
    const [activityMVCContent, setActivityMVCContent] = useState({});
    const [userData, setUserData] = useState({})
    //const [switchValue, setSwitchValue] = useState(false)
    const [transcriptHighlighting, setTranscriptHighlighting] = useState(false)
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

        
        if (id) {
            axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/activitytwo/byId/${id}`).then((response) => {
                //console.log(response)
                if (response.data !== null) {
                    setTranscriptHighlighting(response.data.predefinedHighlighting)
                    setTranscriptHighlighting(response.data.predefinedHighlighting)
                    setUserData(response.data)
                    let activity_mvc_data = {}
                    console.log(response.data.content)
                    for (let i = 1; i < Object.keys(response.data.content).length + 1; i++) {
                        if (response.data.content[i].questioner_tag !== undefined) {
                            activity_mvc_data[i] = { tag: response.data.content[i].questioner_tag, activity_mvc: response.data.content[i].activity_mvc }
                        } else {
                            activity_mvc_data[i] = { tag: response.data.content[i].response_tag, activity_mvc: getActivityMVCInterviewee(response.data.content[i].response_text) }
                        }
                    }
                    setActivityMVCContent(activity_mvc_data)
                }
            })
        } else if (id !== "null") {
            console.log("Activity one id" + sessionStorage.getItem("ActivityOneId"))
            axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/activityone/byId/${sessionStorage.getItem("ActivityOneId")}`).then((response) => {
                if (response.data !== null) {
                    setUserData(response.data)
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
                    alert("Before progressing to Activity 2, please complete Activity 1.")
                }
            })
        } else if (id === "null") {
            alert("Please go back to the previous activity and submit it to continue.")
        }

        // axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/activitytwo/byId/${id}`).then((response)=>{
        //     console.log(response)
        //     if (response.data !== null) {
        //         setUserData(response.data)
        //         let activity_mvc_data = {}
        //         for (let i = 1; i < Object.keys(response.data.content).length + 1; i++){
        //             if (response.data.content[i].questioner_tag !== undefined) {
        //                 activity_mvc_data[i] = {tag: response.data.content[i].questioner_tag, activity_mvc: response.data.content[i].activity_mvc}
        //             } else {
        //                 activity_mvc_data[i] = {tag: response.data.content[i].response_tag, activity_mvc: getActivityMVCInterviewee(response.data.content[i].response_text)}
        //             }
        //         }
        //         setActivityMVCContent(activity_mvc_data)
        //     } else {
        //         axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/activityone/byId/${sessionStorage.getItem("ActivityOneId")}`).then((response)=>{
        //             if (response.data !== null) {
        //                 setUserData(response.data)
        //                 let activity_mvc_data = {}
        //                 for (let i = 1; i < Object.keys(response.data.content).length + 1; i++){
        //                     if (response.data.content[i].questioner_tag !== undefined) {
        //                         activity_mvc_data[i] = {tag: response.data.content[i].questioner_tag, activity_mvc: response.data.content[i].activity_mvc}
        //                     } else {
        //                         activity_mvc_data[i] = {tag: response.data.content[i].response_tag, activity_mvc: getActivityMVCInterviewee(response.data.content[i].response_text)}
        //                     }
        //                 }
        //                 setActivityMVCContent(activity_mvc_data)
        //             } else {
        //                 alert("Before progressing to Activity 2, please complete Activity 1.")
        //             }
        //         })

        // let data = JSON.parse(localStorage.getItem("userData"));
        // console.log('yay')
        // console.log(data)
        // setUserData(data)
        // let activity_mvc_data = {}
        // for (let i = 1; i < Object.keys(data.content).length + 1; i++){
        //  if (data.content[i].questioner_tag !== undefined) {
        //     activity_mvc_data[i] = {tag: data.content[i].questioner_tag, activity_mvc: data.content[i].activity_mvc}
        // } else {
        //     activity_mvc_data[i] = {tag: data.content[i].response_tag, activity_mvc: getActivityMVCInterviewee(data.content[i].response_text)}
        // }
        // setActivityMVCContent(activity_mvc_data)
        //}
        //     }
        // })


        // let data = JSON.parse(localStorage.getItem("userData"));
        // console.log(data)
        // setUserData(data)
        // let activity_mvc_data = {}
        // for (let i = 1; i < Object.keys(data.content).length + 1; i++){
        //     if (data.content[i].questioner_tag !== undefined) {
        //         activity_mvc_data[i] = {tag: data.content[i].questioner_tag, activity_mvc: data.content[i].activity_mvc}
        //     } else {
        //         activity_mvc_data[i] = {tag: data.content[i].response_tag, activity_mvc: getActivityMVCInterviewee(data.content[i].response_text)}
        //     }
        // }
        // setActivityMVCContent(activity_mvc_data)
        // setHtmlContent(htmlContent)
        // setInterviewer(data.content[0].questioner_tag)
        // setInterviewee(data.content[0].response_tag)
    }, [])

    // const displayTranscript = () => {

    //     //const container = document.getElementById('content-container');

    //     if (container) {
    //         container.innerHTML = htmlContent; 
    //     }   
    // }

    const highlightedStyle = {
        backgroundColor: 'yellow',
    };

    const handleClick = (event) => {
        if (!transcriptHighlighting || sessionStorage.getItem("Occupation") === "Instructor") {
            const currentStyle = event.target.style;
            if (currentStyle.backgroundColor === 'yellow') {
                currentStyle.backgroundColor = '';
            } else {
                currentStyle.backgroundColor = highlightedStyle.backgroundColor;
            }
        }
    };

    const displayInterviewee = (data, key) => {
        return Object.entries(data).map(([key2, value]) => (
            <Typography display="inline" onClick={handleClick} dangerouslySetInnerHTML={{ __html: value.html }}></Typography>
        ));
    };

    const getActivityMVC = (value) => {
        const element = document.querySelector(`[id="${value}"]`);
        if (element) {
            const htmlContent = element.outerHTML;
            const backgroundColor = element.style.backgroundColor;
            // const computedStyle = window.getComputedStyle(element);
            // const backgroundColor = computedStyle.backgroundColor;
            //   console.log(backgroundColor)
            // Construct the inline style string with only the background color
            //   const inlineStyles = backgroundColor ? background-color: ${backgroundColor}; : '';
            const inlineStyles = element.getAttribute('style') ? element.getAttribute('style') : 'No inline styles';
            //const inlineStyles = element.getAttribute('style') || 'No inline styles';
            return { html: htmlContent, css: inlineStyles }
        } else {
            console.log('Element not found');
            return undefined
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        let userContent = userData
        // userContent.record_datetime = Date.now()
        Object.entries(userContent.content).map(([key, value]) => {
            if (value.questioner_tag !== undefined) {
                value.activity_mvc = getActivityMVC(key)
            } else {
                Object.entries(value.response_text).map(([key2, value2]) => {
                    value2.activity_mvc = getActivityMVC(key.toString() + key2.toString())
                })
            }

        })
        //console.log(userContent)
        //userContent.ActivityOneId = sessionStorage.getItem('ActivityOneId');
        //console.log(userContent)
        if (!id) {
            delete userContent['transcriptEditable']   
        }
        userContent.predefinedHighlighting = transcriptHighlighting

        console.log(userContent.predefinedHighlighting)
        let data = {id:sessionStorage.getItem("ActivitiesId"),content:userContent}
        console.log(data)
        if (id) {
            await axios.post(`https://activities-alset-aef528d2fd94.herokuapp.com/activitytwo/byId/${id}`, data)
        } else {
            await axios.post("https://activities-alset-aef528d2fd94.herokuapp.com/activitytwo", data).then((response) => {
                const ActivityTwoId = response.data.id;
                sessionStorage.setItem("ActivityTwoId",ActivityTwoId)
            })
        }

        if (sessionStorage.getItem("Occupation") === "Instructor") {
            navigate('/')
        } else if (sessionStorage.getItem("ActivityThreeId") !== "null" && sessionStorage.getItem("ActivityThreeId") !== null) {
            navigate(`/activitythree/${sessionStorage.getItem("ActivityThreeId")}`)
          } else {
            navigate('/activitythree')
          }
      

        // localStorage.setItem("userData",JSON.stringify(userContent));
        //navigate('/activitythree')
    }


    return (
        <Container style={{ marginTop: 20 }}>
            <h2>Activity 2</h2>
            <form onSubmit={handleSubmit}>
                <Typography>Instructions: </Typography>
                <Typography>Read through the transcript and click on sentences from the <strong>interviewee</strong> that you think provide insights or convey important information. Clicking a sentence will highlight it in yellow. Clicking a highlighted sentence again will unhighlight it. When you are satisfied with your sentence selections, click the Submit button to continue to the next activity. Your choices of which sentences to highlight will be carried forward to the next activity.</Typography>
                {sessionStorage.getItem("Occupation") == "Instructor" && <Typography style={{ marginTop: 10}}>Upon submission of this activity, you will be redirected to the home page. You can go back to the home page and choose the configurations for the remaining activities.</Typography>}
                {sessionStorage.getItem("Occupation") == "Instructor" && <FormControlLabel style={{ marginTop: 10 }} control={<Switch checked={transcriptHighlighting} onChange={() => setTranscriptHighlighting((prev) => !prev)} />} label="Predefined Interview Highlighting" />}
                {sessionStorage.getItem("Occupation") == "Student" && transcriptHighlighting && <Typography style={{ marginTop: 10 }}>You are not allowed to edit the highlighting of the transcript in this template.</Typography>}
                <Box sx={{ marginTop: 3, padding: 2, border: '1px solid black' }} id="content-container">
                    {/* <div style={{whiteSpace:pre-line}} dangerouslySetInnerHTML={{ __html: htmlContent }} /> */}
                    {/* {htmlContent.map((line, index) => (
                    <Typography style={{whiteSpace:pre-line}}>
                        {getName(index)}
                        <Typography style={{display:'inline'}}>: </Typography>   
                        <span onClick={(e)=>{handleClick(e,index)}} key-id={index} dangerouslySetInnerHTML={{ __html: line }}></span>
                        {'\n\n'}
                    </Typography>
                       ))} */}

                    {Object.entries(activityMVCContent).map(([key, value]) => {
                        if (key % 2 !== 0) {
                            // console.log(value.activity_mvc.html)
                            return (
                                <>
                                    <div>
                                        <Typography display="inline">{value.tag}: </Typography>
                                        <Typography display="inline" dangerouslySetInnerHTML={{ __html: value.activity_mvc.html }}></Typography>
                                    </div>
                                    <div>
                                        <br />
                                    </div>
                                </>

                                // <Typography style={{whiteSpace:pre-line}}>
                                // <Typography style={{display:'inline'}}>{value.tag}: </Typography>   
                                // {/* {console.log(value.activity_mvc.html)} */}
                                //  <span onClick={(e)=>{handleClick(e,key)}} id={key} dangerouslySetInnerHTML={{ __html: value.activity_mvc.html }}></span>
                                // </Typography>
                            )
                        } else {
                            return (
                                <>
                                    <div>
                                        <Typography display="inline"><strong>{value.tag}</strong>: </Typography>
                                        {/* <Typography display="inline" onClick={(e)=>{handleClick(e,key)}} id={key} dangerouslySetInnerHTML={{ __html: value.activity_mvc.html }}></Typography> */}
                                        {displayInterviewee(value.activity_mvc, key)}
                                    </div>
                                    <div>
                                        <br />
                                    </div>
                                </>
                            )
                            // return Object.entries(value.activity_mvc).map(([key2,value2])=>{  
                            //     return (
                            //         <Typography style={{whiteSpace:pre-line}}> 
                            //         {/* {console.log(value.activity_mvc.html)} */}
                            //          <span onClick={(e)=>{handleClick(e,key.toString()+key2.toString())}} id={key.toString()+key2.toString()} dangerouslySetInnerHTML={{ __html: value2.html }}></span>
                            //         {'\n'}
                            //         </Typography>
                            //     )
                            // })

                        }
                    })}
                </Box>
                <Button sx={{ marginTop: 3, marginBottom: 3 }} fullWidth type="submit" variant='outlined'>Submit</Button>
            </form>


        </Container>
    )
}

export default Act2