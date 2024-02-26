import { Box, Button, ButtonGroup, Container, Dialog, DialogActions, DialogContent, DialogTitle, Fab, FormControl, FormControlLabel, Grid, Switch, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { useParams } from 'react-router-dom';

const Act1 = () => {

  const [interviewer, setInterviewer] = useState('')
  const [interviewee, setInterviewee] = useState('')
  const [transcript, setTranscript] = useState('')
  const [interviewerError, setInterviewerError] = useState(false)
  const [intervieweeError, setIntervieweeError] = useState(false)
  const [transcriptError, setTranscriptError] = useState(false)
  const [helperText, setHelperText] = useState('')
  const [previewTranscript, setPreviewTranscript] = useState({})
  const [previewClicked, setPreviewClicked] = useState(false)
  const [transcriptTitle, setTranscriptTitle] = useState('')
  const [label, setLabel] = useState('Custom Text')
  const [instruction, setInstruction] = useState(`Use the text boxes below to provide the details of your interview transcript. After you fill in the boxes, click the Preview button to see how the transcript looks before proceeding to the next activity. If you would like to make any changes you can do so by editing the transcript text directly. Click the Submit button when you are satisfied with the look of your interview transcript. The final version of your transcript will be used in the next activity.`)
  const [transcriptTitleError, setTranscriptTitleError] = useState(false)
  const [previewClickedError, setPreviewClickedError] = useState('');
  const [switchValue, setSwitchValue] = useState(false)
  const [transcriptEditable, setTranscriptEditable] = useState(false)
  const [instructor, setInstructor] = useState(false)
  const [newChain, setNewChain] = useState(false)
  const [logs,setLogs] = useState({})
  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {

    if (id === "null") {
      alert("Please create an activity chain first.")
    }

    if (sessionStorage.getItem("Occupation") == "Instructor") {
      setInstructor(true)
    }

    if (id) {
      axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/activityone/byId/${id}`).then((response) => {
        if (response.data !== null) {
          //setActivityDescription(response.data.activity_description)
          if (response.data.transcript_source_id !== null) {
            setTranscriptTitle(response.data.transcript_source_id)
          }
          console.log(response.data.content)
          if (response.data.content !== null && response.data.content !== "" && Object.entries(response.data.content).length !== 0) {
            if (response.data.content[1].questioner_tag !== null) {
              setInterviewer(response.data.content[1].questioner_tag)
            }
            if (response.data.content[2].response_tag !== null) {
              setInterviewee(response.data.content[2].response_tag)
            }
          }
          if (response.data.transcriptEditable !== null) {
            setTranscriptEditable(response.data.transcriptEditable)
            setSwitchValue(response.data.transcriptEditable)
          }
          setLabel(response.data.label)
          setInstruction(response.data.instruction)

          if (response.data.content !== null && response.data.content !== "" && Object.entries(response.data.content).length !== 0) {
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
            setTranscript(transcriptText)          
          }

        }
      })

      let ActivitiesId = sessionStorage.getItem("ActivitiesId")
      if (sessionStorage.getItem("Occupation") == "Student") {
        axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/studentlog/get/byId/${ActivitiesId}`).then((response) => {
          if (response.data) {
            setLogs(response.data[0].StudentEvent)
          }
        })
      } else {
        axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/instructorlog/byId/${ActivitiesId}`).then((response) => {
          if (response.data) {
            setLogs(response.data[0].InstructorEvent)
          }  
        })
      }

    }



  }, [])

  const WordCount = (str) => {
    return str.split(" ").length;
  }

  // displays the preview of the transcript 
  const handlePreview = () => {

    const cleaning = (text) => {
      //tabs are replaced by single space
      text = text.replace(/\s{4}/g, '')
      //multiple spaces are replaced by single space
      text = text.replace(/\s\s+/g, '')
      //multiple fullstops are replaced by a single fullstop
      text = text.replace(/\.+/g, '.')
      //?. is replaced by ? 
      text = text.replace(/\?\./g, '?')
      //. . is replaced by . 
      text = text.replace(/\. \./g, '. ')
      return text
    }

    setPreviewTranscript('')
    setHelperText('')
    setPreviewClickedError('')
    setInterviewerError(false)
    setIntervieweeError(false)
    setTranscriptError(false)
    let flag = false
    if (interviewer === '') {
      setInterviewerError(true)
      flag = true
    }
    if (interviewee === '') {
      setIntervieweeError(true)
      flag = true
    }
    if (transcript === '') {
      setTranscriptError(true)
      flag = true
    }
    if (flag) {
      return
    } else {

      let data = {};
      let lines = transcript.split(/\s*(?<=[.!?;])\s*|\n+/g)

      const check1 = new RegExp(`${interviewer}`, 'g');
      const check2 = new RegExp(`${interviewee}`, 'g');

      function splitFirstOccurrence(str, separator) {
        const [first, ...rest] = str.split(separator);

        const remainder = rest.join(':');

        return [first.trim(), remainder.trim()];
      }

      let flag = true
      for (let i = 0; i < lines.length; i++) {
        let line_splitting = splitFirstOccurrence(lines[i], ':');
        if (lines[i] !== "" && line_splitting[1] !== '' && WordCount(line_splitting[0]) === 1) {
          flag = flag && (line_splitting[0] === interviewer || line_splitting[0] === interviewee)
        }
      }

      if (flag === false) {
        setHelperText("Include the correct interviewer and interviewee labels.")
        return;
      }

      //putting content into an object
      let count = 1
      let interviewCount = 1
      let intervieweeCount = 1
      let interviewFlag = false
      let intervieweeFlag = false
      let intervieeeLinesCount = 0

      for (let i = 0; i < lines.length; i++) {
        lines[i] = cleaning(lines[i])
        // console.log("something")
        // console.log(lines[i].split(':')[0])
        // console.log(lines[i].split(':')[0].match(check1))
        // console.log(lines[i].split(':')[0].match(check2))
        if (lines[i].split(':')[0].match(check1) !== null) {
          data[count] = {
            sentence_num: count,
            question_id: interviewCount,
            questioner_tag: interviewer,
            question_text: splitFirstOccurrence(lines[i], ':')[1],
          }
          count++
          interviewFlag = true
          intervieweeFlag = false
          interviewCount++
        } else if (lines[i].split(':')[0].match(check2) !== null) {
          data[count] = {
            sentence_num: count,
            response_id: interviewCount - 1,
            response_tag: interviewee,
            response_text: {}
          }

          intervieeeLinesCount = 1
          data[count].response_text[intervieeeLinesCount] = { text: splitFirstOccurrence(lines[i], ':')[1] }
          interviewFlag = false
          intervieweeFlag = true
          count++
          intervieweeCount++
          intervieeeLinesCount++
        } else if (lines[i] !== '' && lines[i] !== '\n') {
          if (interviewFlag === true && lines[i] !== '?') {
            data[count - 1].question_text = cleaning(data[count - 1].question_text + '. ' + lines[i])
          } else if (interviewFlag === true && lines[i] === '?') {
            data[count - 1].question_text = cleaning(data[count - 1].question_text + lines[i])
          } else {
            data[count - 1].response_text[intervieeeLinesCount] = { text: cleaning(lines[i]) }
            intervieeeLinesCount++
          }
        }
      }

      console.log('before putting in')
      console.log(data)

      setPreviewClicked(true)
      setPreviewTranscript(data)
    }
  }

  // display interviewee text
  const displayIntervieweeText = (value, name, key_ori) => {
    {
      return Object.entries(value).map(([key, value]) => {
        return (
          <Typography id={key_ori + key} style={{ display: 'inline' }}>{value.text} </Typography>
        )
      })
    }
  }

  // displays transcript 
  const displayTranscript = () => {
    {console.log("display transcript")}
    {console.log(previewTranscript)}
    if (Object.keys(previewTranscript).length === 0) {
      return (
        <>
          <Typography align='center'>Please press the preview button in order to preview the transcript.</Typography>
        </>
      )
    } else {
      return Object.entries(previewTranscript).map(([key, value]) => {
        if (value.questioner_tag !== undefined) {
          {console.log(value.question_text)}
          return (
            <div key={key}>
              <Typography display="inline">{value.questioner_tag}: </Typography>
              <Typography display="inline" id={key}>{value.question_text}</Typography>
              <br />
              <br />
            </div>
          )
        } else {
          return (
            <>
              <div key={key}>
                <Typography display="inline">{value.response_tag}: </Typography>
                {displayIntervieweeText(value.response_text, value.response_tag, key.toString())}
              </div>
              <div>
                <br />
              </div>
            </>
          )
        }
      })
    }
  }


  // submission of activity one 
  const handleSubmit = async (e) => {
    if (transcript) {
      setPreviewClickedError('');
      if (previewClicked === false) {
        setPreviewClickedError('Please click on the preview button to view the transcript before submitting.')
        return;
      }
    }

    !instructor && setInterviewerError(false) &&  setPreviewClickedError('') && setTranscriptError(false) && setTranscriptTitleError(false)
    setTranscriptTitleError(false)
    e.preventDefault()
    let flag = false
    if (!instructor) {
      if (previewClicked === false) {
        setPreviewClickedError('Please click on the preview button to view the transcript before submitting.')
        flag = true
      }
      if (interviewer === '') {
        setInterviewerError(true)
        flag = true
      }
      if (interviewee === '') {
        setIntervieweeError(true)
        flag = true
      }
      if (transcript === '') {
        setTranscriptError(true)
        flag = true
      }
    }
    
    if (transcriptTitle === '') {
      setTranscriptTitleError(true)
      flag = true
    }
    if (flag) {
      return
    }

    let transcript_source_id = transcriptTitle

    Object.entries(previewTranscript).map(([key, value]) => {
      if (value.questioner_tag !== undefined) {
        previewTranscript[key].activity_mvc = getActivityMVC(key)
      } else {
        Object.entries(previewTranscript[key].response_text).map(([key2, value]) => {
          previewTranscript[key].response_text[key2].activity_mvc = getActivityMVC(key.toString() + key2.toString())
        })
      }
    })

    console.log(previewTranscript)

    let final_data = {
      // activity_description: activityDescription,
      transcript_source_id: transcript_source_id,
      content: previewTranscript,
      UserId: sessionStorage.getItem("UserId"),
      transcriptEditable: instructor ? switchValue : null,
      label: document.getElementById("activity-one-label").innerHTML,
      instruction: document.getElementById("activity-one-instruction").innerHTML
    }

    console.log("final data")
    console.log(final_data)

    // if (newChain) {
    //   await axios.post("https://activities-alset-aef528d2fd94.herokuapp.com/activityone/new-chain", final_data).then((response) => {
    //     const ActivitiesID = response.data.ActivitiesId.id
    //     const ActivityOneId = response.data.ActivityOneId
    //     sessionStorage.setItem("ActivitiesId", ActivitiesID)
    //     sessionStorage.setItem("ActivityOneId", ActivityOneId)
    //     sessionStorage.removeItem("ActivityTwoId")
    //     sessionStorage.removeItem("ActivityThreeId")
    //     sessionStorage.removeItem("ActivityFourId")
    //     sessionStorage.removeItem("ActivityFiveId")
    //     sessionStorage.removeItem("ActivitySixId")
    //   })
    // } else
     if (id) {
      await axios.post(`https://activities-alset-aef528d2fd94.herokuapp.com/activityone/byId/${id}`, final_data)
      
      if (newChain) {
        await axios.post(`https://activities-alset-aef528d2fd94.herokuapp.com/activityone/byId/${sessionStorage.getItem("ActivitiesId")}/new-chain`);
        sessionStorage.removeItem("ActivityTwoId")
        sessionStorage.removeItem("ActivityThreeId")
        sessionStorage.removeItem("ActivityFourId")
        sessionStorage.removeItem("ActivityFiveId")
        sessionStorage.removeItem("ActivitySixId")

        let data = logs
        data[Object.keys(logs).length]  = {DateTime: Date.now(), EventType: "Activity 1 has been reinitialized."}
        if (!instructor) {
          await axios.post(`https://activities-alset-aef528d2fd94.herokuapp.com/studentlog/update/byId/${sessionStorage.getItem("ActivitiesId")}`, data)
        } else {
          await axios.post(`https://activities-alset-aef528d2fd94.herokuapp.com/instructorlog/update/byId/${sessionStorage.getItem("ActivitiesId")}`, data)
        }

      } else {

        let data = logs
        data[Object.keys(logs).length]  = {DateTime: Date.now(), EventType: "Activity 1 has been updated."}
        console.log(data)
        if (!instructor) {
          await axios.post(`https://activities-alset-aef528d2fd94.herokuapp.com/studentlog/update/byId/${sessionStorage.getItem("ActivitiesId")}`, data)
        } else {
          await axios.post(`https://activities-alset-aef528d2fd94.herokuapp.com/instructorlog/update/byId/${sessionStorage.getItem("ActivitiesId")}`, data)
        }

      }

    } else {
      await axios.post("https://activities-alset-aef528d2fd94.herokuapp.com/activityone", final_data).then((response) => {
        const ActivitiesID = response.data.ActivitiesId.id
        const ActivityOneId = response.data.ActivityOneId
        sessionStorage.setItem("ActivitiesId", ActivitiesID)
        sessionStorage.setItem("ActivityOneId", ActivityOneId)
      })


      if (!instructor) {
        let data = {StudentTemplateId: sessionStorage.getItem("ActivitiesId"), StudentId: sessionStorage.getItem("UserId"), StudentEvent: {0: {DateTime: Date.now(), EventType: "Activity 1 has been created."}}}
        await axios.post(`https://activities-alset-aef528d2fd94.herokuapp.com/studentlog/create`, data).then((response) => {
          sessionStorage.setItem("StudentLogsId",response.data.StudentLogsId)
        })
      } else {
        let data = {ActivitySequenceId: sessionStorage.getItem("ActivitiesId"), StudentId: sessionStorage.getItem("UserId"), InstructorEvent: {0: {DateTime: Date.now(), EventType: "Activity 1 has been created."}}}
        await axios.post(`https://activities-alset-aef528d2fd94.herokuapp.com/instructorlog/create`, data).then((response) => {
          sessionStorage.setItem("InstructorLogsId",response.data.InstructorLogsId)
        })
      }
    }

    if (sessionStorage.getItem("ActivityTwoId") !== "null" && sessionStorage.getItem("ActivityTwoId") !== null) {
      navigate(`/activitytwo/${sessionStorage.getItem("ActivityTwoId")}`)
    } else {
      navigate('/activitytwo')
    }
  }

  // gets activity mvc of each of the sentences
  const getActivityMVC = (value) => {
    const element = document.querySelector(`[id="${value}"]`);
    if (element) {
      const htmlContent = element.outerHTML;
      const inlineStyles = element.getAttribute('style') || 'No inline styles';
      return { html: htmlContent, css: inlineStyles }
    } else {
      alert('Element not found');
      return undefined
    }
  }

  const onReset = () => {
    // setActivityDescription("")
    setTranscriptTitle("")
    { !transcriptEditable || instructor && setInterviewer("") }
    { !transcriptEditable || instructor && setInterviewee("") }
    { instructor && setTranscriptEditable(false) }
    { instructor && setSwitchValue(false) }
    { !transcriptEditable || instructor && setTranscript("") }
    setLabel("")
    { instructor && setInstruction("") }
  }

  return (
    <Container style={{ marginTop: 20 }}>
      <div style={{ display: "flex", direction: "row" }}>
        <h2>Activity 1:</h2>&nbsp;&nbsp;
        <h2 dangerouslySetInnerHTML={{ __html: ` ${label}` }} contentEditable="true" style={{ minHeight: 1, borderRight: "solid rgba(0,0,0,0) 1px", outline: "none" }} id="activity-one-label"></h2>
      </div>
      <form onSubmit={handleSubmit} noValidate autoComplete='off'>
        <Typography>Instructions (Editable by Instructors): </Typography>
        <Typography id="activity-one-instruction" dangerouslySetInnerHTML={{ __html: ` ${instruction}` }} contentEditable={instructor && true} style={{ minHeight: 1, borderRight: "solid rgba(0,0,0,0) 1px", outline: "none" }}></Typography>
        {instructor && <FormControlLabel style={{ marginTop: 10 }} control={<Switch checked={switchValue} onChange={() => setSwitchValue((prev) => !prev)} />} label="Predefined Interview Text" />}
        <FormControlLabel style={{ marginTop: 10 }} control={<Switch checked={newChain} onChange={() => {alert("Warning: All data in next five activities corresponding to this chain will be erased.");setNewChain((prev) => !prev)}} />} label="Create a new chain of activities" />
        {!instructor && transcriptEditable && <Typography style={{ marginTop: 10 }}>You are not allowed to edit the transcript in this template.</Typography>}
        <Button onClick={() => { onReset() }} sx={{ marginTop: 2 }} variant='outlined' fullWidth>Reset</Button>
        <TextField error={transcriptTitleError} margin='normal' value={transcriptTitle} label='Transcript title' fullWidth onChange={(e) => setTranscriptTitle(e.target.value)}></TextField>
        <TextField disabled={!instructor && transcriptEditable} error={interviewerError} margin='normal' value={interviewer} fullWidth variant='outlined' label="Interviewer label (e.g. Interviewer)" onChange={(e) => setInterviewer(e.target.value)}></TextField>
        <TextField disabled={!instructor && transcriptEditable} error={intervieweeError} margin='normal' value={interviewee} fullWidth variant='outlined' label="Interviewee label (e.g. Interviewee)" onChange={(e) => setInterviewee(e.target.value)}></TextField>
        <TextField disabled={!instructor && transcriptEditable} helperText={helperText} error={transcriptError} margin='normal' value={transcript} rows={15} fullWidth multiline variant='outlined' label="Transcript" onChange={(e) => setTranscript(e.target.value)}></TextField>
        <Button onClick={handlePreview} sx={{ marginTop: 2 }} variant='outlined' fullWidth>Preview</Button>
        <Box sx={{ marginTop: 3, padding: 2, border: '1px solid black' }}>
          {displayTranscript()}
        </Box>
        <Typography sx={{ marginTop: 3 }}>{previewClickedError}</Typography>
        <Button sx={{ marginTop: 1, marginBottom: 3 }} fullWidth type="submit" variant='outlined'>Submit</Button>
      </form>
    </Container>
  )
}

export default Act1