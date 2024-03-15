import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  ButtonGroup,
  Container,
  Divider,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  StepLabel,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Home() {
  const [listOfActivities, setListOfActivities] = useState({});
  const [listOfActivitiesInstructor, setListOfActivitiesInstructor] = useState(
    {}
  );
  const [instructor, setInstructor] = useState(false);
  const [switchValues, setSwitchValues] = useState({});
  const [AllowMLModel, setAllowMLModel] = useState({});
  const [MLModel, setMLModel] = useState({});
  const [predefinedMLSelection, setPredefinedMLSelection] = useState({});
  const [transcriptError, setTranscriptError] = useState({});
  const [helperText, setHelperText] = useState({});
  const [transcript, setTranscript] = useState({});
  const [MLClusters, setMLClusters] = useState({});
  const [listOfActivitiesStudents, setListOfActivitiesStudents] = useState({});
  const [activityTitle, setActivityTitle] = useState({});
  const [predefinedHighlighting, setPredefinedHighlighting] = useState({});
  const [activityTitleInstructor, setActivityTitleInstructor] = useState({});
  const [activityTitleStudent, setActivityTitleStudent] = useState({});
  const [activityLabel, setActivityLabel] = useState({});
  const [activityInstruction, setActivityInstruction] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // checks whether the occupation of the current user is instructor
    if (sessionStorage.getItem("Occupation") === "Instructor") {
      setInstructor(true);
    }
    if (sessionStorage.getItem("Occupation") == "Instructor") {
      // gets a list of all activities created by students
      axios
        .get(
          "https://activities-alset-aef528d2fd94.herokuapp.com/home/students"
        )
        .then((response) => {
          if (response.data != null) {
            Object.entries(response.data).map((data) => {
              axios
                .post(
                  "https://activities-alset-aef528d2fd94.herokuapp.com/home",
                  { UserId: parseInt(data[1].id) }
                )
                .then((response) => {
                  if (response.data != null) {
                    const final = response.data;
                    setListOfActivitiesStudents((prevValues) => ({
                      ...prevValues,
                      [data[1].id]: final,
                    }));
                    Object.entries(response.data).map((data) => {
                      if (data[1].ActivityOneId) {
                        axios
                          .get(
                            `https://activities-alset-aef528d2fd94.herokuapp.com/activityone/byId/${parseInt(
                              data[1].ActivityOneId
                            )}`
                          )
                          .then((response) => {
                            setActivityTitleStudent((prevValues) => ({
                              ...prevValues,
                              [data[1].ActivityOneId]:
                                response.data.transcript_source_id,
                            }));
                          });
                      }
                    });
                  }
                });
            });
          }
        });
    } else {
      // gets a list of all activities created by instructors
      axios
        .get(
          "https://activities-alset-aef528d2fd94.herokuapp.com/home/instructors"
        )
        .then((response) => {
          if (response.data !== null) {
            Object.entries(response.data).map((data) => {
              axios
                .post(
                  "https://activities-alset-aef528d2fd94.herokuapp.com/home",
                  { UserId: parseInt(data[1].id) }
                )
                .then((response) => {
                  if (response.data != null) {
                    const final = response.data;
                    setListOfActivitiesInstructor((prevValues) => ({
                      ...prevValues,
                      [data[1].id]: final,
                    }));
                    Object.entries(response.data).map((data) => {
                      if (data[1].ActivityOneId) {
                        axios
                          .get(
                            `https://activities-alset-aef528d2fd94.herokuapp.com/activityone/byId/${parseInt(
                              data[1].ActivityOneId
                            )}`
                          )
                          .then((response) => {
                            setActivityTitleInstructor((prevValues) => ({
                              ...prevValues,
                              [data[1].ActivityOneId]:
                                response.data.transcript_source_id,
                            }));
                          });
                      }
                    });
                  }
                });
            });
          }
        });
    }

    // gets a list of activities created by the user
    const UserId = sessionStorage.getItem("UserId");
    axios
      .post("https://activities-alset-aef528d2fd94.herokuapp.com/home", {
        UserId: UserId,
      })
      .then((response) => {
        setListOfActivities(response.data);
        let ActivityOneCount = -1;
        let ActivityTwoCount = -1;
        let ActivityThreeCount = -1;
        let ActivityFourCount = -1;
        let ActivityFiveCount = -1;
        let ActivitySixCount = -1;
        Object.entries(response.data).map((data) => {
          ActivityOneCount++;
          ActivityTwoCount++;
          ActivityThreeCount++;
          ActivityFourCount++;
          ActivityFiveCount++;
          ActivitySixCount++;
          if (data[1].ActivityOneId != null) {
            axios
              .get(
                `https://activities-alset-aef528d2fd94.herokuapp.com/activityone/byId/${parseInt(
                  data[1].ActivityOneId
                )}`
              )
              .then((response) => {
                if (sessionStorage.getItem("Occupation") === "Instructor") {
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
                      Object.entries(value.response_text).map(
                        ([key2, value2]) => {
                          transcriptText = transcriptText + value2.text;
                        }
                      );
                    }
                  });
                  setTranscript((prevValues) => ({
                    ...prevValues,
                    [data[1].ActivityOneId]: transcriptText,
                  }));
                }
                setActivityTitle((prevValues) => ({
                  ...prevValues,
                  [data[1].ActivityOneId]: response.data.transcript_source_id,
                }));
                setSwitchValues((prevValues) => ({
                  ...prevValues,
                  [data[1].ActivityOneId]: response.data.transcriptEditable,
                }));
                if (response.data.label) {
                  setActivityLabel((prevValues) => ({
                    ...prevValues,
                    [1 + data[1].ActivityOneId.toString()]: response.data.label,
                  }));
                }
                if (response.data.instruction) {
                  setActivityInstruction((prevValues) => ({
                    ...prevValues,
                    [1 + data[1].ActivityOneId.toString()]:
                      response.data.instruction,
                  }));
                }
              });
          } else {
            const value = 1 + ActivityOneCount.toString();
            setActivityLabel((prevValues) => ({
              ...prevValues,
              [value]: "Custom Text",
            }));
            setActivityInstruction((prevValues) => ({
              ...prevValues,
              [value]:
                "Use the text boxes below to provide the details of your interview transcript. After you fill in the boxes, click the Preview button to see how the transcript looks before proceeding to the next activity. If you would like to make any changes you can do so by editing the transcript text directly. Click the Submit button when you are satisfied with the look of your interview transcript. The final version of your transcript will be used in the next activity.",
            }));
          }
          if (data[1].ActivityTwoId != null) {
            axios
              .get(
                `https://activities-alset-aef528d2fd94.herokuapp.com/activitytwo/byId/${parseInt(
                  data[1].ActivityTwoId
                )}`
              )
              .then((response) => {
                if (sessionStorage.getItem("Occupation") === "Instructor") {
                  setPredefinedHighlighting((prevValues) => ({
                    ...prevValues,
                    [data[1].ActivityTwoId]:
                      response.data.predefinedHighlighting,
                  }));
                }
                if (response.data.label) {
                  setActivityLabel((prevValues) => ({
                    ...prevValues,
                    [2 + data[1].ActivityTwoId.toString()]: response.data.label,
                  }));
                }
                if (response.data.instruction) {
                  setActivityInstruction((prevValues) => ({
                    ...prevValues,
                    [2 + data[1].ActivityTwoId.toString()]:
                      response.data.instruction,
                  }));
                }
              });
          } else {
            const value = 2 + ActivityTwoCount.toString();
            setActivityLabel((prevValues) => ({
              ...prevValues,
              [value]: "Custom Text",
            }));
            setActivityInstruction((prevValues) => ({
              ...prevValues,
              [value]: `Read through the transcript and click on sentences from the <strong>interviewee</strong> that you think provide insights or convey important information. Clicking a sentence will highlight it in yellow. Clicking a highlighted sentence again will unhighlight it. When you are satisfied with your sentence selections, click the Submit button to continue to the next activity. Your choices of which sentences to highlight will be carried forward to the next activity.`,
            }));
          }
          if (data[1].ActivityThreeId !== null) {
            axios
              .get(
                `https://activities-alset-aef528d2fd94.herokuapp.com/activitythree/byId/${parseInt(
                  data[1].ActivityThreeId
                )}`
              )
              .then((response) => {
                if (sessionStorage.getItem("Occupation") === "Instructor") {
                  setMLModel((prevValues) => ({
                    ...prevValues,
                    [data[1].ActivityThreeId]: response.data.MLModel,
                  }));
                  setAllowMLModel((prevValues) => ({
                    ...prevValues,
                    [data[1].ActivityThreeId]: response.data.AllowMLModel,
                  }));
                  setPredefinedMLSelection((prevValues) => ({
                    ...prevValues,
                    [data[1].ActivityThreeId]:
                      response.data.predefinedMLSelection,
                  }));
                }
                if (response.data.label) {
                  setActivityLabel((prevValues) => ({
                    ...prevValues,
                    [3 + data[1].ActivityThreeId.toString()]:
                      response.data.label,
                  }));
                }
                if (response.data.instruction) {
                  setActivityInstruction((prevValues) => ({
                    ...prevValues,
                    [3 + data[1].ActivityThreeId.toString()]:
                      response.data.instruction,
                  }));
                }
              });
          } else {
            const value = 3 + ActivityThreeCount.toString();
            setActivityLabel((prevValues) => ({
              ...prevValues,
              [value]: "Custom Text",
            }));
            setActivityInstruction((prevValues) => ({
              ...prevValues,
              [value]: `<Typography>The transcript you submitted was passed through an AI model trained to identify important sentences. The model’s sentence selection was then compared with yours. The sentences you and the model both selected are now highlighted in green. Sentences that the model classified as being important but you did not are highlighted in blue. Sentences you selected as being important but the model did not are highlighted in yellow.</Typography>
                        <br /> <br/>
                        <Typography>Please review the version of your transcript with the new highlights below. You’ll likely agree with some of the sentence selections and disagree with others. As you review the transcript, feel free to refine your sentence selections. When you are satisfied with your selections, click the Submit button to continue to the next activity. Only your choices about which sentences are important (yellow and green highlights) will be used in the next activity.</Typography>
                        <br /> <br/>
                        <Typography>You can refer to the following key to remind yourself of what the three colours mean.</Typography>
                        <ul style={{ marginTop: 0 }}>
                            <li><Typography>Only the model selected - blue</Typography></li>
                            <li><Typography>Only you selected - yellow</Typography></li>
                            <li><Typography>Both you and the model selected - green</Typography></li>
                        </ul>

                    `,
            }));
          }

          if (data[1].ActivityFourId != null) {
            axios
              .get(
                `https://activities-alset-aef528d2fd94.herokuapp.com/activityfour/byId/${parseInt(
                  data[1].ActivityFourId
                )}`
              )
              .then((response) => {
                if (response.data.label) {
                  setActivityLabel((prevValues) => ({
                    ...prevValues,
                    [4 + data[1].ActivityFourId.toString()]:
                      response.data.label,
                  }));
                }
                if (response.data.instruction) {
                  setActivityInstruction((prevValues) => ({
                    ...prevValues,
                    [4 + data[1].ActivityFourId.toString()]:
                      response.data.instruction,
                  }));
                }
              });
          } else {
            const value = 4 + ActivityFourCount.toString();
            setActivityLabel((prevValues) => ({
              ...prevValues,
              [value]: "Custom Text",
            }));
            setActivityInstruction((prevValues) => ({
              ...prevValues,
              [value]: `
                        <Typography>The sentences you selected in the previous activity have been arranged on the left side of the pane below. Use the space below to cluster the sentences into themes by arranging the sentences that go together near each other. It’s okay if the sentences in a cluster overlap a bit.</Typography>
                        <br />
                        <br />
                        <Typography>You can then name the cluster by clicking the Add Label button to create a new text box. You can edit the label text by clicking on its text. You can drag the label anywhere in the clustering area by clicking and holding the label area. You can remove a label from the clustering area by deleting all of its text.</Typography>
                        <br />
                        <br />
                        <Typography>Once you are satisfied with your clusters and their labels, you can save everything by clicking the Submit button. Once submitted, your clusters and labels will be used in the next activity.</Typography>
                    `,
            }));
          }

          if (data[1].ActivityFiveId != null) {
            axios
              .get(
                `https://activities-alset-aef528d2fd94.herokuapp.com/activityfive/byId/${parseInt(
                  data[1].ActivityFiveId
                )}`
              )
              .then((response) => {
                if (sessionStorage.getItem("Occupation") === "Instructor") {
                  setMLClusters((prevValues) => ({
                    ...prevValues,
                    [data[1].ActivityFiveId]: response.data.MLClusters,
                  }));
                }
                if (response.data.label) {
                  setActivityLabel((prevValues) => ({
                    ...prevValues,
                    [5 + data[1].ActivityFiveId.toString()]:
                      response.data.label,
                  }));
                }
                if (response.data.instruction) {
                  setActivityInstruction((prevValues) => ({
                    ...prevValues,
                    [5 + data[1].ActivityFiveId.toString()]:
                      response.data.instruction,
                  }));
                }
              });
          } else {
            const value = 5 + ActivityFiveCount.toString();
            setActivityLabel((prevValues) => ({
              ...prevValues,
              [value]: "Custom Text",
            }));
            setActivityInstruction((prevValues) => ({
              ...prevValues,
              [value]: `
                        <Typography>For this activity, you will see two views of your clusters and labels. In the User view, you will see the arrangement you submitted in the previous activity or the arrangement you are currently working on. In the Alternative view, you will see how the AI model would have clustered the sentences you selected. The Alternative view does not provide labels for the clusters, but you might be able to infer them yourself.</Typography>
                        <br />
                        <br />
                        <Typography>Compare the two arrangement and refine the arrangement in the User view in anyway that you feel improves it. When you are satisfied with the arrangement in the User view, click the Submit button to continue to the next activity.</Typography>`,
            }));
          }

          if (data[1].ActivitySixId != null) {
            axios
              .get(
                `https://activities-alset-aef528d2fd94.herokuapp.com/activitysix/byId/${parseInt(
                  data[1].ActivitySixId
                )}`
              )
              .then((response) => {
                if (response.data.label) {
                  setActivityLabel((prevValues) => ({
                    ...prevValues,
                    [6 + data[1].ActivitySixId.toString()]: response.data.label,
                  }));
                }
                if (response.data.instruction) {
                  setActivityInstruction((prevValues) => ({
                    ...prevValues,
                    [6 + data[1].ActivitySixId.toString()]:
                      response.data.instruction,
                  }));
                }
              });
          } else {
            const value = 6 + ActivitySixCount.toString();
            setActivityLabel((prevValues) => ({
              ...prevValues,
              [value]: "Custom Text",
            }));
            setActivityInstruction((prevValues) => ({
              ...prevValues,
              [value]: `
                        <Typography>The sentences and cluster labels you submitted for the previous activity have been arranged in the space below. For each cluster, add any number of insights that you think emerge from the selected sentences. After surfacing the insights, add a set of needs that relate to those insights one at a time. Identifying the insights and needs should be helpful when designing your prototype.</Typography>
                        <br/>
                        <br/>
                        <Typography>When you are satisfied with your listed insights and needs, click the Submit button to complete this stage of the design thinking process. You can come back and make changes to your submissions whenever you like.</Typography>`,
            }));
          }
        });
      });
  }, []);

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
    const UserId = sessionStorage.getItem("UserId");

    if (data.ActivityOneId) {
      const response = await axios.get(
        `https://activities-alset-aef528d2fd94.herokuapp.com/activityone/byId/${data.ActivityOneId}`
      );
      const ActivityOneData = response.data;
      delete ActivityOneData["id"];
      delete ActivityOneData["createdAt"];
      delete ActivityOneData["updatedAt"];

      if (ActivityOneData !== null) {
        let data = {
          id: sessionStorage.getItem("UserId"),
          content: ActivityOneData,
        };
        const ActivityOneIdResponse = await axios.post(
          "https://activities-alset-aef528d2fd94.herokuapp.com/activityone/fromtemplate",
          data
        );
        const ActivitiesID = ActivityOneIdResponse.data.ActivitiesId.id;
        const ActivityOneId = ActivityOneIdResponse.data.ActivityOneId;
        sessionStorage.setItem("ActivitiesId", ActivitiesID);
        sessionStorage.setItem("ActivityOneId", ActivityOneId);
      }
    }

    if (data.ActivityTwoId) {
      const response2 = await axios.get(
        `https://activities-alset-aef528d2fd94.herokuapp.com/activitytwo/byId/${data.ActivityTwoId}`
      );
      const ActivityTwoData = response2.data;
      delete ActivityTwoData["id"];
      delete ActivityTwoData["createdAt"];
      delete ActivityTwoData["updatedAt"];

      if (ActivityTwoData !== null) {
        let data = {
          id: sessionStorage.getItem("ActivitiesId"),
          content: ActivityTwoData,
        };
        const ActivityTwoIdResponse = await axios.post(
          "https://activities-alset-aef528d2fd94.herokuapp.com/activitytwo",
          data
        );
        const ActivityTwoId = ActivityTwoIdResponse.data.id;
        sessionStorage.setItem("ActivityTwoId", ActivityTwoId);
      }
    }

    if (data.ActivityThreeId) {
      const response3 = await axios.get(
        `https://activities-alset-aef528d2fd94.herokuapp.com/activitythree/byId/${data.ActivityThreeId}`
      );
      const ActivityThreeData = response3.data;
      delete ActivityThreeData["id"];
      delete ActivityThreeData["createdAt"];
      delete ActivityThreeData["updatedAt"];

      if (ActivityThreeData !== null) {
        let data = {
          id: sessionStorage.getItem("ActivitiesId"),
          content: ActivityThreeData,
        };
        const ActivityThreeIdResponse = await axios.post(
          "https://activities-alset-aef528d2fd94.herokuapp.com/activitythree",
          data
        );
        const ActivityThreeId = ActivityThreeIdResponse.data.id;
        sessionStorage.setItem("ActivityThreeId", ActivityThreeId);
      }
    }

    if (data.ActivityFourId) {
      const response4 = await axios.get(
        `https://activities-alset-aef528d2fd94.herokuapp.com/activityfour/byId/${data.ActivityFourId}`
      );
      const ActivityFourData = response4.data;
      delete ActivityFourData["id"];
      delete ActivityFourData["createdAt"];
      delete ActivityFourData["updatedAt"];

      if (ActivityFourData !== null) {
        let data = {
          id: sessionStorage.getItem("ActivitiesId"),
          content: ActivityFourData,
        };
        const ActivityFourIdResponse = await axios.post(
          "https://activities-alset-aef528d2fd94.herokuapp.com/activityfour",
          data
        );
        const ActivityFourId = ActivityFourIdResponse.data.id;
        sessionStorage.setItem("ActivityFourId", ActivityFourId);
      }
    }

    if (data.ActivityFiveId) {
      const response5 = await axios.get(
        `https://activities-alset-aef528d2fd94.herokuapp.com/activityfive/byId/${data.ActivityFiveId}`
      );
      const ActivityFiveData = response5.data;
      delete ActivityFiveData["id"];
      delete ActivityFiveData["createdAt"];
      delete ActivityFiveData["updatedAt"];

      if (ActivityFiveData !== null) {
        let data = {
          id: sessionStorage.getItem("ActivitiesId"),
          content: ActivityFiveData,
        };
        const ActivityFiveIdResponse = await axios.post(
          "https://activities-alset-aef528d2fd94.herokuapp.com/activityfive",
          data
        );
        const ActivityFiveId = ActivityFiveIdResponse.data.id;
        sessionStorage.setItem("ActivityFiveId", ActivityFiveId);
      }
    }

    if (data.ActivitySixId) {
      const response6 = await axios.get(
        `https://activities-alset-aef528d2fd94.herokuapp.com/activitysix/byId/${data.ActivitySixId}`
      );
      const ActivitySixData = response6.data;
      delete ActivitySixData["id"];
      delete ActivitySixData["createdAt"];
      delete ActivitySixData["updatedAt"];

      if (ActivitySixData !== null) {
        let data = {
          id: sessionStorage.getItem("ActivitiesId"),
          content: ActivitySixData,
        };
        const ActivitySixIdResponse = await axios.post(
          "https://activities-alset-aef528d2fd94.herokuapp.com/activitysix",
          data
        );
        const ActivitySixId = ActivitySixIdResponse.data.id;
        sessionStorage.setItem("ActivityFourId", ActivitySixId);
      }
    }

    window.location.reload(false);
  };

  // stores all id's of all the activities in sessionStorage
  const storeDetails = (data) => {
    sessionStorage.setItem("ActivityOneId", data[1].ActivityOneId);
    sessionStorage.setItem("ActivityTwoId", data[1].ActivityTwoId);
    sessionStorage.setItem("ActivityThreeId", data[1].ActivityThreeId);
    sessionStorage.setItem("ActivityFourId", data[1].ActivityFourId);
    sessionStorage.setItem("ActivityFiveId", data[1].ActivityFiveId);
    sessionStorage.setItem("ActivitySixId", data[1].ActivitySixId);
  };

  // stores all id's of all the activities in sessionStorage
  const storeDetailsStudents = (data) => {
    sessionStorage.setItem("ActivityOneId", data.ActivityOneId);
    sessionStorage.setItem("ActivityTwoId", data.ActivityTwoId);
    sessionStorage.setItem("ActivityThreeId", data.ActivityThreeId);
    sessionStorage.setItem("ActivityFourId", data.ActivityFourId);
    sessionStorage.setItem("ActivityFiveId", data.ActivityFiveId);
    sessionStorage.setItem("ActivitySixId", data.ActivitySixId);
  };

  // removes all id's of all the activities in sessionStorage
  const removeDetails = () => {
    sessionStorage.removeItem("ActivityOneId");
    sessionStorage.removeItem("ActivityTwoId");
    sessionStorage.removeItem("ActivityThreeId");
    sessionStorage.removeItem("ActivityFourId");
    sessionStorage.removeItem("ActivityFiveId");
    sessionStorage.removeItem("ActivitySixId");
  };

  // updates instructor configurations
  const handleChanges = async (data) => {
    const activityId = data[1].id;
    const activityOneId = data[1].ActivityOneId;
    const activityTwoId = data[1].ActivityTwoId;
    const activityThreeId = data[1].ActivityThreeId;
    const activityFourId = data[1].ActivityFourId;
    const activityFiveId = data[1].ActivityFiveId;
    const activitySixId = data[1].ActivitySixId;

    const activityOneLabel = document.getElementById(
      `activity-one-label-${activityId}`
    ).innerHTML;
    const activityTwoLabel = document.getElementById(
      `activity-two-label-${activityId}`
    ).innerHTML;
    const activityThreeLabel = document.getElementById(
      `activity-three-label-${activityId}`
    ).innerHTML;
    const activityFourLabel = document.getElementById(
      `activity-four-label-${activityId}`
    ).innerHTML;
    const activityFiveLabel = document.getElementById(
      `activity-five-label-${activityId}`
    ).innerHTML;
    const activitySixLabel = document.getElementById(
      `activity-six-label-${activityId}`
    ).innerHTML;

    const activityOneInstruction = document.getElementById(
      `activity-one-instruction-${activityId}`
    ).innerHTML;
    const activityTwoInstruction = document.getElementById(
      `activity-two-instruction-${activityId}`
    ).innerHTML;
    const activityThreeInstruction = document.getElementById(
      `activity-three-instruction-${activityId}`
    ).innerHTML;
    const activityFourInstruction = document.getElementById(
      `activity-four-instruction-${activityId}`
    ).innerHTML;
    const activityFiveInstruction = document.getElementById(
      `activity-five-instruction-${activityId}`
    ).innerHTML;
    const activitySixInstruction = document.getElementById(
      `activity-six-instruction-${activityId}`
    ).innerHTML;

    if (activityOneId) {
      await axios.post(
        `https://activities-alset-aef528d2fd94.herokuapp.com/activityone/home/${activityOneId}`,
        {
          transcriptEditable: switchValues[data[1].ActivityOneId],
          label: activityOneLabel,
          instruction: activityOneInstruction,
        }
      );
      let logs_data = {
        DateTime: Date.now(),
        ActivitySequenceId: sessionStorage.getItem("ActivitiesId"),
        InstructorId: sessionStorage.getItem("UserId"),
        Event: "Update",
        ActivityId: activityOneId,
        ActivityType: "Activity 1",
      };
      await axios.post(
        `https://activities-alset-aef528d2fd94.herokuapp.com/instructorlog/create`,
        logs_data
      );
    } else {
      await axios
        .post(
          "https://activities-alset-aef528d2fd94.herokuapp.com/activityone",
          {
            transcriptEditable: switchValues[data[1].ActivityOneId],
            label: activityOneLabel,
            instruction: activityOneInstruction,
          }
        )
        .then((response) => {
          const ActivitiesID = response.data.ActivitiesId.id;
          const ActivityOneId = response.data.ActivityOneId;
          sessionStorage.setItem("ActivitiesId", ActivitiesID);
          sessionStorage.setItem("ActivityOneId", ActivityOneId);
        });
      let logs_data = {
        DateTime: Date.now(),
        ActivitySequenceId: sessionStorage.getItem("ActivitiesId"),
        InstructorId: sessionStorage.getItem("UserId"),
        Event: "Create",
        ActivityId: sessionStorage.getItem("ActivityOneId"),
        ActivityType: "Activity 1",
      };
      await axios.post(
        `https://activities-alset-aef528d2fd94.herokuapp.com/instructorlog/create`,
        logs_data
      );
    }

    if (activityTwoId) {
      await axios.post(
        `https://activities-alset-aef528d2fd94.herokuapp.com/activitytwo/home/${activityTwoId}`,
        {
          predefinedHighlighting: predefinedHighlighting[data[1].ActivityTwoId],
          label: activityTwoLabel,
          instruction: activityTwoInstruction,
        }
      );
      let logs_data = {
        DateTime: Date.now(),
        ActivitySequenceId: sessionStorage.getItem("ActivitiesId"),
        InstructorId: sessionStorage.getItem("UserId"),
        Event: "Update",
        ActivityId: activityTwoId,
        ActivityType: "Activity 2",
      };
      await axios.post(
        `https://activities-alset-aef528d2fd94.herokuapp.com/instructorlog/create`,
        logs_data
      );
    } else {
      await axios
        .post(
          "https://activities-alset-aef528d2fd94.herokuapp.com/activitytwo/",
          {
            id: activityId,
            content: {
              predefinedHighlighting:
                predefinedHighlighting[data[1].ActivityTwoId],
              label: activityTwoLabel,
              instruction: activityTwoInstruction,
            },
          }
        )
        .then((response) => {
          const ActivityTwoId = response.data.id;
          sessionStorage.setItem("ActivityTwoId", ActivityTwoId);
        });
      let logs_data = {
        DateTime: Date.now(),
        ActivitySequenceId: sessionStorage.getItem("ActivitiesId"),
        InstructorId: sessionStorage.getItem("UserId"),
        Event: "Create",
        ActivityId: sessionStorage.getItem("ActivityTwoId"),
        ActivityType: "Activity 2",
      };
      await axios.post(
        `https://activities-alset-aef528d2fd94.herokuapp.com/instructorlog/create`,
        logs_data
      );
    }

    if (activityThreeId) {
      await axios.post(
        `https://activities-alset-aef528d2fd94.herokuapp.com/activitythree/home/${activityThreeId}`,
        {
          MLModel: MLModel[data[1].ActivityThreeId],
          AllowMLModel: AllowMLModel[data[1].ActivityThreeId],
          predefinedMLSelection: predefinedMLSelection[data[1].ActivityThreeId],
          label: activityThreeLabel,
          instruction: activityThreeInstruction,
        }
      );
      let logs_data = {
        DateTime: Date.now(),
        ActivitySequenceId: sessionStorage.getItem("ActivitiesId"),
        InstructorId: sessionStorage.getItem("UserId"),
        Event: "Update",
        ActivityId: activityThreeId,
        ActivityType: "Activity 3",
      };
      await axios.post(
        `https://activities-alset-aef528d2fd94.herokuapp.com/instructorlog/create`,
        logs_data
      );
    } else {
      await axios
        .post(
          "https://activities-alset-aef528d2fd94.herokuapp.com/activitythree",
          {
            id: activityId,
            content: {
              MLModel: MLModel[data[1].ActivityThreeId],
              AllowMLModel: AllowMLModel[data[1].ActivityThreeId],
              predefinedMLSelection:
                predefinedMLSelection[data[1].ActivityThreeId],
              label: activityThreeLabel,
              instruction: activityThreeInstruction,
            },
          }
        )
        .then((response) => {
          const ActivityThreeId = response.data.id;
          sessionStorage.setItem("ActivityThreeId", ActivityThreeId);
        });
      let logs_data = {
        DateTime: Date.now(),
        ActivitySequenceId: sessionStorage.getItem("ActivitiesId"),
        InstructorId: sessionStorage.getItem("UserId"),
        Event: "Create",
        ActivityId: sessionStorage.getItem("ActivityThreeId"),
        ActivityType: "Activity 3",
      };
      await axios.post(
        `https://activities-alset-aef528d2fd94.herokuapp.com/instructorlog/create`,
        logs_data
      );
    }

    if (activityFourId) {
      await axios.post(
        `https://activities-alset-aef528d2fd94.herokuapp.com/activityfour/home/${activityFourId}`,
        { label: activityFourLabel, instruction: activityFourInstruction }
      );
      let logs_data = {
        DateTime: Date.now(),
        ActivitySequenceId: sessionStorage.getItem("ActivitiesId"),
        InstructorId: sessionStorage.getItem("UserId"),
        Event: "Update",
        ActivityId: activityFourId,
        ActivityType: "Activity 4",
      };
      await axios.post(
        `https://activities-alset-aef528d2fd94.herokuapp.com/instructorlog/create`,
        logs_data
      );
    } else {
      await axios
        .post(
          "https://activities-alset-aef528d2fd94.herokuapp.com/activityfour/",
          {
            id: activityId,
            content: {
              label: activityFourLabel,
              instruction: activityFourInstruction,
            },
          }
        )
        .then((response) => {
          const ActivityFourId = response.data.id;
          sessionStorage.setItem("ActivityFourId", ActivityFourId);
        });
      let logs_data = {
        DateTime: Date.now(),
        ActivitySequenceId: sessionStorage.getItem("ActivitiesId"),
        InstructorId: sessionStorage.getItem("UserId"),
        Event: "Create",
        ActivityId: sessionStorage.getItem("ActivityFourId"),
        ActivityType: "Activity 4",
      };
      await axios.post(
        `https://activities-alset-aef528d2fd94.herokuapp.com/instructorlog/create`,
        logs_data
      );
    }

    if (activityFiveId) {
      await axios.post(
        `https://activities-alset-aef528d2fd94.herokuapp.com/activityfive/home/${activityFiveId}`,
        {
          MLClusters: MLClusters[data[1].ActivityFiveId],
          label: activityFiveLabel,
          instruction: activityFiveInstruction,
        }
      );
      let logs_data = {
        DateTime: Date.now(),
        ActivitySequenceId: sessionStorage.getItem("ActivitiesId"),
        InstructorId: sessionStorage.getItem("UserId"),
        Event: "Update",
        ActivityId: activityFiveId,
        ActivityType: "Activity 5",
      };
      await axios.post(
        `https://activities-alset-aef528d2fd94.herokuapp.com/instructorlog/create`,
        logs_data
      );
    } else {
      await axios
        .post(
          `https://activities-alset-aef528d2fd94.herokuapp.com/activityfive/`,
          {
            id: activityId,
            content: {
              MLClusters: MLClusters[data[1].ActivityFiveId],
              label: activityFiveLabel,
              instruction: activityFiveInstruction,
            },
          }
        )
        .then((response) => {
          const ActivityFiveId = response.data.id;
          sessionStorage.setItem("ActivityFiveId", ActivityFiveId);
        });
      let logs_data = {
        DateTime: Date.now(),
        ActivitySequenceId: sessionStorage.getItem("ActivitiesId"),
        InstructorId: sessionStorage.getItem("UserId"),
        Event: "Create",
        ActivityId: sessionStorage.getItem("ActivityFiveId"),
        ActivityType: "Activity 5",
      };
      await axios.post(
        `https://activities-alset-aef528d2fd94.herokuapp.com/instructorlog/create`,
        logs_data
      );
    }

    if (activitySixId) {
      await axios.post(
        `https://activities-alset-aef528d2fd94.herokuapp.com/activitysix/home/${activitySixId}`,
        { label: activitySixLabel, instruction: activitySixInstruction }
      );
      let logs_data = {
        DateTime: Date.now(),
        ActivitySequenceId: sessionStorage.getItem("ActivitiesId"),
        InstructorId: sessionStorage.getItem("UserId"),
        Event: "Update",
        ActivityId: activitySixId,
        ActivityType: "Activity 6",
      };
      await axios.post(
        `https://activities-alset-aef528d2fd94.herokuapp.com/instructorlog/create`,
        logs_data
      );
    } else {
      await axios
        .post(
          "https://activities-alset-aef528d2fd94.herokuapp.com/activitysix/",
          {
            id: activityId,
            content: {
              label: activitySixLabel,
              instruction: activitySixInstruction,
            },
          }
        )
        .then((response) => {
          const ActivitySixId = response.data.id;
          sessionStorage.setItem("ActivitySixId", ActivitySixId);
        });
      let logs_data = {
        DateTime: Date.now(),
        ActivitySequenceId: sessionStorage.getItem("ActivitiesId"),
        InstructorId: sessionStorage.getItem("UserId"),
        Event: "Create",
        ActivityId: sessionStorage.getItem("ActivitySixId"),
        ActivityType: "Activity 6",
      };
      await axios.post(
        `https://activities-alset-aef528d2fd94.herokuapp.com/instructorlog/create`,
        logs_data
      );
    }

    alert("Successfully published");
  };

  // redirectes the user depending on whether activity one is predefined when they start the activity
  const startActivity = (data) => {
    removeDetails();
    storeDetails(data);
    if (switchValues[data[1].ActivityOneId]) {
      navigate(`/activitytwo/${data[1].ActivityTwoId}`);
    } else {
      navigate(`/activityone/${data[1].ActivityOneId}`);
    }
  };
  // displayes different sets of activities created by instructors and students
  const displayActivities = () => {
    let ActivityCount = -1;
    let templateCount = 0;
    let StudentActivityCount = 0;
    let ActivityOneCount = -1;
    let ActivityTwoCount = -1;
    let ActivityThreeCount = -1;
    let ActivityFourCount = -1;
    let ActivityFiveCount = -1;
    let ActivitySixCount = -1;
    return (
      <Box>
        <Typography
          style={{ fontFamily: `"DM Serif Display", serif` }}
          variant="h5"
        >
          Credentials
        </Typography>
        <Typography
          style={{
            fontFamily: `"Lato", sans-serif`,
            marginTop: 5,
            color: "#333333",
          }}
          variant="h5"
        >
          Username: {sessionStorage.getItem("Username")}
        </Typography>
        <Typography
          style={{ fontFamily: `"Lato", sans-serif`, color: "#333333" }}
          variant="h5"
        >
          Role: {sessionStorage.getItem("Occupation")}
        </Typography>
        {instructor && (
          <Button
            style={{
              marginTop: 20,
              marginBottom: 10,
              backgroundColor: "#c8bea0",
              color: "#50352a",
              border: "1px solid #50352a",
            }}
            fullWidth
            variant="outlined"
            onClick={() => {
              removeDetails();
              navigate("/activityone");
            }}
          >
            Create a Template
          </Button>
        )}
        <Typography
          variant="h5"
          style={{
            marginTop: !instructor ? 40 : 10,
            marginBottom: 10,
            fontFamily: `"Lato", sans-serif`,
          }}
        >
          Your Custom Activities
        </Typography>
        {Object.entries(listOfActivities).map((data) => {
          {
            ActivityCount++;
            ActivityOneCount++;
            ActivityTwoCount++;
            ActivityThreeCount++;
            ActivityFourCount++;
            ActivityFiveCount++;
            ActivitySixCount++;
          }
          console.log(activityLabel);
          return (
            <div>
              {!instructor && (
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    border: "1px solid black",
                    padding: "10px",
                    marginTop: 10,
                    marginBottom: 10,
                    backgroundColor: "#E6E6FA",
                    borderRadius: 5,
                  }}
                >
                  {/* <Stack style={{ width: "100%" }}> */}

                  <Typography
                    variant="h6"
                    style={{ fontFamily: `"Lato", sans-serif`, fontSize: 20 }}
                  >
                    {activityTitle[data[1].ActivityOneId]}
                  </Typography>
                  <div style={{ marginLeft: "auto" }}>
                    <Button
                      onClick={() => {
                        sessionStorage.setItem("ActivitiesId", data[1].id);
                        storeDetails(data);
                        navigate(`/activityone/${data[1].ActivityOneId}`);
                      }}
                    >
                      Activity 1
                    </Button>
                    <span style={{ color: "#2e82d6" }}>|</span>
                    <Button
                      onClick={() => {
                        sessionStorage.setItem("ActivitiesId", data[1].id);
                        storeDetails(data);
                        data[1].ActivityTwoId
                          ? navigate(`/activitytwo/${data[1].ActivityTwoId}`)
                          : alert(
                              "Please go back to the previous activity and submit it to continue."
                            );
                      }}
                    >
                      Activity 2
                    </Button>
                    <span style={{ color: "#2e82d6" }}>|</span>
                    <Button
                      onClick={() => {
                        sessionStorage.setItem("ActivitiesId", data[1].id);
                        sessionStorage.setItem(
                          "predefinedHighlighting",
                          predefinedHighlighting[data[1].ActivityTwoId]
                        );
                        storeDetails(data);
                        data[1].ActivityThreeId
                          ? navigate(
                              `/activitythree/${data[1].ActivityThreeId}`
                            )
                          : alert(
                              "Please go back to the previous activity and submit it to continue."
                            );
                      }}
                    >
                      Activity 3
                    </Button>
                    <span style={{ color: "#2e82d6" }}>|</span>
                    <Button
                      onClick={() => {
                        sessionStorage.setItem("ActivitiesId", data[1].id);
                        storeDetails(data);
                        data[1].ActivityFourId
                          ? navigate(`/activityfour/${data[1].ActivityFourId}`)
                          : alert(
                              "Please go back to the previous activity and submit it to continue."
                            );
                      }}
                    >
                      Activity 4
                    </Button>
                    <span style={{ color: "#2e82d6" }}>|</span>
                    <Button
                      onClick={() => {
                        sessionStorage.setItem("ActivitiesId", data[1].id);
                        storeDetails(data);
                        data[1].ActivityFiveId
                          ? navigate(`/activityfive/${data[1].ActivityFiveId}`)
                          : alert(
                              "Please go back to the previous activity and submit it to continue."
                            );
                      }}
                    >
                      Activity 5
                    </Button>
                    <span style={{ color: "#2e82d6" }}>|</span>
                    <Button
                      onClick={() => {
                        sessionStorage.setItem("ActivitiesId", data[1].id);
                        storeDetails(data);
                        data[1].ActivitySixId
                          ? navigate(`/activitysix/${data[1].ActivitySixId}`)
                          : alert(
                              "Please go back to the previous activity and submit it to continue."
                            );
                      }}
                    >
                      Activity 6
                    </Button>
                  </div>

                  {/* <ButtonGroup fullWidth>
                                                <Button onClick={() => { sessionStorage.setItem("ActivitiesId", data[1].id); storeDetails(data); navigate(`/activityone/${data[1].ActivityOneId}`) }} fullWidth style={{ backgroundColor: data[1].ActivityOneId ? "#357960" : "grey", }} variant='contained'></Button>
                                                <Button onClick={() => { sessionStorage.setItem("ActivitiesId", data[1].id); storeDetails(data); data[1].ActivityTwoId ? navigate(`/activitytwo/${data[1].ActivityTwoId}`) : alert("Please go back to the previous activity and submit it to continue.") }} fullWidth style={{ backgroundColor: data[1].ActivityTwoId ? "#357960" : "grey", borderLeft: "1px solid black" }} variant='contained'></Button>
                                                <Button onClick={() => { sessionStorage.setItem("ActivitiesId", data[1].id); sessionStorage.setItem("predefinedHighlighting", predefinedHighlighting[data[1].ActivityTwoId]); storeDetails(data); data[1].ActivityThreeId ? navigate(`/activitythree/${data[1].ActivityThreeId}`) : alert("Please go back to the previous activity and submit it to continue.") }} fullWidth style={{ backgroundColor: data[1].ActivityThreeId ? "#357960" : "grey", borderLeft: "1px solid black" }} variant='contained'></Button>
                                                <Button onClick={() => { sessionStorage.setItem("ActivitiesId", data[1].id); storeDetails(data); data[1].ActivityFourId ? navigate(`/activityfour/${data[1].ActivityFourId}`) : alert("Please go back to the previous activity and submit it to continue.") }} fullWidth style={{ backgroundColor: data[1].ActivityFourId ? "#357960" : "grey", borderLeft: "1px solid black" }} variant='contained'></Button>
                                                <Button onClick={() => { sessionStorage.setItem("ActivitiesId", data[1].id); storeDetails(data); data[1].ActivityFiveId ? navigate(`/activityfive/${data[1].ActivityFiveId}`) : alert("Please go back to the previous activity and submit it to continue.") }} fullWidth style={{ backgroundColor: data[1].ActivityFiveId ? "#357960" : "grey", borderLeft: "1px solid black" }} variant='contained'></Button>
                                                <Button onClick={() => { sessionStorage.setItem("ActivitiesId", data[1].id); storeDetails(data); data[1].ActivitySixId ? navigate(`/activitysix/${data[1].ActivitySixId}`) : alert("Please go back to the previous activity and submit it to continue.") }} fullWidth style={{ backgroundColor: data[1].ActivitySixId ? "#357960" : "grey", borderLeft: "1px solid black" }} variant='contained'></Button>
                                            </ButtonGroup> */}

                  {/* </Stack> */}
                </div>
              )}
              {instructor && (
                <div>
                  <Accordion style={{ marginTop: 10, marginBottom: 10 }}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      id={data[1].id}
                      style={{
                        backgroundColor: "#E6E6FA",
                        border: "1px solid black",
                      }}
                    >
                      <Typography
                        variant="h6"
                        style={{
                          fontFamily: `"Lato", sans-serif`,
                          fontSize: 20,
                        }}
                      >
                        {activityTitle[data[1].ActivityOneId]}
                      </Typography>
                      <Button
                        onClick={() => {
                          startActivity(data);
                        }}
                        style={{ marginLeft: "auto" }}
                      >
                        Start Activity
                      </Button>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Alert
                        style={{ marginBottom: 20, marginTop: 20 }}
                        severity="warning"
                      >
                        To ensure the activities are accessible to users, please
                        click the 'Publish Activities / Save Changes' button
                      </Alert>
                      <div>
                        <div>
                          <div style={{ display: "flex", width: "100%" }}>
                            <Typography
                              style={{
                                marginBottom: 10,
                                fontFamily: `"Lato", sans-serif`,
                                fontSize: 20,
                              }}
                              variant="h6"
                            >
                              <strong>Activity 1</strong>
                            </Typography>
                            <Button
                              onClick={() => {
                                sessionStorage.setItem(
                                  "ActivitiesId",
                                  data[1].id
                                );
                                storeDetails(data);
                                navigate(
                                  `/activityone/${data[1].ActivityOneId}`
                                );
                              }}
                              style={{
                                color: data[1].ActivityOneId ? "green" : "grey",
                                marginLeft: "auto",
                              }}
                            >
                              {instructor ? (
                                "Activity One"
                              ) : (
                                <Typography
                                  dangerouslySetInnerHTML={{
                                    __html: data[1].ActivityOneId
                                      ? activityLabel[
                                          1 + data[1].ActivityOneId.toString()
                                        ]
                                      : activityLabel[
                                          1 + ActivityOneCount.toString()
                                        ],
                                  }}
                                  contentEditable="true"
                                  style={{
                                    minHeight: 1,
                                    borderRight: "solid rgba(0,0,0,0) 1px",
                                    outline: "none",
                                  }}
                                  id={`activity-one-label-${data[1].id}`}
                                  variant="body2"
                                ></Typography>
                              )}
                            </Button>
                          </div>

                          <div
                            style={{
                              display: "flex",
                              direction: "row",
                              marginTop: 2,
                            }}
                          >
                            {/* <Typography>Label:</Typography>&nbsp;&nbsp; */}
                            <Typography
                              dangerouslySetInnerHTML={{
                                __html: data[1].ActivityOneId
                                  ? activityLabel[
                                      1 + data[1].ActivityOneId.toString()
                                    ]
                                  : activityLabel[
                                      1 + ActivityOneCount.toString()
                                    ],
                              }}
                              contentEditable="true"
                              style={{
                                minHeight: 1,
                                borderRight: "solid rgba(0,0,0,0) 1px",
                                outline: "none",
                                fontFamily: `"Lato", sans-serif`,
                                fontSize: 17,
                              }}
                              id={`activity-one-label-${data[1].id}`}
                            ></Typography>
                          </div>
                          {/* 
                                                <Typography style={{ marginTop: 10 }}>Instructions: </Typography> */}
                          <Typography
                            id={`activity-one-instruction-${data[1].id}`}
                            dangerouslySetInnerHTML={{
                              __html: data[1].ActivityOneId
                                ? activityInstruction[
                                    1 + data[1].ActivityOneId.toString()
                                  ]
                                : activityInstruction[
                                    1 + ActivityOneCount.toString()
                                  ],
                            }}
                            contentEditable={instructor && true}
                            style={{
                              minHeight: 1,
                              borderRight: "solid rgba(0,0,0,0) 1px",
                              outline: "none",
                              fontFamily: `"Lato", sans-serif`,
                              fontSize: 17,
                              marginTop: 15,
                            }}
                          ></Typography>
                          <Divider style={{ marginTop: 10 }} />
                          <FormControlLabel
                            style={{
                              marginTop: 10,
                              marginBottom: !switchValues[data[1].ActivityOneId]
                                ? 10
                                : 0,
                            }}
                            control={
                              <Switch
                                checked={
                                  switchValues[data[1].ActivityOneId] || false
                                }
                                onChange={() =>
                                  handleSwitchChange(data[1].ActivityOneId)
                                }
                              />
                            }
                            label="Standardised Script"
                          />
                          <Typography
                            style={{
                              marginBottom: 10,
                              fontFamily: `"Lato", sans-serif`,
                              fontSize: 17,
                            }}
                          >
                            To update the transcript, kindly navigate to
                            Activity 1 and implement the necessary
                            modifications.
                          </Typography>
                          {/* {switchValues[data[1].ActivityOneId] && <TextField helperText={helperText[data[1].ActivityOneId] || false} error={transcriptError[data[1].ActivityOneId] || false} margin='normal' value={transcript[data[1].ActivityOneId] || ""} rows={15} fullWidth multiline variant='outlined' label="Transcript" onChange={(e) => setTranscript((prevValues) => ({ ...prevValues, [data[1].ActivityOneId]: e.target.value }))}></TextField> */}
                        </div>
                        <div>
                          <div style={{ display: "flex", width: "100%" }}>
                            <Typography
                              style={{
                                marginBottom: 10,
                                marginTop: 15,
                                fontFamily: `"Lato", sans-serif`,
                                fontSize: 20,
                              }}
                              variant="h6"
                            >
                              <strong>Activity 2</strong>
                            </Typography>
                            <Button
                              onClick={() => {
                                sessionStorage.setItem(
                                  "ActivitiesId",
                                  data[1].id
                                );
                                storeDetails(data);
                                data[1].ActivityTwoId
                                  ? navigate(
                                      `/activitytwo/${data[1].ActivityTwoId}`
                                    )
                                  : alert(
                                      "Please go back to the previous activity and submit it to continue."
                                    );
                              }}
                              style={{
                                color: data[1].ActivityTwoId ? "green" : "grey",
                                marginLeft: "auto",
                              }}
                            >
                              {instructor ? (
                                "Activity Two"
                              ) : (
                                <Typography
                                  dangerouslySetInnerHTML={{
                                    __html: data[1].ActivityTwoId
                                      ? activityLabel[
                                          2 + data[1].ActivityTwoId.toString()
                                        ]
                                      : activityLabel[
                                          2 + ActivityTwoCount.toString()
                                        ],
                                  }}
                                  contentEditable="true"
                                  style={{
                                    minHeight: 1,
                                    borderRight: "solid rgba(0,0,0,0) 1px",
                                    outline: "none",
                                  }}
                                  id={`activity-two-label-${data[1].id}`}
                                  variant="body2"
                                ></Typography>
                              )}
                            </Button>
                          </div>

                          <div
                            style={{
                              display: "flex",
                              direction: "row",
                              marginTop: 2,
                            }}
                          >
                            {/* <Typography>Label:</Typography>&nbsp;&nbsp; */}
                            <Typography
                              dangerouslySetInnerHTML={{
                                __html: data[1].ActivityTwoId
                                  ? activityLabel[
                                      2 + data[1].ActivityTwoId.toString()
                                    ]
                                  : activityLabel[
                                      2 + ActivityTwoCount.toString()
                                    ],
                              }}
                              contentEditable="true"
                              style={{
                                minHeight: 1,
                                borderRight: "solid rgba(0,0,0,0) 1px",
                                outline: "none",
                                fontFamily: `"Lato", sans-serif`,
                                fontSize: 17,
                              }}
                              id={`activity-two-label-${data[1].id}`}
                            ></Typography>
                          </div>

                          {/* <Typography style={{ marginTop: 10 }}>Instructions: </Typography> */}
                          <Typography
                            id={`activity-two-instruction-${data[1].id}`}
                            dangerouslySetInnerHTML={{
                              __html: data[1].ActivityTwoId
                                ? activityInstruction[
                                    2 + data[1].ActivityTwoId.toString()
                                  ]
                                : activityInstruction[
                                    2 + ActivityTwoCount.toString()
                                  ],
                            }}
                            contentEditable={instructor && true}
                            style={{
                              minHeight: 1,
                              borderRight: "solid rgba(0,0,0,0) 1px",
                              outline: "none",
                              fontFamily: `"Lato", sans-serif`,
                              fontSize: 17,
                              marginTop: 15,
                            }}
                          ></Typography>
                          <Divider style={{ marginTop: 10 }} />
                          <FormControlLabel
                            style={{ marginTop: 10, marginBottom: 10 }}
                            control={
                              <Switch
                                checked={
                                  predefinedHighlighting[
                                    data[1].ActivityTwoId
                                  ] || false
                                }
                                onChange={() =>
                                  handleSwitchChangeHighlighting(
                                    data[1].ActivityTwoId
                                  )
                                }
                              />
                            }
                            label="Standardised Script Highlighting"
                          />
                        </div>
                        <div>
                          <Typography
                            variant="h6"
                            style={{
                              fontFamily: `"Lato", sans-serif`,
                              fontSize: 20,
                              marginTop: 15,
                            }}
                          >
                            <strong>Activity 3</strong>
                          </Typography>
                          <div
                            style={{
                              display: "flex",
                              direction: "row",
                              marginTop: 10,
                            }}
                          >
                            {/* <Typography>Label:</Typography>&nbsp;&nbsp; */}
                            <Typography
                              dangerouslySetInnerHTML={{
                                __html: data[1].ActivityThreeId
                                  ? activityLabel[
                                      3 + data[1].ActivityThreeId.toString()
                                    ]
                                  : activityLabel[
                                      3 + ActivityThreeCount.toString()
                                    ],
                              }}
                              contentEditable="true"
                              style={{
                                minHeight: 1,
                                borderRight: "solid rgba(0,0,0,0) 1px",
                                outline: "none",
                                fontFamily: `"Lato", sans-serif`,
                                fontSize: 17,
                              }}
                              id={`activity-three-label-${data[1].id}`}
                            ></Typography>
                          </div>
                          {/* <Typography style={{ marginTop: 10 }}>Instructions: </Typography> */}
                          <Typography
                            id={`activity-three-instruction-${data[1].id}`}
                            dangerouslySetInnerHTML={{
                              __html: data[1].ActivityThreeId
                                ? activityInstruction[
                                    3 + data[1].ActivityThreeId.toString()
                                  ]
                                : activityInstruction[
                                    3 + ActivityThreeCount.toString()
                                  ],
                            }}
                            contentEditable={instructor && true}
                            style={{
                              minHeight: 1,
                              borderRight: "solid rgba(0,0,0,0) 1px",
                              outline: "none",
                              fontFamily: `"Lato", sans-serif`,
                              fontSize: 17,
                              marginTop: 15,
                            }}
                          ></Typography>
                          <Divider style={{ marginTop: 10 }} />
                          <>
                            <Typography
                              style={{
                                marginTop: 10,
                                marginBottom: 10,
                                fontFamily: `"Lato", sans-serif`,
                                fontSize: 17,
                              }}
                            >
                              If a machine learning model isn't chosen, no
                              selections based on machine learning will occur.
                            </Typography>
                            <Typography
                              style={{
                                fontFamily: `"Lato", sans-serif`,
                                fontSize: 17,
                              }}
                            >
                              Currently selected machine learning model:{" "}
                              {MLModel[data[1].ActivityThreeId]}
                            </Typography>
                            <Typography
                              style={{
                                marginTop: 10,
                                marginBottom: 10,
                                fontFamily: `"Lato", sans-serif`,
                                fontSize: 17,
                              }}
                            >
                              To choose a different machine learning model,
                              please make your selection from the options below.
                            </Typography>
                            <div style={{ display: "flex", width: "100%" }}>
                              <div style={{ width: "50%" }}>
                                <Select
                                  value={MLModel[data[1].ActivityThreeId]}
                                  onChange={(e) => {
                                    setMLModel((prevValues) => ({
                                      ...prevValues,
                                      [data[1].ActivityThreeId]: e.target.value,
                                    }));
                                  }}
                                  fullWidth
                                >
                                  <MenuItem value={"None"}>None</MenuItem>
                                  <MenuItem value={"Model1"}>Model 1</MenuItem>
                                  <MenuItem value={"Model2"}>Model 2</MenuItem>
                                  <MenuItem value={"Model3"}>Model 3</MenuItem>
                                  <MenuItem value={"Model4"}>Model 4</MenuItem>
                                </Select>
                              </div>
                            </div>
                            <div style={{ width: "100%" }}>
                              <FormControlLabel
                                style={{ marginTop: 10 }}
                                control={
                                  <Switch
                                    checked={
                                      AllowMLModel[data[1].ActivityThreeId]
                                    }
                                    onChange={() => {
                                      setAllowMLModel((prevValues) => ({
                                        ...prevValues,
                                        [data[1].ActivityThreeId]:
                                          !prevValues[data[1].ActivityThreeId],
                                      }));
                                    }}
                                  />
                                }
                                label="Enable Selections Based on Machine Learning Analysis"
                              />
                            </div>
                            <div style={{ width: "100%" }}>
                              <FormControlLabel
                                style={{ marginTop: 10 }}
                                control={
                                  <Switch
                                    checked={
                                      predefinedMLSelection[
                                        data[1].ActivityThreeId
                                      ]
                                    }
                                    onChange={() => {
                                      setPredefinedMLSelection(
                                        (prevValues) => ({
                                          ...prevValues,
                                          [data[1].ActivityThreeId]:
                                            !prevValues[
                                              data[1].ActivityThreeId
                                            ],
                                        })
                                      );
                                    }}
                                  />
                                }
                                label="Standardise Machine Learning Selections"
                              />
                            </div>
                          </>
                        </div>
                        <div>
                          <Typography
                            variant="h6"
                            style={{
                              fontFamily: `"Lato", sans-serif`,
                              fontSize: 20,
                              marginTop: 23,
                            }}
                          >
                            <strong>Activity 4</strong>
                          </Typography>

                          <div
                            style={{
                              display: "flex",
                              direction: "row",
                              marginTop: 10,
                            }}
                          >
                            {/* <Typography>Label:</Typography>&nbsp;&nbsp; */}
                            <Typography
                              dangerouslySetInnerHTML={{
                                __html: data[1].ActivityFourId
                                  ? activityLabel[
                                      4 + data[1].ActivityFourId.toString()
                                    ]
                                  : activityLabel[
                                      4 + ActivityFourCount.toString()
                                    ],
                              }}
                              contentEditable="true"
                              style={{
                                minHeight: 1,
                                borderRight: "solid rgba(0,0,0,0) 1px",
                                outline: "none",
                                fontFamily: `"Lato", sans-serif`,
                                fontSize: 17,
                              }}
                              id={`activity-four-label-${data[1].id}`}
                            ></Typography>
                          </div>
                          {/* <Typography style={{ marginTop: 10 }}>Instructions: </Typography> */}
                          <Typography
                            id={`activity-four-instruction-${data[1].id}`}
                            dangerouslySetInnerHTML={{
                              __html: data[1].ActivityFourId
                                ? activityInstruction[
                                    4 + data[1].ActivityFourId.toString()
                                  ]
                                : activityInstruction[
                                    4 + ActivityFourCount.toString()
                                  ],
                            }}
                            contentEditable={instructor && true}
                            style={{
                              minHeight: 1,
                              borderRight: "solid rgba(0,0,0,0) 1px",
                              outline: "none",
                              fontFamily: `"Lato", sans-serif`,
                              fontSize: 17,
                              marginTop: 15,
                            }}
                          ></Typography>
                          {/* <Divider style={{ marginTop: 10 }} /> */}
                        </div>
                        <div>
                          <Typography
                            variant="h6"
                            style={{
                              fontFamily: `"Lato", sans-serif`,
                              fontSize: 20,
                              marginTop: 23,
                            }}
                          >
                            <strong>Activity 5</strong>
                          </Typography>

                          <div
                            style={{
                              display: "flex",
                              direction: "row",
                              marginTop: 10,
                            }}
                          >
                            {/* <Typography>Label:</Typography>&nbsp;&nbsp; */}
                            <Typography
                              dangerouslySetInnerHTML={{
                                __html: data[1].ActivityFiveId
                                  ? activityLabel[
                                      5 + data[1].ActivityFiveId.toString()
                                    ]
                                  : activityLabel[
                                      5 + ActivityFiveCount.toString()
                                    ],
                              }}
                              contentEditable="true"
                              style={{
                                minHeight: 1,
                                borderRight: "solid rgba(0,0,0,0) 1px",
                                outline: "none",
                                fontFamily: `"Lato", sans-serif`,
                                fontSize: 17,
                              }}
                              id={`activity-five-label-${data[1].id}`}
                            ></Typography>
                          </div>
                          {/* <Typography style={{ marginTop: 10 }}>Instructions: </Typography> */}
                          <Typography
                            id={`activity-five-instruction-${data[1].id}`}
                            dangerouslySetInnerHTML={{
                              __html: data[1].ActivityFiveId
                                ? activityInstruction[
                                    5 + data[1].ActivityFiveId.toString()
                                  ]
                                : activityInstruction[
                                    5 + ActivityFiveCount.toString()
                                  ],
                            }}
                            contentEditable={instructor && true}
                            style={{
                              minHeight: 1,
                              borderRight: "solid rgba(0,0,0,0) 1px",
                              outline: "none",
                              fontFamily: `"Lato", sans-serif`,
                              fontSize: 17,
                              marginTop: 15,
                            }}
                          ></Typography>
                        </div>
                        <FormControlLabel
                          style={{ marginTop: 10, marginBottom: 0 }}
                          control={
                            <Switch
                              checked={MLClusters[data[1].ActivityFiveId]}
                              onChange={() => {
                                setMLClusters((prevValues) => ({
                                  ...prevValues,
                                  [data[1].ActivityFiveId]:
                                    !prevValues[data[1].ActivityFiveId],
                                }));
                              }}
                            />
                          }
                          label="Allow Machine Learning Clustering"
                        />
                        <div>
                          <Typography
                            variant="h6"
                            style={{
                              fontFamily: `"Lato", sans-serif`,
                              fontSize: 20,
                              marginTop: 15,
                            }}
                          >
                            <strong>Activity 6</strong>
                          </Typography>

                          <div
                            style={{
                              display: "flex",
                              direction: "row",
                              marginTop: 10,
                            }}
                          >
                            {/* <Typography>Label:</Typography>&nbsp;&nbsp; */}
                            <Typography
                              dangerouslySetInnerHTML={{
                                __html: data[1].ActivitySixId
                                  ? activityLabel[
                                      6 + data[1].ActivitySixId.toString()
                                    ]
                                  : activityLabel[
                                      6 + ActivitySixCount.toString()
                                    ],
                              }}
                              contentEditable="true"
                              style={{
                                minHeight: 1,
                                borderRight: "solid rgba(0,0,0,0) 1px",
                                outline: "none",
                                fontFamily: `"Lato", sans-serif`,
                                fontSize: 17,
                              }}
                              id={`activity-six-label-${data[1].id}`}
                            ></Typography>
                          </div>
                          {/* <Typography style={{ marginTop: 10 }}>Instructions: </Typography> */}
                          <Typography
                            id={`activity-six-instruction-${data[1].id}`}
                            dangerouslySetInnerHTML={{
                              __html: data[1].ActivitySixId
                                ? activityInstruction[
                                    6 + data[1].ActivitySixId.toString()
                                  ]
                                : activityInstruction[
                                    6 + ActivitySixCount.toString()
                                  ],
                            }}
                            contentEditable={instructor && true}
                            style={{
                              minHeight: 1,
                              borderRight: "solid rgba(0,0,0,0) 1px",
                              outline: "none",
                              fontFamily: `"Lato", sans-serif`,
                              fontSize: 17,
                              marginTop: 15,
                            }}
                          ></Typography>
                        </div>
                      </div>
                      {!instructor && (
                        <Button
                          fullWidth
                          style={{ marginTop: 10 }}
                          onClick={() => {
                            startActivity(data);
                          }}
                          variant="contained"
                        >
                          Start Activity
                        </Button>
                      )}
                      {instructor && (
                        <Button
                          fullWidth
                          style={{ marginTop: 10 }}
                          onClick={() => handleChanges(data)}
                          variant="contained"
                        >
                          Save and Publish Updates
                        </Button>
                      )}
                    </AccordionDetails>
                  </Accordion>
                </div>
              )}
            </div>
          );
        })}
        {!instructor && (
          <Typography
            variant="h5"
            style={{ marginTop: 50, fontFamily: `"Lato", sans-serif` }}
          >
            Instructor-Designed Activity Templates
          </Typography>
        )}
        {!instructor && (
          <Alert style={{ marginTop: 20, marginBottom: 20 }} severity="warning">
            Important: Please avoid refreshing the page while the template is
            being copied. The page will refresh automatically once the
            activities have been successfully duplicated.
          </Alert>
        )}
        {Object.entries(listOfActivitiesInstructor).flatMap(([key, array]) => {
          return array.map((data) => {
            templateCount++;
            if (data != null) {
              return (
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    border: "1px solid black",
                    padding: "10px",
                    marginTop: 10,
                    marginBottom: 10,
                    backgroundColor: "#C7E6F4",
                    borderRadius: 5,
                  }}
                >
                  <Typography
                    variant="h6"
                    style={{ fontFamily: `"Lato", sans-serif`, fontSize: 20 }}
                  >
                    {activityTitleInstructor[data.ActivityOneId]}
                  </Typography>
                  <Button
                    onClick={() => {
                      newActivity(data);
                    }}
                    style={{ marginLeft: "auto" }}
                  >
                    Copy Template
                  </Button>
                </div>
                // <Accordion style={{ marginTop: 10, marginBottom: 10 }}>
                //     <AccordionSummary expandIcon={<ExpandMoreIcon />} id={data.id} style={{ backgroundColor: "#C7E6F4", border: '1px solid black' }}>

                //     </AccordionSummary>
                // </Accordion>
              );
            }
          });
        })}

        {instructor && (
          <Typography variant="h5" style={{ marginTop: 50 }}>
            Student Activities
          </Typography>
        )}
        {Object.entries(listOfActivitiesStudents).flatMap(([key, array]) => {
          return array.map((data) => {
            StudentActivityCount++;
            if (data != null) {
              return (
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    border: "1px solid black",
                    padding: "10px",
                    marginTop: 10,
                    marginBottom: 10,
                    backgroundColor: "#C7E6F4",
                    borderRadius: 5,
                  }}
                >
                  <Typography
                    variant="h6"
                    style={{ fontFamily: `"Lato", sans-serif`, fontSize: 20 }}
                  >
                    {activityTitleStudent[data.ActivityOneId]}
                  </Typography>
                  <div style={{ marginLeft: "auto" }}>
                    <Button
                      onClick={() => {
                        sessionStorage.setItem("ActivitiesId", data.id);
                        storeDetailsStudents(data);
                        navigate(`/activityone/${data.ActivityOneId}`);
                      }}
                    >
                      Activity 1
                    </Button>
                    <span style={{ color: "#2e82d6" }}>|</span>
                    <Button
                      onClick={() => {
                        sessionStorage.setItem("ActivitiesId", data.id);
                        storeDetailsStudents(data);
                        data.ActivityTwoId
                          ? navigate(`/activitytwo/${data.ActivityTwoId}`)
                          : alert(
                              "Please go back to the previous activity and submit it to continue."
                            );
                      }}
                    >
                      Activity 2
                    </Button>
                    <span style={{ color: "#2e82d6" }}>|</span>
                    <Button
                      onClick={() => {
                        sessionStorage.setItem("ActivitiesId", data.id);
                        sessionStorage.setItem(
                          "predefinedHighlighting",
                          predefinedHighlighting[data.ActivityTwoId]
                        );
                        storeDetailsStudents(data);
                        data.ActivityThreeId
                          ? navigate(`/activitythree/${data.ActivityThreeId}`)
                          : alert(
                              "Please go back to the previous activity and submit it to continue."
                            );
                      }}
                    >
                      Activity 3
                    </Button>
                    <span style={{ color: "#2e82d6" }}>|</span>
                    <Button
                      onClick={() => {
                        sessionStorage.setItem("ActivitiesId", data.id);
                        storeDetailsStudents(data);
                        data.ActivityFourId
                          ? navigate(`/activityfour/${data.ActivityFourId}`)
                          : alert(
                              "Please go back to the previous activity and submit it to continue."
                            );
                      }}
                    >
                      Activity 4
                    </Button>
                    <span style={{ color: "#2e82d6" }}>|</span>
                    <Button
                      onClick={() => {
                        sessionStorage.setItem("ActivitiesId", data.id);
                        storeDetailsStudents(data);
                        data.ActivityFiveId
                          ? navigate(`/activityfive/${data.ActivityFiveId}`)
                          : alert(
                              "Please go back to the previous activity and submit it to continue."
                            );
                      }}
                    >
                      Activity 5
                    </Button>
                    <span style={{ color: "#2e82d6" }}>|</span>
                    <Button
                      onClick={() => {
                        sessionStorage.setItem("ActivitiesId", data.id);
                        storeDetailsStudents(data);
                        data.ActivitySixId
                          ? navigate(`/activitysix/${data.ActivitySixId}`)
                          : alert(
                              "Please go back to the previous activity and submit it to continue."
                            );
                      }}
                    >
                      Activity 6
                    </Button>
                  </div>
                </div>

                //   <Accordion style={{ marginTop: 10, marginBottom: 10 }}>
                //   <AccordionSummary
                //     expandIcon={<ExpandMoreIcon />}
                //     id={data.id}
                //     style={{
                //       backgroundColor: "#C7E6F4",
                //       border: "1px solid black",
                //     }}
                //   >
                //     <Typography
                //       variant="h6"
                //       style={{ fontFamily: `"Lato", sans-serif`, fontSize: 20 }}
                //     >
                //       {activityTitleStudent[data.ActivityOneId]}
                //     </Typography>
                //   </AccordionSummary>
                //   <AccordionDetails>
                //     <div>
                //       <Button
                //         onClick={() => {
                //           sessionStorage.setItem("ActivitiesId", data.id);
                //           storeDetailsStudents(data);
                //           navigate(`/activityone/${data.ActivityOneId}`);
                //         }}
                //         style={{
                //           backgroundColor: data.ActivityOneId ? "green" : "red",
                //         }}
                //         fullWidth
                //         variant="contained"
                //       >
                //         Activity 1
                //       </Button>
                //     </div>
                //     <div>
                //       <Button
                //         onClick={() => {
                //           sessionStorage.setItem("ActivitiesId", data.id);
                //           storeDetailsStudents(data);
                //           navigate(`/activitytwo/${data.ActivityTwoId}`);
                //         }}
                //         style={{
                //           backgroundColor: data.ActivityTwoId ? "green" : "red",
                //         }}
                //         fullWidth
                //         variant="contained"
                //       >
                //         Activity 2
                //       </Button>
                //     </div>
                //     <div>
                //       <Button
                //         onClick={() => {
                //           sessionStorage.setItem("ActivitiesId", data.id);
                //           sessionStorage.setItem(
                //             "predefinedHighlighting",
                //             predefinedHighlighting[data.ActivityTwoId]
                //           );
                //           storeDetailsStudents(data);
                //           navigate(`/activitythree/${data.ActivityThreeId}`);
                //         }}
                //         style={{
                //           backgroundColor: data.ActivityThreeId
                //             ? "green"
                //             : "red",
                //         }}
                //         fullWidth
                //         variant="contained"
                //       >
                //         Activity 3
                //       </Button>
                //     </div>
                //     <div>
                //       <Button
                //         onClick={() => {
                //           sessionStorage.setItem("ActivitiesId", data.id);
                //           storeDetailsStudents(data);
                //           navigate(`/activityfour/${data.ActivityFourId}`);
                //         }}
                //         style={{
                //           backgroundColor: data.ActivityFourId
                //             ? "green"
                //             : "red",
                //         }}
                //         fullWidth
                //         variant="contained"
                //       >
                //         Activity 4
                //       </Button>
                //     </div>
                //     <div>
                //       <Button
                //         onClick={() => {
                //           sessionStorage.setItem("ActivitiesId", data.id);
                //           storeDetailsStudents(data);
                //           navigate(`/activityfive/${data.ActivityFiveId}`);
                //         }}
                //         style={{
                //           backgroundColor: data.ActivityFiveId
                //             ? "green"
                //             : "red",
                //         }}
                //         fullWidth
                //         variant="contained"
                //       >
                //         Activity 5
                //       </Button>
                //     </div>
                //     <div>
                //       <Button
                //         onClick={() => {
                //           sessionStorage.setItem("ActivitiesId", data.id);
                //           storeDetailsStudents(data);
                //           navigate(`/activitysix/${data.ActivitySixId}`);
                //         }}
                //         style={{
                //           backgroundColor: data.ActivitySixId ? "green" : "red",
                //         }}
                //         fullWidth
                //         variant="contained"
                //       >
                //         Activity 6
                //       </Button>
                //     </div>
                //   </AccordionDetails>
                // </Accordion>
              );
            }
          });
        })}
      </Box>
    );
  };

  return (
    <Container>
      <div
        style={{
          paddingLeft: 24,
          paddingRight: 24,
          marginTop: 50,
          marginBottom: 50,
        }}
      >
        {/* {!sessionStorage.getItem("UserId") && <Typography variant='h5'>Please login/register to access/create activities</Typography>} */}

        {!sessionStorage.getItem("UserId") && (
          <div>
            <Typography
              style={{ fontFamily: `"Lato", sans-serif`, fontSize: 40 }}
            >
              Welcome To Our Platform!
            </Typography>
            <Typography
              style={{ fontFamily: `"Lato", sans-serif`, fontSize: 20 }}
            >
              In order to access or create activities, please Log in or Register
              to unlock the full experience.
            </Typography>
            <Divider style={{ marginTop: 20 }} />
            <Typography
              style={{
                fontFamily: `"Lato", sans-serif`,
                fontSize: 20,
                marginTop: 20,
              }}
            >
              Upcoming features:
            </Typography>
            <Typography
              style={{ fontFamily: `"Lato", sans-serif`, fontSize: 20 }}
            >
              <strong>15/3/2024</strong>: Layout of components and labels in
              activity 4 and activity 5.
            </Typography>
            <Typography
              style={{ fontFamily: `"Lato", sans-serif`, fontSize: 20 }}
            >
              <strong>16/3/2024</strong>: Handling and creation of duplicates in
              activity 4 and activity 5.
            </Typography>
            <Typography
              style={{ fontFamily: `"Lato", sans-serif`, fontSize: 20 }}
            >
              <strong>17/3/2024</strong>: Integration of AI model.
            </Typography>
          </div>
        )}

        {sessionStorage.getItem("UserId") && displayActivities()}
      </div>
    </Container>
  );
}

export default Home;
