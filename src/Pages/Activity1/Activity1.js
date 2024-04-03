import { Box, Button, Container, FormControlLabel, Switch, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";
import TranscriptPreview from './TranscriptPreview';
import './Activity1.css'

const Activity1 = () => {
  const [interviewer, setInterviewer] = useState("");
  const [interviewee, setInterviewee] = useState("");
  const [transcript, setTranscript] = useState("");
  const [interviewerError, setInterviewerError] = useState(false);
  const [intervieweeError, setIntervieweeError] = useState(false);
  const [transcriptError, setTranscriptError] = useState(false);
  const [helperText, setHelperText] = useState("");
  const [previewTranscript, setPreviewTranscript] = useState({});
  const [previewClicked, setPreviewClicked] = useState(false);
  const [transcriptTitle, setTranscriptTitle] = useState("");
  const [label, setLabel] = useState("Activity 1 Label");
  const [instruction, setInstruction] = useState(`Use the text boxes below to provide the details of your interview transcript. After you fill in the boxes, click the Preview button to see how the transcript looks before proceeding to the next activity. If you would like to make any changes you can do so by editing the transcript text directly. Click the Submit button when you are satisfied with the look of your interview transcript. The final version of your transcript will be used in the next activity.`);
  const [previewClickedError, setPreviewClickedError] = useState("");
  const [notEditableTranscript, setNotEditableTranscript] = useState(false);
  const [instructor, setInstructor] = useState(false);
  const [newChain, setNewChain] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {

    // checks if id passed in the url is null
    if (id === "null") {
      alert("In order to access Activity 1, please initialise a chain of activities.");
      navigate("/")
    }

    // checks occupation of the user
    if (sessionStorage.getItem("Occupation") == "Instructor") {
      setInstructor(true);
    }

    // if valid id is passed, fetch data from activity one database and populate the variables accordingly
    if (id) {
      axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/activityone/byId/${id}`)
        .then((response) => {
          if (response.data) {
            if (response.data.transcript_source_id) {
              setTranscriptTitle(response.data.transcript_source_id);
            }
            if (response.data.content && Object.entries(response.data.content).length !== 0) {
              if (response.data.content[1].questioner_tag) {
                setInterviewer(response.data.content[1].questioner_tag);
              }
              if (response.data.content[2].response_tag) {
                setInterviewee(response.data.content[2].response_tag);
              }
            }
            if (response.data.transcriptEditable) {
              setNotEditableTranscript(response.data.transcriptEditable);
            }
            if (response.data.label) {
              setLabel(response.data.label);
            }
            if (response.data.instruction) {
              setInstruction(response.data.instruction);
            }
            if (response.data.content && Object.entries(response.data.content).length !== 0) {
              let transcriptText = "";
              Object.entries(response.data.content).map(([key, value]) => {
                if (value.questioner_tag !== undefined) {
                  if (transcriptText === "") {
                    transcriptText = transcriptText + value.questioner_tag + ": " + value.question_text;
                  } else {
                    transcriptText = transcriptText + "\n\n" + value.questioner_tag + ": " + value.question_text;
                  }
                } else {
                  transcriptText = transcriptText + "\n\n" + value.response_tag + ": ";
                  Object.entries(value.response_text).map(([key2, value2]) => {
                    transcriptText = transcriptText + value2.text;
                  });
                }
              });
              setTranscript(transcriptText);
            }
          }
        });
    }
  }, []);

  const validateInputs = () => {
    setHelperText('');
    setPreviewClickedError('');
    setInterviewerError(false);
    setIntervieweeError(false);
    setTranscriptError(false);

    let flag = false;
    if (!interviewer) {
      setInterviewerError(true);
      flag = true;
    }
    if (!interviewee) {
      setIntervieweeError(true);
      flag = true;
    }
    if (!transcript) {
      setTranscriptError(true);
      flag = true;
    }

    return !flag ? true : false;
  }

  // submission of activity one
  const handleSubmit = async (e) => {
   
    e.preventDefault()

    let transcript_source_id = transcriptTitle;
    let activity_mvc_content = {};

    if (transcript) {
      setPreviewClickedError("");
      if (previewClicked === false) {
        setPreviewClickedError("Please click on the preview button to view the transcript before submitting.");
        return;
      }

      Object.entries(previewTranscript).map(([key, value]) => {
        if (value.questioner_tag !== undefined) {
          activity_mvc_content[key] = getActivityMVC(key);
        } else {
          activity_mvc_content[key] = {};
          Object.entries(previewTranscript[key].response_text).map(
            ([key2, value]) => {
              activity_mvc_content[key][key2] = getActivityMVC(
                key.toString() + key2.toString()
              );
            }
          );
        }
      });

    }

    let final_data = {
      transcript_source_id: transcript_source_id,
      content: previewTranscript,
      UserId: sessionStorage.getItem("UserId"),
      transcriptEditable: notEditableTranscript,
      label: document.getElementById("activity-one-label").innerHTML,
      instruction: document.getElementById("activity-one-instruction").innerHTML,
      activity_mvc: activity_mvc_content,
    };

    let event;

    // if id parameter exists
    
    if (id) {
      await axios.post(`https://activities-alset-aef528d2fd94.herokuapp.com/activityone/byId/${id}`, final_data);
      // creation of a new chain of activities

      if (newChain) {
        await axios.post(`https://activities-alset-aef528d2fd94.herokuapp.com/activityone/byId/${sessionStorage.getItem("ActivitiesId")}/new-chain`);
        sessionStorage.removeItem("ActivityTwoId");
        sessionStorage.removeItem("ActivityThreeId");
        sessionStorage.removeItem("ActivityFourId");
        sessionStorage.removeItem("ActivityFiveId");
        sessionStorage.removeItem("ActivitySixId");

        event = "Reinitialise"
      } else {
        // updating existing activity one

        event = "Update"
      }
    } else {
      // creating a new instance of activity one
    
      await axios.post("https://activities-alset-aef528d2fd94.herokuapp.com/activityone",final_data)
        .then((response) => {
          const ActivitiesID = response.data.ActivitiesId.id;
          const ActivityOneId = response.data.ActivityOneId;
          sessionStorage.setItem("ActivitiesId", ActivitiesID);
          sessionStorage.setItem("ActivityOneId", ActivityOneId);
        });

        event = "Create"
    }

    if (!instructor) {
        let data = {
          DateTime: Date.now(),
          StudentTemplateId: sessionStorage.getItem("ActivitiesId"),
          StudentId: sessionStorage.getItem("UserId"),
          Event: event,
          ActivityId: sessionStorage.getItem("ActivityOneId"),
          ActivityType: "Activity 1",
        };
        await axios.post(`https://activities-alset-aef528d2fd94.herokuapp.com/studentlog/create`,data);
      } else {
        let data = {
          DateTime: Date.now(),
          ActivitySequenceId: sessionStorage.getItem("ActivitiesId"),
          InstructorId: sessionStorage.getItem("UserId"),
          Event: event,
          ActivityId: sessionStorage.getItem("ActivityOneId"),
          ActivityType: "Activity 1",
        };
        await axios.post(`https://activities-alset-aef528d2fd94.herokuapp.com/instructorlog/create`,data);
      }

    if (sessionStorage.getItem("ActivityTwoId") !== "null" && sessionStorage.getItem("ActivityTwoId") !== null && sessionStorage.getItem("ActivityTwoId") !== "undefined") {
      navigate(`/activitytwo/${sessionStorage.getItem("ActivityTwoId")}`);
    } else {
      navigate("/activitytwo");
    }
  };

  // gets activity mvc of each of the sentences
  const getActivityMVC = (value) => {
    const element = document.querySelector(`[id="${value}"]`);
    if (element) {
      const htmlContent = element.outerHTML;
      const inlineStyles = element.getAttribute("style") || "No inline styles";
      return { html: htmlContent, css: inlineStyles };
    } else {
      alert("Element not found");
      return undefined;
    }
  };

  const handlePreviewData = (result) => {
    if (result.error) {
      setHelperText(result.error);
      setPreviewTranscript({}); 
    } else {
      setPreviewTranscript(result.data);
      setHelperText('');
    }
  };

  return (
    <Container className="container">
      <div className="header">
        <h2 dangerouslySetInnerHTML={{ __html: ` ${label}` }} contentEditable="true" id="activity-one-label"></h2>
        <Button onClick={() => {window.location.reload();}} className="reset-btn">
          Reset
        </Button>
      </div>
      <form onSubmit={handleSubmit} noValidate autoComplete="off">
        <Typography id="activity-one-instruction" dangerouslySetInnerHTML={{ __html: ` ${instruction}` }} contentEditable={instructor && true} className="instructions"></Typography>
        
        {/* displays toggle button to instructors only for selecting whether trascript is editable */}
        {instructor && (<FormControlLabel className="switch-label" 
            control={
              <Switch checked={notEditableTranscript} onChange={() => setNotEditableTranscript((prev) => !prev)} />
            }
            label="Standardised Script"
          />
        )}
        <FormControlLabel className="switch-label"
          control={
            <Switch checked={newChain} onChange={() => {
                if (!newChain) {
                  // eslint-disable-next-line no-restricted-globals
                  if (confirm("Caution: Data associated with the next five activities in this sequence will be permanently deleted")) {
                    setNewChain((prev) => !prev);
                  }
                } else {
                  setNewChain((prev) => !prev);
                }
              }}
            />
          }
          label="Re-initialise Activity 1 and subsequent activites"
        />
        
        {/* shows to students whether transcript is editable */}
        {!instructor && notEditableTranscript && (
          <Typography className="switch-label">The transcript is not editable in this template.</Typography>
        )}
        <TextField
          margin="normal"
          value={transcriptTitle}
          label="Transcript title"
          fullWidth
          onChange={(e) => setTranscriptTitle(e.target.value)}
        ></TextField>
        <TextField
          disabled={!instructor && notEditableTranscript}
          error={interviewerError}
          margin="normal"
          value={interviewer}
          fullWidth
          variant="outlined"
          label="Interviewer label (e.g. Interviewer)"
          onChange={(e) => setInterviewer(e.target.value)}
        ></TextField>
        <TextField
          disabled={!instructor && notEditableTranscript}
          error={intervieweeError}
          margin="normal"
          value={interviewee}
          fullWidth
          variant="outlined"
          label="Interviewee label (e.g. Interviewee)"
          onChange={(e) => setInterviewee(e.target.value)}
        ></TextField>
        <TextField
          disabled={!instructor && notEditableTranscript}
          helperText={helperText}
          error={transcriptError}
          margin="normal"
          value={transcript}
          rows={15}
          fullWidth
          multiline
          variant="outlined"
          label="Transcript"
          onChange={(e) => setTranscript(e.target.value)}
        ></TextField>
        <Button onClick={() => {setPreviewClicked(true); if (!instructor) {validateInputs()}}} className="preview-btn" variant="outlined" fullWidth>
          Preview
        </Button>
        <Box className="preview-box">
          {!previewClicked && <Typography align="center">Please click the 'Preview' button to view the transcript</Typography>}
          {previewClicked && <TranscriptPreview interviewer={interviewer} interviewee={interviewee} transcript={transcript} onPreviewGenerated={handlePreviewData}/>}
        </Box>
        <Typography sx={{ marginTop: previewClickedError ? 3 : 1 }}>
          {previewClickedError}
        </Typography>
        <Button className="submit-btn" fullWidth type="submit" variant="outlined">
          Submit
        </Button>
      </form>
    </Container>
  );
};

export default Activity1;