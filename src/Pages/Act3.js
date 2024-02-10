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
    const [MLModel, setMLModel] = useState("")
    const [predefinedMLSelection, setPredefinedMLSelection] = useState(false)
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

        if (id) {
            axios.get(`http://localhost:3001/activitythree/byId/${id}`).then((response) => {
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
                        axios.get(`http://localhost:3001/activitytwo/byId/${sessionStorage.getItem("ActivityTwoId")}`).then((response) => {
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

                    
                    // setMLModel(response.data.MLModel)
                    // setAllowMLModel(response.data.AllowMLModel)
                    // setPredefinedMLSelection(response.data.predefinedMLSelection)
                }
            })
        } else {
            axios.get(`http://localhost:3001/activitytwo/byId/${sessionStorage.getItem("ActivityTwoId")}`).then((response) => {
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

        //let data = JSON.parse(localStorage.getItem("userData"));
        //let data2 = JSON.parse(localStorage.getItem("userData")); //untouched
        //localStorage.setItem("userData_original",JSON.stringify(data2));

        //setUserData(RandomlyAssign(data,data2))
        //setUserData_ori(data2)

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

    const handleClick = (event, css, key, key2) => {
        // event.target will be the clicked span element
        //console.log("Clicked on span with content:", event.target.innerHTML);
        // console.log(css)
        
        if (event.target.style.backgroundColor === 'lightgreen') {
            event.target.style.backgroundColor = 'lightblue'
            changeContents(key, key2, 2)
            //event.target.style.color = 'white'
        } else if (event.target.style.backgroundColor === 'lightblue') {
            changeContents(key, key2, 1)
            event.target.style.backgroundColor = 'lightgreen'
            //event.target.style.color = 'white'
        } else if (event.target.style.backgroundColor === '') {
            event.target.style.backgroundColor = 'yellow'
            changeContents(key, key2, 1)
            //event.target.style.color = 'black'
        } else {
            changeContents(key, key2, 2)
            event.target.style.backgroundColor = ''
            //event.target.style.color = 'black'
        }

    };

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


    const handleSubmit = async (e) => {
        e.preventDefault()
        let userContent = userData
        let userContent_ori = userData_ori
        userContent.user_ai_markup_id = "tbd"
        console.log(userContent_ori)
        // userContent.record_datatime = Date.now()
        // console.log(userContent)
        // Object.entries(userContent.content).map(([key,value])=>{
        //     if (value.questioner_tag !== undefined) {
        //         value.activity_mvc = getActivityMVC(key)
        //     } else {
        //         Object.entries(value.response_text).map(([key2,value2])=>{
        //             value2.activity_mvc = getActivityMVC(key.toString()+key2.toString())
        //         })
        //     }

        // })

        //delete userContent_ori["ActivityOneId"]
        //userContent_ori.ActivityTwoId = sessionStorage.getItem("ActivityTwoId")

        console.log(userContent_ori)
        
        if (!id) {
            delete userContent_ori["predefinedHighlighting"]
            delete userContent_ori["predefinedTranscript"]
        }
        userContent_ori.MLModel = MLModel
        userContent_ori.AllowMLModel = AllowMLModel
        userContent_ori.predefinedMLSelection = predefinedMLSelection

        console.log(userContent_ori.AllowMLModel)
        let data = { id: sessionStorage.getItem("ActivitiesId"), content: userContent_ori }

        if (id) {
            await axios.post(`http://localhost:3001/activitythree/byId/${id}`, data)
        } else {
            await axios.post("http://localhost:3001/activitythree", data).then((response) => {
                const ActivityThreeId = response.data.id;
                sessionStorage.setItem("ActivityThreeId",ActivityThreeId)
            })
        }

        // axios.post("http://localhost:3001/activitythree", data).then((response) => {
        //     //const ActivityThreeId = response.data.id;
        //     //sessionStorage.setItem("ActivityThreeId",ActivityThreeId)
        // })

        // localStorage.setItem("userData", JSON.stringify(userContent_ori));
        // localStorage.removeItem("clusteredData")




        if (sessionStorage.getItem("ActivityFourId") !== "null" && sessionStorage.getItem("ActivityFourId") !== null) {
            navigate(`/activityfour/${sessionStorage.getItem("ActivityFourId")}`)
          } else {
            navigate('/activityfour')
          }



        
        //navigate('/activityfour')
    }


    const RandomlyAssign = (data, data2) => {
        let userContent = data
        let userContent_ori = data2
        // Object.entries(userContent.content).map(([key,value])=>{
        //     let rand = Math.random()
        //     if (rand <= .5) {
        //         if (value.questioner_tag !== undefined && value.activity_mvc.css === "background-color: yellow;") {
        //             value.activity_mvc.html = value.activity_mvc.html.replace(/background-color:.*?;/gi,background-color: lightgreen;)
        //             value.activity_mvc.css = "background-color: yellow; "
        //         } else if (value.questioner_tag !== undefined && value.activity_mvc.css !== "background-color: yellow;") {
        //             value.activity_mvc.html = value.activity_mvc.html.replace(/background-color:.*?;/gi,background-color: lightgreen;)
        //             console.log("no")
        //             value.activity_mvc.css = "background-color: lightblue"
        //         }
        //     }
        // })

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
                            console.log(value2)
                            //value2.activity_mvc.html = value2.activity_mvc.html.replace(/background-color:.*?;/gi,background-color: lightgreen;)
                            //value2.activity_mvc.css = "background-color: lightblue"
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
            <h2>Activity 3</h2>
            <form onSubmit={handleSubmit}>
                <Typography>Instructions: </Typography>
                <Typography>The transcript you submitted was passed through an AI model trained to identify important sentences. The model’s sentence selection was then compared with yours. The sentences you and the model both selected are now highlighted in green. Sentences that the model classified as being important but you did not are highlighted in blue. Sentences you selected as being important but the model did not are highlighted in yellow.</Typography>
                <br />
                <Typography>Please review the version of your transcript with the new highlights below. You’ll likely agree with some of the sentence selections and disagree with others. As you review the transcript, feel free to refine your sentence selections. When you are satisfied with your selections, click the Submit button to continue to the next activity. Only your choices about which sentences are important (yellow and green highlights) will be used in the next activity.</Typography>
                <br />
                <Typography>You can refer to the following key to remind yourself of what the three colours mean.</Typography>
                <ul style={{ marginTop: 0 }}>
                    <li><Typography>Only the model selected - blue</Typography></li>
                    <li><Typography>Only you selected - yellow</Typography></li>
                    <li><Typography>Both you and the model selected - green</Typography></li>
                </ul>
                {displayConfig()}
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
                            let styleObject = {};
                            // const style = value.activity_mvc.css ? value.activity_mvc.css : {};
                            // if (value.activity_mvc.css) {
                            //     const [property, color] = value.activity_mvc.css.split(":");
                            // }
                            // console.log(value.activity_mvc.html)
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
                                        <Typography display="inline">{value.tag}: </Typography>
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

export default Act3