import {
  Box,
  Button,
  Container,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";

const Act1 = () => {
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
  const [instruction, setInstruction] = useState(
    `Use the text boxes below to provide the details of your interview transcript. After you fill in the boxes, click the Preview button to see how the transcript looks before proceeding to the next activity. If you would like to make any changes you can do so by editing the transcript text directly. Click the Submit button when you are satisfied with the look of your interview transcript. The final version of your transcript will be used in the next activity.`
  );
  const [transcriptTitleError, setTranscriptTitleError] = useState(false);
  const [previewClickedError, setPreviewClickedError] = useState("");
  const [switchValue, setSwitchValue] = useState(false);
  const [transcriptEditable, setTranscriptEditable] = useState(false);
  const [instructor, setInstructor] = useState(false);
  const [newChain, setNewChain] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id === "null") {
      alert("Please create an activity chain first.");
    }

    if (sessionStorage.getItem("Occupation") == "Instructor") {
      setInstructor(true);
    }

    if (id) {
      axios
        .get(
          `https://activities-alset-aef528d2fd94.herokuapp.com/activityone/byId/${id}`
        )
        .then((response) => {
          if (response.data !== null) {
            //setActivityDescription(response.data.activity_description)
            if (response.data.transcript_source_id !== null) {
              setTranscriptTitle(response.data.transcript_source_id);
            }
            console.log(response.data.content);
            if (
              response.data.content !== null &&
              response.data.content !== "" &&
              Object.entries(response.data.content).length !== 0
            ) {
              if (response.data.content[1].questioner_tag !== null) {
                setInterviewer(response.data.content[1].questioner_tag);
              }
              if (response.data.content[2].response_tag !== null) {
                setInterviewee(response.data.content[2].response_tag);
              }
            }
            if (response.data.transcriptEditable !== null) {
              setTranscriptEditable(response.data.transcriptEditable);
              setSwitchValue(response.data.transcriptEditable);
            }
            setLabel(response.data.label);
            setInstruction(response.data.instruction);

            if (
              response.data.content !== null &&
              response.data.content !== "" &&
              Object.entries(response.data.content).length !== 0
            ) {
              let transcriptText = "";
              Object.entries(response.data.content).map(([key, value]) => {
                if (value.questioner_tag !== undefined) {
                  if (transcriptText === "") {
                    transcriptText =
                      transcriptText +
                      value.questioner_tag +
                      ": " +
                      value.question_text;
                  } else {
                    transcriptText =
                      transcriptText +
                      "\n\n" +
                      value.questioner_tag +
                      ": " +
                      value.question_text;
                  }
                } else {
                  transcriptText =
                    transcriptText + "\n\n" + value.response_tag + ": ";
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

  const WordCount = (str) => {
    return str.split(" ").length;
  };

  // displays the preview of the transcript
  const handlePreview = () => {
    const cleaning = (text) => {
      //tabs are replaced by single space
      text = text.replace(/\s{4}/g, "");
      //multiple spaces are replaced by single space
      text = text.replace(/\s\s+/g, "");
      //multiple fullstops are replaced by a single fullstop
      text = text.replace(/\.+/g, ".");
      //?. is replaced by ?
      text = text.replace(/\?\./g, "?");
      //. . is replaced by .
      text = text.replace(/\. \./g, ". ");
      return text;
    };

    setPreviewTranscript("");
    setHelperText("");
    setPreviewClickedError("");
    setInterviewerError(false);
    setIntervieweeError(false);
    setTranscriptError(false);
    let flag = false;
    if (interviewer === "") {
      setInterviewerError(true);
      flag = true;
    }
    if (interviewee === "") {
      setIntervieweeError(true);
      flag = true;
    }
    if (transcript === "") {
      setTranscriptError(true);
      flag = true;
    }
    if (flag) {
      return;
    } else {
      let data = {};
      let lines = transcript.split(/\s*(?<=[.!?;])\s*|\n+/g);

      const check1 = new RegExp(`${interviewer}`, "g");
      const check2 = new RegExp(`${interviewee}`, "g");

      function splitFirstOccurrence(str, separator) {
        const [first, ...rest] = str.split(separator);

        const remainder = rest.join(":");

        return [first.trim(), remainder.trim()];
      }

      let flag = true;
      for (let i = 0; i < lines.length; i++) {
        let line_splitting = splitFirstOccurrence(lines[i], ":");
        if (
          lines[i] !== "" &&
          line_splitting[1] !== "" &&
          WordCount(line_splitting[0]) === 1
        ) {
          flag =
            flag &&
            (line_splitting[0] === interviewer ||
              line_splitting[0] === interviewee);
        }
      }

      if (flag === false) {
        setHelperText(
          "Include the correct interviewer and interviewee labels."
        );
        return;
      }
      if (flag === false) {
        setHelperText(
          "Include the correct interviewer and interviewee labels."
        );
        return;
      }

      //putting content into an object
      let count = 1;
      let interviewCount = 1;
      let intervieweeCount = 1;
      let interviewFlag = false;
      let intervieweeFlag = false;
      let intervieeeLinesCount = 0;

      for (let i = 0; i < lines.length; i++) {
        lines[i] = cleaning(lines[i]);
        if (lines[i].split(":")[0].match(check1) !== null) {
          data[count] = {
            sentence_num: count,
            question_id: interviewCount,
            questioner_tag: interviewer,
            question_text: splitFirstOccurrence(lines[i], ":")[1],
          };
          count++;
          interviewFlag = true;
          intervieweeFlag = false;
          interviewCount++;
        } else if (lines[i].split(":")[0].match(check2) !== null) {
          data[count] = {
            sentence_num: count,
            response_id: interviewCount - 1,
            response_tag: interviewee,
            response_text: {},
          };

          intervieeeLinesCount = 1;
          data[count].response_text[intervieeeLinesCount] = {
            text: splitFirstOccurrence(lines[i], ":")[1],
          };
          interviewFlag = false;
          intervieweeFlag = true;
          count++;
          intervieweeCount++;
          intervieeeLinesCount++;
        } else if (lines[i] !== "" && lines[i] !== "\n") {
          if (interviewFlag === true && lines[i] !== "?") {
            data[count - 1].question_text = cleaning(
              data[count - 1].question_text + ". " + lines[i]
            );
          } else if (interviewFlag === true && lines[i] === "?") {
            data[count - 1].question_text = cleaning(
              data[count - 1].question_text + lines[i]
            );
          } else {
            data[count - 1].response_text[intervieeeLinesCount] = {
              text: cleaning(lines[i]),
            };
            intervieeeLinesCount++;
          }
        }
      }

      console.log("before putting in");
      console.log(data);

      setPreviewClicked(true);
      setPreviewTranscript(data);
    }
  };

  // display interviewee text
  const displayIntervieweeText = (value, name, key_ori) => {
    {
      return Object.entries(value).map(([key, value]) => {
        return (
          <Typography id={key_ori + key} style={{ display: "inline" }}>
            {value.text}{" "}
          </Typography>
        );
      });
    }
  };

  // displays transcript
  const displayTranscript = () => {
    {
      console.log("display transcript");
    }
    {
      console.log(previewTranscript);
    }
    if (Object.keys(previewTranscript).length === 0) {
      return (
        <>
          <Typography align="center">
            Please click the 'Preview' button to view the transcript
          </Typography>
        </>
      );
    } else {
      return Object.entries(previewTranscript).map(([key, value]) => {
        if (value.questioner_tag !== undefined) {
          {
            console.log(value.question_text);
          }
          return (
            <div key={key}>
              <Typography display="inline">{value.questioner_tag}: </Typography>
              <Typography display="inline" id={key}>
                {value.question_text}
              </Typography>
              <br />
              <br />
            </div>
          );
        } else {
          return (
            <>
              <div key={key}>
                <Typography display="inline">{value.response_tag}: </Typography>
                {displayIntervieweeText(
                  value.response_text,
                  value.response_tag,
                  key.toString()
                )}
              </div>
              <div>
                <br />
              </div>
            </>
          );
        }
      });
    }
  };

  // submission of activity one
  const handleSubmit = async (e) => {
    if (transcript) {
      setPreviewClickedError("");
      if (previewClicked === false) {
        setPreviewClickedError(
          "Please click on the preview button to view the transcript before submitting."
        );
        return;
      }
    }

    !instructor &&
      setInterviewerError(false) &&
      setPreviewClickedError("") &&
      setTranscriptError(false) &&
      setTranscriptTitleError(false);
    setTranscriptTitleError(false);
    e.preventDefault();
    let flag = false;
    if (!instructor) {
      if (previewClicked === false) {
        setPreviewClickedError(
          "Please click on the preview button to view the transcript before submitting."
        );
        flag = true;
      }
      if (interviewer === "") {
        setInterviewerError(true);
        flag = true;
      }
      if (interviewee === "") {
        setIntervieweeError(true);
        flag = true;
      }
      if (transcript === "") {
        setTranscriptError(true);
        flag = true;
      }
    }

    if (transcriptTitle === "") {
      setTranscriptTitleError(true);
      flag = true;
    }
    if (flag) {
      return;
    }

    let transcript_source_id = transcriptTitle;
    let activity_mvc_content = {};

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

    let final_data = {
      // activity_description: activityDescription,
      transcript_source_id: transcript_source_id,
      content: previewTranscript,
      UserId: sessionStorage.getItem("UserId"),
      transcriptEditable: instructor ? switchValue : null,
      label: document.getElementById("activity-one-label").innerHTML,
      instruction: document.getElementById("activity-one-instruction")
        .innerHTML,
      activity_mvc: activity_mvc_content,
    };

    console.log("final data");
    console.log(final_data);

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
      await axios.post(
        `https://activities-alset-aef528d2fd94.herokuapp.com/activityone/byId/${id}`,
        final_data
      );

      if (newChain) {
        await axios.post(
          `https://activities-alset-aef528d2fd94.herokuapp.com/activityone/byId/${sessionStorage.getItem(
            "ActivitiesId"
          )}/new-chain`
        );
        sessionStorage.removeItem("ActivityTwoId");
        sessionStorage.removeItem("ActivityThreeId");
        sessionStorage.removeItem("ActivityFourId");
        sessionStorage.removeItem("ActivityFiveId");
        sessionStorage.removeItem("ActivitySixId");

        if (!instructor) {
          let data = {
            DateTime: Date.now(),
            StudentTemplateId: sessionStorage.getItem("ActivitiesId"),
            StudentId: sessionStorage.getItem("UserId"),
            Event: "Reinitialise",
            ActivityId: sessionStorage.getItem("ActivityOneId"),
            ActivityType: "Activity 1",
          };
          await axios.post(
            `https://activities-alset-aef528d2fd94.herokuapp.com/studentlog/create`,
            data
          );
        } else {
          let data = {
            DateTime: Date.now(),
            ActivitySequenceId: sessionStorage.getItem("ActivitiesId"),
            InstructorId: sessionStorage.getItem("UserId"),
            Event: "Reinitialise",
            ActivityId: sessionStorage.getItem("ActivityOneId"),
            ActivityType: "Activity 1",
          };
          await axios.post(
            `https://activities-alset-aef528d2fd94.herokuapp.com/instructorlog/create`,
            data
          );
        }
      } else {
        if (!instructor) {
          let data = {
            DateTime: Date.now(),
            StudentTemplateId: sessionStorage.getItem("ActivitiesId"),
            StudentId: sessionStorage.getItem("UserId"),
            Event: "Update",
            ActivityId: sessionStorage.getItem("ActivityOneId"),
            ActivityType: "Activity 1",
          };
          await axios.post(
            `https://activities-alset-aef528d2fd94.herokuapp.com/studentlog/create`,
            data
          );
        } else {
          let data = {
            DateTime: Date.now(),
            ActivitySequenceId: sessionStorage.getItem("ActivitiesId"),
            InstructorId: sessionStorage.getItem("UserId"),
            Event: "Update",
            ActivityId: sessionStorage.getItem("ActivityOneId"),
            ActivityType: "Activity 1",
          };
          await axios.post(
            `https://activities-alset-aef528d2fd94.herokuapp.com/instructorlog/create`,
            data
          );
        }
      }
    } else {
      await axios
        .post(
          "https://activities-alset-aef528d2fd94.herokuapp.com/activityone",
          final_data
        )
        .then((response) => {
          const ActivitiesID = response.data.ActivitiesId.id;
          const ActivityOneId = response.data.ActivityOneId;
          sessionStorage.setItem("ActivitiesId", ActivitiesID);
          sessionStorage.setItem("ActivityOneId", ActivityOneId);
        });

      if (!instructor) {
        let data = {
          DateTime: Date.now(),
          StudentTemplateId: sessionStorage.getItem("ActivitiesId"),
          StudentId: sessionStorage.getItem("UserId"),
          Event: "Create",
          ActivityId: sessionStorage.getItem("ActivityOneId"),
          ActivityType: "Activity 1",
        };
        await axios.post(
          `https://activities-alset-aef528d2fd94.herokuapp.com/studentlog/create`,
          data
        );
      } else {
        let data = {
          DateTime: Date.now(),
          ActivitySequenceId: sessionStorage.getItem("ActivitiesId"),
          InstructorId: sessionStorage.getItem("UserId"),
          Event: "Create",
          ActivityId: sessionStorage.getItem("ActivityOneId"),
          ActivityType: "Activity 1",
        };
        await axios.post(
          `https://activities-alset-aef528d2fd94.herokuapp.com/instructorlog/create`,
          data
        );
      }
    }

    if (
      sessionStorage.getItem("ActivityTwoId") !== "null" &&
      sessionStorage.getItem("ActivityTwoId") !== null
    ) {
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

  const onReset = () => {
    // setActivityDescription("")
    // setTranscriptTitle("")
    // { !transcriptEditable || instructor && setInterviewer("") }
    // { !transcriptEditable || instructor && setInterviewee("") }
    // { instructor && setTranscriptEditable(false) }
    // { instructor && setSwitchValue(false) }
    // { !transcriptEditable || instructor && setTranscript("") }
    // setLabel("Activity 1 Label")
    // { instructor && setInstruction("") }
    window.location.reload();
  };

  return (
    <Container style={{ marginTop: 20 }}>
      <div
        style={{
          display: "flex",
          direction: "row",
          fontFamily: `"Lato", sans-serif`,
        }}
      >
        {/* <h2>Activity 1:</h2>&nbsp;&nbsp; */}
        <h2
          dangerouslySetInnerHTML={{ __html: ` ${label}` }}
          contentEditable="true"
          style={{
            minHeight: 1,
            borderRight: "solid rgba(0,0,0,0) 1px",
            outline: "none",
          }}
          id="activity-one-label"
        ></h2>
        <Button
          onClick={() => {
            onReset();
          }}
          sx={{
            marginLeft: "auto",
            "&.MuiButtonBase-root:hover": {
              bgcolor: "transparent",
            },
          }}
        >
          Reset
        </Button>
      </div>
      <form onSubmit={handleSubmit} noValidate autoComplete="off">
        {/* <Typography style={{fontFamily:`"Lato", sans-serif`}}>Instructions: </Typography> */}
        <Typography
          id="activity-one-instruction"
          dangerouslySetInnerHTML={{ __html: ` ${instruction}` }}
          contentEditable={instructor && true}
          style={{
            minHeight: 1,
            borderRight: "solid rgba(0,0,0,0) 1px",
            outline: "none",
            fontFamily: `"Lato", sans-serif`,
            fontSize: 17,
          }}
        ></Typography>
        {instructor && (
          <FormControlLabel
            style={{ marginTop: 10 }}
            control={
              <Switch
                checked={switchValue}
                onChange={() => setSwitchValue((prev) => !prev)}
              />
            }
            label="Standardised Script"
          />
        )}
        <FormControlLabel
          style={{ marginTop: 10 }}
          control={
            <Switch
              checked={newChain}
              onChange={() => {
                if (!newChain) {
                  alert(
                    "Caution: Data associated with the next five activities in this sequence will be permanently deleted"
                  );
                }
                setNewChain((prev) => !prev);
              }}
            />
          }
          label="Re-initialise Activity 1 and subsequent activites"
        />
        {!instructor && transcriptEditable && (
          <Typography style={{ marginTop: 10 }}>
            The transcript is not editable in this template.
          </Typography>
        )}
        {/* <Button onClick={() => { onReset() }} sx={{ marginTop: 2 }} variant='outlined' fullWidth>Reset</Button> */}
        <TextField
          error={transcriptTitleError}
          margin="normal"
          value={transcriptTitle}
          label="Transcript title"
          fullWidth
          onChange={(e) => setTranscriptTitle(e.target.value)}
        ></TextField>
        <TextField
          disabled={!instructor && transcriptEditable}
          error={interviewerError}
          margin="normal"
          value={interviewer}
          fullWidth
          variant="outlined"
          label="Interviewer label (e.g. Interviewer)"
          onChange={(e) => setInterviewer(e.target.value)}
        ></TextField>
        <TextField
          disabled={!instructor && transcriptEditable}
          error={intervieweeError}
          margin="normal"
          value={interviewee}
          fullWidth
          variant="outlined"
          label="Interviewee label (e.g. Interviewee)"
          onChange={(e) => setInterviewee(e.target.value)}
        ></TextField>
        <TextField
          disabled={!instructor && transcriptEditable}
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
        <Button
          onClick={handlePreview}
          sx={{ marginTop: 2 }}
          variant="outlined"
          fullWidth
        >
          Preview
        </Button>
        <Box
          sx={{
            marginTop: 3,
            padding: 2,
            border: "1px solid black",
            borderRadius: 2,
          }}
        >
          {displayTranscript()}
        </Box>
        <Typography sx={{ marginTop: previewClickedError ? 3 : 1 }}>
          {previewClickedError}
        </Typography>
        <Button
          sx={{ marginTop: 1, marginBottom: 3 }}
          fullWidth
          type="submit"
          variant="outlined"
        >
          Submit
        </Button>
      </form>
    </Container>
  );
};

export default Act1;
