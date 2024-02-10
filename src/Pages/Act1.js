import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, Grid, Switch, TextField, Typography } from '@mui/material';
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
  const [transcriptTitleError, setTranscriptTitleError] = useState(false)
  const [activityDescription, setActivityDescription] = useState('')
  const [previewClickedError, setPreviewClickedError] = useState('');
  const [switchValue, setSwitchValue] = useState(false)
  const [transcriptEditable, setTranscriptEditable] = useState(false)
  const navigate = useNavigate()
  const { id } = useParams()


  const displayIntervieweeText = (value, name, key_ori) => {
    // let result = ''
    // {Object.entries(value).map(([key,value])=>{
    //   result = result + ' ' + value
    // })}
    // return (
    //   <div>
    //       <Typography style={{display:'inline'}}>{name}:</Typography>
    //       <Typography style={{display:'inline'}} data-key={key}>{result}</Typography>
    //   </div>
    // )
    {
      return Object.entries(value).map(([key, value]) => {
        return (
          <Typography id={key_ori + key} style={{ display: 'inline' }}>{value.text}</Typography>
        )
      })
    }
  }

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

  useEffect(() => {

    if (id) {
      axios.get(`http://localhost:3001/activityone/byId/${id}`).then((response) => {
        if (response.data !== null) {
          setActivityDescription(response.data.activity_description)
          setTranscriptTitle(response.data.transcript_source_id.split(' ')[0])
          setInterviewer(response.data.content[1].questioner_tag)
          setInterviewee(response.data.content[2].response_tag)
          setTranscriptEditable(response.data.transcriptEditable)
          setSwitchValue(response.data.transcriptEditable)

          if (response.data.transcriptEditable) {
            handlePreview()
          }

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

  const handleSubmit = async (e) => {
    setInterviewerError(false)
    setIntervieweeError(false)
    setTranscriptError(false)
    setPreviewClickedError('')
    setTranscriptTitleError(false)
    e.preventDefault()
    if (previewClicked === false) {
      setPreviewClickedError('Please click on the preview button to view the transcript before submitting.')
      return;
    }
    if (interviewer === '') {
      setInterviewerError(true)
      return;
    }
    if (interviewee === '') {
      setIntervieweeError(true)
      return;
    }
    if (transcript === '') {
      setTranscriptError(true)
      return;
    }
    if (transcriptTitle === '') {
      setTranscriptTitleError(true)
      return;
    }
    //console.log(previewTranscript)
    let transcript_source_id = transcriptTitle + ' ' + Date.now()
    //console.log(transcript_source_id)

    Object.entries(previewTranscript).map(([key, value]) => {
      if (value.questioner_tag !== undefined) {
        previewTranscript[key].activity_mvc = getActivityMVC(key)
        // console.log(previewTranscript[key])
      } else {
        Object.entries(previewTranscript[key].response_text).map(([key2, value]) => {
          previewTranscript[key].response_text[key2].activity_mvc = getActivityMVC(key.toString() + key2.toString())
        })
      }
    })

    console.log(previewTranscript)

    let final_data = {
      activity_description: activityDescription,
      transcript_source_id: transcript_source_id,
      content: previewTranscript,
      UserId: sessionStorage.getItem("UserId"),
      transcriptEditable: sessionStorage.getItem("Occupation") == "Instructor" ? switchValue : null
      //user_id: 'tbd',
    }

    console.log(final_data)

    // console.log(final_data)
    // final_data.content = previewTranscript
    // console.log(final_data)

    // let count = 0;
    // Object.entries(previewTranscript).map(([key, value]) => {
    //   if (key % 2 === 0) {
    //     final_data.content[count] = {
    //       sentence_num: key,
    //       question_id: value.id,
    //       questioner_tag: interviewer,
    //       question_text: value.content.split(':')[1],
    //       sentence_id: -1,
    //       response_tag: interviewee,
    //       response_text: '',
    //     }
    //   } else {
    //     final_data.content[count].sentence_id = value.id
    //     final_data.content[count].response_text = value.content.split(':')[1]
    //     count++
    //   }
    //   // } else {
    //   //   final_data.content[count].sentence_id = value.id,
    //   //   final_data.content[count].response_text = value.content,
    //   // }
    // });

      if (id) {
        await axios.post(`http://localhost:3001/activityone/byId/${id}`, final_data)
        //sessionStorage.setItem("ActivityOneId",id)
      } else {
        await axios.post("http://localhost:3001/activityone", final_data).then((response) => {
          console.log(response)
          const ActivitiesID = response.data.ActivitiesId.id
          const ActivityOneId = response.data.ActivityOneId
          sessionStorage.setItem("ActivitiesId", ActivitiesID)
          sessionStorage.setItem("ActivityOneId", ActivityOneId)
        })
      }

      console.log(sessionStorage.getItem("ActivityTwoId"))
      if (sessionStorage.getItem("ActivityTwoId") !== "null" && sessionStorage.getItem("ActivityTwoId") !== null) {
        navigate(`/activitytwo/${sessionStorage.getItem("ActivityTwoId")}`)
      } else {
        navigate('/activitytwo')
      }
    

    //localStorage.setItem("userData",JSON.stringify(final_data));


    // console.log(sessionStorage.getItem("ActivityTwoId"))
    // if (sessionStorage.getItem("ActivityTwoId") !== "null" && sessionStorage.getItem("ActivityTwoId") !== null) {
    //   navigate(`/activitytwo/${sessionStorage.getItem("ActivityTwoId")}`)
    // } else {
    //   navigate('/activitytwo')
    // }


    //navigate('/activitytwo')
    //console.log(final_data)
  }


  const displayTranscript = () => {
    //console.log(Object.keys(previewTranscript).length)
    //console.log(previewTranscript)
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
    if (interviewer === '') {
      transcriptEditable && setInterviewerError(true)
      return;
    }
    if (interviewee === '') {
      setIntervieweeError(true)
      return;
    }
    if (transcript === '') {
      setTranscriptError(true)
    } else {

      let data = {};

      //console.log(transcript)
      let lines = transcript.split(/([/\n.])+/)
      //console.log(lines)

      //checking correct interviewer and interviewee labels.
      //console.log(lines)
      // console.log(interviewer)
      // console.log(interviewee)

      const check1 = new RegExp(`${interviewer}`, 'g');
      const check2 = new RegExp(`${interviewee}`, 'g');

      function splitFirstOccurrence(str, separator) {
        const [first, ...rest] = str.split(separator);

        const remainder = rest.join(':');

        return [first.trim(), remainder.trim()];
      }

      let flag = true
      for (let i = 0; i < lines.length; i++) {
        //console.log(lines[i].match(check1))
        let line_splitting = splitFirstOccurrence(lines[i], ':');
        console.log(line_splitting[0])
        console.log(line_splitting[0].length)
        if (lines[i] !== "" && line_splitting[1] !== '' && WordCount(line_splitting[0]) === 1) {
          //better solution to be found 
          //console.log(lines[i].split(":"))
          //console.log(lines[i])
          flag = flag && (line_splitting[0] === interviewer || line_splitting[0] === interviewee)
          // console.log(flag)
          // console.log(line_splitting)
          //console.log(flag)
        }
      }

      if (flag === false) {
        setHelperText("Include the correct interviewer and interviewee labels.")
        return;
      }


      // let flag = true; 
      // let count_x = 0;
      // for (let i = 0; i < lines.length; i++) {
      //   if (lines[i] !== '') {
      //     flag = flag && count_x % 2 === 0 ? lines[i].split(":")[0] === interviewer : lines[i].split(":")[0] === interviewee
      //     count_x++
      //   } else {
      //     continue
      //   }
      // }
      // if (flag === false) {
      //   setHelperText("Include the correct interviewer and interviewee labels.")
      //   return;
      // }

      // const check1 = /${interviewer}{1}/gi
      // const check2 = /${interviewee}{1}/gi

      //putting content into an object
      let count = 1
      let interviewCount = 1
      let intervieweeCount = 1
      let interviewFlag = false
      let intervieweeFlag = false
      let intervieeeLinesCount = 0
      //console.log(lines)
      for (let i = 0; i < lines.length; i++) {
        //console.log(lines[i].match(check1))
        //console.log(lines[i].length)
        lines[i] = cleaning(lines[i])
        if (lines[i].match(check1) !== null) {
          data[count] = {
            sentence_num: count,
            question_id: interviewCount,
            questioner_tag: interviewer,
            question_text: splitFirstOccurrence(lines[i], ':')[1],
            //sentence_id: -1,
            //response_tag: interviewee,
            //response_text: {},
          }
          count++
          interviewFlag = true
          intervieweeFlag = false
          //data[interviewCount] = lines[i]
          interviewCount++
        } else if (lines[i].match(check2) !== null) {

          // let ind_lines = []
          // let line = splitFirstOccurrence(lines[i],':')[1]
          // ind_lines = line.split('.')

          // for(let i = 0; i < )
          data[count] = {
            sentence_num: count,
            response_id: interviewCount - 1,
            response_tag: interviewee,
            response_text: {}
          }

          intervieeeLinesCount = 1
          //data[count].sentence_id = intervieweeCount
          data[count].response_text[intervieeeLinesCount] = { text: splitFirstOccurrence(lines[i], ':')[1] }
          interviewFlag = false
          intervieweeFlag = true
          count++
          //data[intervieweeCount] = lines[i]
          intervieweeCount++
          intervieeeLinesCount++
          //console.log(data) 
        } else if (lines[i] !== '' && lines[i] !== '\n') {
          //console.log(lines[i])
          if (interviewFlag === true && lines[i] !== '?') {
            data[count - 1].question_text = cleaning(data[count - 1].question_text + '. ' + lines[i])
          } else if (interviewFlag === true && lines[i] === '?') {
            data[count - 1].question_text = cleaning(data[count - 1].question_text + lines[i])
          } else {
            //console.log(intervieeeLinesCount)
            data[count - 1].response_text[intervieeeLinesCount] = { text: cleaning(lines[i]) }
            console.log(data[count - 1].response_text[intervieeeLinesCount])
            intervieeeLinesCount++
          }
          //data[count-1].content = cleaning(data[count-1].content + '.' + lines[i])
        }
      }

      //console.log(data)

      /*
          sentence_num: key,
          question_id: value.id,
          questioner_tag: interviewer,
          question_text: value.content.split(':')[1],
          sentence_id: -1,
          response_tag: interviewee,
          response_text: '',

        final_data.content[count].sentence_id = value.id
        final_data.content[count].response_text = value.content.split(':')[1]
        count++
        */

      setPreviewClicked(true)
      //console.log(data)
      setPreviewTranscript(data)

      // let transcriptText = ''
      // {Object.entries(data).map(([key,value])=>(
      //   transcriptText = transcriptText + '\n\n' + value.questioner_tag + ': ' + value.question_text + '\n\n' + value.response_tag + ': ' + value.response_text[0]
      // ))}

      // console.log(transcriptText)
      // setTranscriptTextInit(transcriptText)
      //console.log(previewTranscript)

      // //split the transcript into interview and interviewee blocks by splitting 
      // let block = transcript.split("\n\n")

      // //check whether it has the correct interview and interviewee labels 
      // // const check1 = /Interviewer{1}/gi
      // // const check2 = /Interviewee{1}/gi
      // for (let i = 0; i < block.length; i++) {
      //   if (block[i].match(check1) !== null) {
      //     if (block[i].match(check2) !== null) {

      //     } else {
      //       setHelperText("Include the correct interviewee labels.")
      //     }
      //   } else {
      //     setHelperText("Include the correct interviewer labels.") 
      //   }
      // }

      // //clean the data using required checks and replacements
      // for (let i = 0; i < block.length; i++) {
      //   //tabs are replaced by single space
      //   block[i] = block[i].replace(/\s{4}/g,'')
      //   //multiple spaces are replaced by single space
      //   block[i] = block[i].replace(/\s\s+/g,'')
      //   //multiple fullstops are replaced by a single fullstop
      //   block[i] = block[i].replace(/\.+/g,'.')
      // // text = text.replace(/\s\s+/g,'')
      // // text = text.replace(/\n+/g,'.')
      // // text = text.replace(/\.+/g,'.')
      // }
      // //console.log(block)
      // setPreviewTranscript(block)

      /* 
         setPreviewTranscript(transcript)      
      
      //Splitting the transcript so that all interview and interviewee statements are compiled together.
      let section = transcript.split('\n\n')
      let interviewBlock = []
      let intervieweeBlock = []
      for (let i = 0; i < section.length; i++) {
        let sectionSplit = section[i].split('\n')
        interviewBlock.push(reveiwing(sectionSplit[0]))
        intervieweeBlock.push(reveiwing(sectionSplit[1]))
      }
      setPreviewInterviewerTranscript(interviewBlock)
      setPreviewIntervieweeTranscript(intervieweeBlock)

      let split_transcript = transcript.split('\n')
      let flag = true; 
      let count = 0;
      for (let i = 0; i < split_transcript.length; i++) {
        if (split_transcript[i] !== '') {
          flag = flag && count % 2 === 0 ? split_transcript[i].split(":")[0] === interviewer : split_transcript[i].split(":")[0] === interviewee
          count++
        } else {
          continue
        }
      }
      if (flag === false) {
        setHelperText("Include the correct interviewer and interviewee labels.")
      }
    
    
    */

    }
  }

  return (
    <Container style={{ marginTop: 20 }}>
      <h2>Activity 1</h2>
      <form onSubmit={handleSubmit} noValidate autoComplete='off'>
        <Typography>Instructions: </Typography>
        <Typography>Use the text boxes below to provide the details of your interview transcript. After you fill in the boxes, click the Preview button to see how the transcript looks before proceeding to the next activity. If you would like to make any changes you can do so by editing the transcript text directly. Click the Submit button when you are satisfied with the look of your interview transcript. The final version of your transcript will be used in the next activity.</Typography>
        {sessionStorage.getItem("Occupation") == "Instructor" && <FormControlLabel style={{ marginTop: 10 }} control={<Switch checked={switchValue} onChange={() => setSwitchValue((prev) => !prev)} />} label="Predefined Interview Text" />}
        {sessionStorage.getItem("Occupation") == "Student" && transcriptEditable && <Typography style={{ marginTop: 10 }}>You are not allowed to edit the transcript in this template.</Typography>}
        <Button onClick={() => { localStorage.removeItem("userData"); localStorage.removeItem("clusteredData"); window.location.reload(false); }} sx={{ marginTop: 2 }} variant='outlined' fullWidth disabled>Reset</Button>
        <TextField margin='normal' label='Activity Description' value={activityDescription} fullWidth onChange={(e) => setActivityDescription(e.target.value)}></TextField>
        <TextField error={transcriptTitleError} margin='normal' value={transcriptTitle} label='Transcript title' fullWidth onChange={(e) => setTranscriptTitle(e.target.value)}></TextField>
        <TextField disabled={sessionStorage.getItem("Occupation") == "Student" && transcriptEditable} error={interviewerError} margin='normal' value={interviewer} fullWidth variant='outlined' label="Interviewer label (e.g. Interviewer)" onChange={(e) => setInterviewer(e.target.value)}></TextField>
        <TextField disabled={sessionStorage.getItem("Occupation") == "Student" && transcriptEditable} error={intervieweeError} margin='normal' value={interviewee} fullWidth variant='outlined' label="Interviewee label (e.g. Interviewee)" onChange={(e) => setInterviewee(e.target.value)}></TextField>
        <TextField disabled={sessionStorage.getItem("Occupation") == "Student" && transcriptEditable} helperText={helperText} error={transcriptError} margin='normal' value={transcript} rows={15} fullWidth multiline variant='outlined' label="Transcript" onChange={(e) => setTranscript(e.target.value)}></TextField>
        <Button onClick={handlePreview} sx={{ marginTop: 2 }} variant='outlined' fullWidth>Preview</Button>
        <Box sx={{ marginTop: 3, padding: 2, border: '1px solid black' }}>
          {/*
            {previewInterviewerTranscript.map((item)=>{
              return (
                <>
                   <Typography sx={{whiteSpace:pre-line}}>{item}{"\n"}</Typography>
                </>
              )
            })}
            <Typography sx={{whiteSpace:pre-line}}>{"\n"}</Typography>
            {previewIntervieweeTranscript.map((item)=>{
              return (
                <>
                   <Typography sx={{whiteSpace:pre-line}}>{item}{"\n"}</Typography>
                </>
              )
            })}
          */}

          {displayTranscript()}

        </Box>
        <Typography sx={{ marginTop: 3 }}>{previewClickedError}</Typography>
        <Button sx={{ marginTop: 3, marginBottom: 3 }} fullWidth type="submit" variant='outlined'>Submit</Button>
      </form>
    </Container>
  )
}

export default Act1