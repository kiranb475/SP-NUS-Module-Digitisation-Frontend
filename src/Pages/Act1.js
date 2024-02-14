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
  const [activityDescriptionError,setActivityDescriptionError] = useState(false)
  const [helperText, setHelperText] = useState('')
  const [previewTranscript, setPreviewTranscript] = useState({})
  const [previewClicked, setPreviewClicked] = useState(false)
  const [transcriptTitle, setTranscriptTitle] = useState('')
  const [label,setLabel] = useState('Custom Text')
  const [instruction,setInstruction] = useState(`Use the text boxes below to provide the details of your interview transcript. After you fill in the boxes, click the Preview button to see how the transcript looks before proceeding to the next activity. If you would like to make any changes you can do so by editing the transcript text directly. Click the Submit button when you are satisfied with the look of your interview transcript. The final version of your transcript will be used in the next activity.`)
  const [transcriptTitleError, setTranscriptTitleError] = useState(false)
  const [activityDescription, setActivityDescription] = useState('')
  const [previewClickedError, setPreviewClickedError] = useState('');
  const [switchValue, setSwitchValue] = useState(false)
  const [transcriptEditable, setTranscriptEditable] = useState(false)
  const [instructor,setInstructor] = useState(false)
  const [newChain,setNewChain] = useState(false)
  const navigate = useNavigate()
  const { id } = useParams()


  // display interviewee text
  const displayIntervieweeText = (value, name, key_ori) => {
    {
      return Object.entries(value).map(([key, value]) => {
        return (
          <Typography id={key_ori + key} style={{ display: 'inline' }}>{value.text}</Typography>
        )
      })
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

  useEffect(() => {

    if (sessionStorage.getItem("Occupation") == "Instructor") {
      setInstructor(true)
    }

    if (id) {
      axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/activityone/byId/${id}`).then((response) => {
        if (response.data !== null) {
          //setActivityDescription(response.data.activity_description)
          setTranscriptTitle(response.data.transcript_source_id.split(' ')[0])
          setInterviewer(response.data.content[1].questioner_tag)
          setInterviewee(response.data.content[2].response_tag)
          setTranscriptEditable(response.data.transcriptEditable)
          setSwitchValue(response.data.transcriptEditable)
          setLabel(response.data.label)
          setInstruction(response.data.instruction)

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
      })
    }



  }, [])

  // submission of activity one 
  const handleSubmit = async (e) => {
    setInterviewerError(false)
    setIntervieweeError(false)
    setTranscriptError(false)
    //setActivityDescriptionError(false)
    setPreviewClickedError('')
    setTranscriptTitleError(false)
    e.preventDefault()
    let flag = false
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
    if (transcriptTitle === '') {
      setTranscriptTitleError(true)
      flag = true
    }
    // if (activityDescription === '') {
    //   setActivityDescriptionError(true)
    //   flag = true
    // }
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

    let final_data = {
      // activity_description: activityDescription,
      transcript_source_id: transcript_source_id,
      content: previewTranscript,
      UserId: sessionStorage.getItem("UserId"),
      transcriptEditable: instructor ? switchValue : null,
      label: document.getElementById("activity-one-label").innerHTML,
      instruction: document.getElementById("activity-one-instruction").innerHTML
    }

    if (newChain) {
      // await axios.post("https://activities-alset-aef528d2fd94.herokuapp.com/activityone/new-chain", final_data).then((response) => {
      //   const ActivitiesID = response.data.ActivitiesId.id
      //   const ActivityOneId = response.data.ActivityOneId
      //   sessionStorage.setItem("ActivitiesId", ActivitiesID)
      //   sessionStorage.setItem("ActivityOneId", ActivityOneId)
      //   sessionStorage.removeItem("ActivityTwoId")
      //   sessionStorage.removeItem("ActivityThreeId")
      //   sessionStorage.removeItem("ActivityFourId")
      //   sessionStorage.removeItem("ActivityFiveId")
      //   sessionStorage.removeItem("ActivitySixId")
      // })
    } else if (id) {
      console.log("no")
      await axios.post(`https://activities-alset-aef528d2fd94.herokuapp.com/activityone/byId/${id}`, final_data)
    } else {
      console.log("no")
      await axios.post("https://activities-alset-aef528d2fd94.herokuapp.com/activityone", final_data).then((response) => {
        const ActivitiesID = response.data.ActivitiesId.id
        const ActivityOneId = response.data.ActivityOneId
        sessionStorage.setItem("ActivitiesId", ActivitiesID)
        sessionStorage.setItem("ActivityOneId", ActivityOneId)
      })
    }

    if (sessionStorage.getItem("ActivityTwoId") !== "null" && sessionStorage.getItem("ActivityTwoId") !== null) {
      navigate(`/activitytwo/${sessionStorage.getItem("ActivityTwoId")}`)
    } else {
      navigate('/activitytwo')
    }
  }

  // displays transcript 
  const displayTranscript = () => {
    if (Object.keys(previewTranscript).length === 0) {
      return (
        <>
          <Typography align='center'>Please press the preview button in order to preview the transcript.</Typography>
        </>
      )
    } else {
      return Object.entries(previewTranscript).map(([key, value]) => {
        if (value.questioner_tag !== undefined) {
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
      let lines = transcript.split(/([/\n.])+/)

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
        if (lines[i].match(check1) !== null) {
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
        } else if (lines[i].match(check2) !== null) {
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

      setPreviewClicked(true)
      setPreviewTranscript(data)
    }
  }

  const onReset = () => {
    // setActivityDescription("")
    setTranscriptTitle("")
    {!transcriptEditable || instructor && setInterviewer("")}
    {!transcriptEditable || instructor && setInterviewee("")}
    {instructor && setTranscriptEditable(false)}
    {instructor && setSwitchValue(false)}
    {!transcriptEditable || instructor && setTranscript("")}
    setLabel("")
    {instructor && setInstruction("")}
  }

  return (
    <Container style={{ marginTop: 20 }}>
    <div style={{ display: "flex", direction: "row" }}>
  <h2>Activity 1:</h2>&nbsp;&nbsp;
  <h2 dangerouslySetInnerHTML={{ __html: ` ${label}` }} contentEditable="true" style={{ minHeight: 1, borderRight: "solid rgba(0,0,0,0) 1px", outline: "none" }} id="activity-one-label"></h2>
</div>
      <form onSubmit={handleSubmit} noValidate autoComplete='off'>
          <Typography>Instructions (Editable by Instructors): </Typography>
          <Typography id="activity-one-instruction" dangerouslySetInnerHTML={{ __html: ` ${instruction}` }} contentEditable={instructor && true} style={{minHeight:1,borderRight:"solid rgba(0,0,0,0) 1px",outline: "none"}}></Typography>
        {instructor && <FormControlLabel style={{ marginTop: 10 }} control={<Switch checked={switchValue} onChange={() => setSwitchValue((prev) => !prev)} />} label="Predefined Interview Text" />}
        <FormControlLabel disabled style={{ marginTop: 10 }} control={<Switch checked={newChain} onChange={() => setNewChain((prev) => !prev)} />} label="Create a new chain of activities" />
        {!instructor && transcriptEditable && <Typography style={{ marginTop: 10 }}>You are not allowed to edit the transcript in this template.</Typography>}
        <Button onClick={() => {onReset()}} sx={{ marginTop: 2 }} variant='outlined' fullWidth>Reset</Button>
        {/* <TextField margin='normal' label='Activity Description' error={activityDescriptionError} value={activityDescription} fullWidth onChange={(e) => setActivityDescription(e.target.value)}></TextField> */}
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