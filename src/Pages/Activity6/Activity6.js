import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Container,
  Divider,
  FormControlLabel,
  Switch,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const Act6 = () => {
  const [clustData, setClustData] = useState({});
  const [instructor, setInstructor] = useState(false);
  const [label, setLabel] = useState("Activity 6 Label");
  const [newChain, setNewChain] = useState(false);
  const [insightsAndNeeds, setInsightsAndNeeds] = useState({});
  const [blankTemplate, setBlankTemplate] = useState(false)
  const [instruction, setInstruction] = useState(`
      <Typography>The sentences and cluster labels you submitted for the previous activity have been arranged in the space below. For each cluster, add any number of insights that you think emerge from the selected sentences. After surfacing the insights, add a set of needs that relate to those insights one at a time. Identifying the insights and needs should be helpful when designing your prototype.</Typography>
      <br/>
      <br/>
      <Typography>When you are satisfied with your listed insights and needs, click the Submit button to complete this stage of the design thinking process. You can come back and make changes to your submissions whenever you like.</Typography>`);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    let data = {};

    if (sessionStorage.getItem("Occupation") == "Instructor") {
      setInstructor(true);
    }

    if (id === "null") {
      alert(
        "Please go back to the previous activity and submit it to continue."
      );
    }

    if (id) {
      axios
        .get(
          `https://activities-alset-aef528d2fd94.herokuapp.com/activitysix/byId/${id}`
        )
        .then((response) => {
          setLabel(response.data.label);
          setInstruction(response.data.instruction);
          if (response.data.content !== null) {
            setClustData(response.data.content);
            let insightsAndNeeds = {};
            if (response.data.content.content !== undefined) {
              Object.entries(response.data.content.content).map(
                ([key, value]) => {
                  if (value.type === "label") {
                    insightsAndNeeds[value.userClusterIndexA5] = {
                      content: {},
                      insights: {},
                      needs: {},
                      label: {
                        text: value.clusterLabelA5,
                        coreKey: value.coreKey,
                      },
                    };
                  }
                }
              );
              Object.entries(response.data.content.content).map(
                ([key, value]) => {
                  if (value.response_id) {
                    Object.entries(value.response_text).map(([key2, value2]) => {
                      if (value2.clusterData) {
                        console.log("insights n needs");
                        console.log(
                          insightsAndNeeds[value2.clusterData.userClusterIndexA5]
                        );
                        if (
                          insightsAndNeeds[
                          value2.clusterData.userClusterIndexA5
                          ] !== undefined
                        ) {
                          insightsAndNeeds[
                            value2.clusterData.userClusterIndexA5
                          ].content[
                            Object.keys(
                              insightsAndNeeds[
                                value2.clusterData.userClusterIndexA5
                              ].content
                            ).length
                          ] = {
                            text: value2.text,
                            coreKey: value2.clusterData.coreKey,
                            subKey: value2.clusterData.subKey,
                          };
                        }
                      }
                    });
                  }
                }
              );
              Object.entries(response.data.content.insightsAndNeeds).map(
                ([key, value]) => {
                  insightsAndNeeds[key].needs = value.needs;
                  insightsAndNeeds[key].insights = value.insights;
                }
              );

              setInsightsAndNeeds(insightsAndNeeds);
            } else {
              setBlankTemplate(true)
            }

          } else {
            axios
              .get(
                `https://activities-alset-aef528d2fd94.herokuapp.com/activityfive/byId/${sessionStorage.getItem(
                  "ActivityFiveId"
                )}`
              )
              .then((response) => {
                if (response.data !== null) {
                  let insightsAndNeeds = {};
                  Object.entries(response.data.content.content).map(
                    ([key, value]) => {
                      if (value.type === "label") {
                        insightsAndNeeds[value.userClusterIndexA5] = {
                          content: {},
                          insights: {},
                          needs: {},
                          label: {
                            text: value.clusterLabelA5,
                            coreKey: value.coreKey,
                          },
                        };
                      }
                    }
                  );

                  Object.entries(response.data.content.content).map(
                    ([key, value]) => {
                      if (value.response_id) {
                        Object.entries(value.response_text).map(
                          ([key2, value2]) => {
                            console.log("insights n needs");
                            console.log(
                              insightsAndNeeds[
                              value2.clusterData.userClusterIndexA5
                              ]
                            );
                            if (
                              insightsAndNeeds[
                              value2.clusterData.userClusterIndexA5
                              ] !== undefined
                            ) {
                              insightsAndNeeds[
                                value2.clusterData.userClusterIndexA5
                              ].content[
                                Object.keys(
                                  insightsAndNeeds[
                                    value2.clusterData.userClusterIndexA5
                                  ].content
                                ).length
                              ] = {
                                text: value2.text,
                                coreKey: value2.clusterData.coreKey,
                                subKey: value2.clusterData.subKey,
                              };
                            }
                          }
                        );
                      }
                    }
                  );
                  console.log("after");
                  console.log(insightsAndNeeds);
                  setInsightsAndNeeds(insightsAndNeeds);
                  setClustData(response.data.content);
                }
              });
          }
        });
    } else {
      axios
        .get(
          `https://activities-alset-aef528d2fd94.herokuapp.com/activityfive/byId/${sessionStorage.getItem(
            "ActivityFiveId"
          )}`
        )
        .then((response) => {
          if (response.data !== null) {
            console.log(response.data.content);
            let insightsAndNeeds = {};
            if (Object.entries(response.data.content).length !== 0) {
              Object.entries(response.data.content.content).map(
                ([key, value]) => {
                  if (value.type === "label") {
                    insightsAndNeeds[value.userClusterIndexA5] = {
                      content: {},
                      insights: {},
                      needs: {},
                      label: {
                        text: value.clusterLabelA5,
                        coreKey: value.coreKey,
                      },
                    };
                  }
                }
              );

              Object.entries(response.data.content.content).map(
                ([key, value]) => {
                  if (value.response_id) {
                    Object.entries(value.response_text).map(([key2, value2]) => {
                      if (value2.clusterData) {
                        console.log("insights n needs");
                        console.log(
                          insightsAndNeeds[value2.clusterData.userClusterIndexA5]
                        );
                        if (
                          insightsAndNeeds[
                          value2.clusterData.userClusterIndexA5
                          ] !== undefined
                        ) {
                          insightsAndNeeds[
                            value2.clusterData.userClusterIndexA5
                          ].content[
                            Object.keys(
                              insightsAndNeeds[
                                value2.clusterData.userClusterIndexA5
                              ].content
                            ).length
                          ] = {
                            text: value2.text,
                            coreKey: value2.clusterData.coreKey,
                            subKey: value2.clusterData.subKey,
                          };
                        }
                      }
                    });
                  }
                }
              );
            } else {
              setBlankTemplate(true)
            }
            setInsightsAndNeeds(insightsAndNeeds);
            setClustData(response.data.content);
          } else {
            alert(
              "Before progressing to Activity 6, please complete Activity 5."
            );
          }
        });
    }
  }, []);

  const getLabel = (data) => {
    return Object.entries(data.content).map(([key, value]) => {
      if (value.type === "label") {
        return <>{value.text}</>;
      }
    });
  };

  const checkLabel = (data) => {
    return Object.entries(data.content).map(([key, value]) => {
      if (value.type === "label") {
        return true;
      }
    });
  };

  const getContent = (data) => {
    return Object.entries(data.content).map(([key, value]) => {
      if (value.type !== "label") {
        return (
          <div
            style={{
              borderRadius: 15,
              margin: 10,
              fontFamily: `"Lato", sans-serif`,
              fontSize: 17,
            }}
          >
            {value.text}
          </div>
        );
      }
    });
  };

  const deleteInsight = (baseKey, key) => {
    setInsightsAndNeeds((prevData) => {
      const newData = JSON.parse(JSON.stringify(prevData));
      delete newData[baseKey].insights[key];
      return newData;
    });
  };

  const deleteNeeds = (baseKey, key) => {
    setInsightsAndNeeds((prevData) => {
      const newData = JSON.parse(JSON.stringify(prevData));
      delete newData[baseKey].needs[key];
      return newData;
    });
  };

  const getInsight = (data, baseKey) => {
    return Object.entries(data.insights).map(([key, value]) => {
      return (
        <div
          style={{
            borderRadius: 5,
            border: "1px solid black",
            padding: 10,
            margin: "0px 10px 10px 10px",
            backgroundColor: "#6699CC",
          }}
        >
          <Typography
            onBlur={() => {
              let element = document.querySelector(
                `[Insight-id="${baseKey.toString() + key.toString()}"]`
              );
              element.innerHTML === "" || element.innerHTML === `<br>`
                ? deleteInsight(baseKey, key)
                : console.log(element.innerHTML);
            }}
            Insight-id={baseKey.toString() + key.toString()}
            contenteditable="true"
            style={{ fontFamily: `"Lato", sans-serif`, fontSize: 17 }}
          >
            {value}
          </Typography>
        </div>
      );
    });
  };

  const getNeed = (data, baseKey) => {
    return Object.entries(data.needs).map(([key, value]) => {
      return (
        <div
          style={{
            borderRadius: 5,
            border: "1px solid black",
            padding: 10,
            margin: "0px 10px 10px 10px",
            backgroundColor: "#008080",
          }}
        >
          <Typography
            onBlur={() => {
              let element = document.querySelector(
                `[Needs-id="${baseKey.toString() + key.toString()}"]`
              );
              element.innerHTML === "" || element.innerHTML === `<br>`
                ? deleteNeeds(baseKey, key)
                : console.log(element.innerHTML);
            }}
            Needs-id={baseKey.toString() + key.toString()}
            contenteditable="true"
            style={{ fontFamily: `"Lato", sans-serif`, fontSize: 17 }}
          >
            {value}
          </Typography>
        </div>
      );
    });
  };

  const addInsight = (key) => {
    setInsightsAndNeeds((prevData) => {
      const newData = JSON.parse(JSON.stringify(prevData));
      newData[key].insights[Object.keys(newData[key].insights).length] = "Edit";
      return newData;
    });
  };

  const addNeed = (key) => {
    setInsightsAndNeeds((prevData) => {
      const newData = JSON.parse(JSON.stringify(prevData));
      newData[key].needs[Object.keys(newData[key].needs).length] = "Edit";
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    replaceName();

    if (!id) {
      delete clustData["MLClusters"];
    }

    console.log("submit - 1");
    console.log(insightsAndNeeds);
    console.log(clustData);

    let finalData = {};
    finalData.content = clustData;
    delete finalData["id"];
    finalData.label = document.getElementById("activity-six-label").innerHTML;
    finalData.instruction = document.getElementById(
      "activity-six-instruction"
    ).innerHTML;
    finalData.UserId = sessionStorage.getItem("UserId");
    finalData.ActivityFiveId = sessionStorage.getItem("ActivityFiveId");
    finalData.content.insightsAndNeeds = {};
    finalData.activity_mvc = {};

    Object.entries(insightsAndNeeds).map(([key, value]) => {
      finalData.content.insightsAndNeeds[key] = {
        insights: value.insights,
        needs: value.needs,
      };
    });

    console.log("submit - 2");
    console.log(finalData);

    let data = {
      id: sessionStorage.getItem("ActivitiesId"),
      content: finalData,
    };

    if (newChain) {
      await axios
        .post(
          "https://activities-alset-aef528d2fd94.herokuapp.com/activitysix/new-chain",
          data
        )
        .then((response) => {
          const ActivitiesID = response.data.ActivitiesId.id;
          const ActivitySixId = response.data.ActivitySixId;
          sessionStorage.setItem("ActivitiesId", ActivitiesID);
          sessionStorage.setItem("ActivitySixId", ActivitySixId);
        });
    } else if (id) {
      await axios.post(
        `https://activities-alset-aef528d2fd94.herokuapp.com/activitysix/byId/${id}`,
        data
      );

      if (!instructor) {
        let data = {
          DateTime: Date.now(),
          StudentTemplateId: sessionStorage.getItem("ActivitiesId"),
          StudentId: sessionStorage.getItem("UserId"),
          Event: "Update",
          ActivityId: sessionStorage.getItem("ActivitySixId"),
          ActivityType: "Activity 6",
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
          ActivityId: sessionStorage.getItem("ActivitySixId"),
          ActivityType: "Activity 6",
        };
        await axios.post(
          `https://activities-alset-aef528d2fd94.herokuapp.com/instructorlog/create`,
          data
        );
      }

      // create a suitable alternative for the summaries table

      console.log(finalData);

      // current version below is not suitable
    } else {
      await axios
        .post(
          "https://activities-alset-aef528d2fd94.herokuapp.com/activitysix",
          data
        )
        .then((response) => {
          const ActivitySixId = response.data.id;
          sessionStorage.setItem("ActivitySixId", ActivitySixId);
        });

      if (!instructor) {
        let data = {
          DateTime: Date.now(),
          StudentTemplateId: sessionStorage.getItem("ActivitiesId"),
          StudentId: sessionStorage.getItem("UserId"),
          Event: "Create",
          ActivityId: sessionStorage.getItem("ActivitySixId"),
          ActivityType: "Activity 6",
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
          ActivityId: sessionStorage.getItem("ActivitySixId"),
          ActivityType: "Activity 6",
        };
        await axios.post(
          `https://activities-alset-aef528d2fd94.herokuapp.com/instructorlog/create`,
          data
        );
      }
      let summary_data = {};

      const correspondingLabelA4 = (index) => {
        const foundEntry = Object.entries(finalData.content.content).find(
          ([key, value]) => {
            if (value.type === "label") {
              return value.userClusterIndexA4 === index;
            }
          }
        );
        if (foundEntry) {
          const [key, value] = foundEntry;
          return value.clusterLabelA4;
        } else {
          return null;
        }

      };

      const correspondingLabelA5 = (index) => {
        const foundEntry = Object.entries(finalData.content.content).find(
          ([key, value]) => {
            if (value.type === "label") {
              return value.userClusterIndexA5 === index;
            }
          }
        );
        if (foundEntry) {
          const [key, value] = foundEntry;
          return value.clusterLabelA5;
        } else {
          return null;
        }
      };

      if (!instructor) {
        if (finalData.content.content !== undefined) {
          Object.entries(finalData.content.content).map(([key, value]) => {
            if (value.response_id) {
              Object.entries(value.response_text).map(([key2, value2]) => {
                if (value2.clusterData) {
                  if (
                    !finalData.content.insightsAndNeeds[
                    value2.clusterData.userClusterIndexA5
                    ] ||
                    (Object.keys(
                      finalData.content.insightsAndNeeds[
                        value2.clusterData.userClusterIndexA5
                      ].insights
                    ).length === 0 &&
                      Object.keys(
                        finalData.content.insightsAndNeeds[
                          value2.clusterData.userClusterIndexA5
                        ].needs
                      ).length === 0)
                  ) {
                    summary_data[Object.keys(summary_data).length] = {
                      InstructorId: null,
                      ActivitySequenceId: null,
                      StudentId: parseInt(sessionStorage.getItem("UserId")),
                      StudentTemplateId: parseInt(
                        sessionStorage.getItem("ActivitiesId")
                      ),
                      InterviewerSentenceIndexA1: value.response_id,
                      InterviewerSentenceContentA1:
                        finalData.content.content[value.response_id].question_text,
                      IntervieweeSentenceIndexA1: parseInt(key2),
                      IntervieweeSentenceContentA1: value2.text,
                      SentenceUserHighlightA2: value2.sentenceUserHighlightA2,
                      SentenceUserHighlightA3: value2.sentenceUserHighlightA3,
                      SentenceMLHighlightA3: value2.sentenceMLHighlightA3,
                      UserClusterIndexA4: value2.clusterData.userClusterIndexA4,
                      UserClusterLabelA4: correspondingLabelA4(
                        value2.clusterData.userClusterIndexA4
                      ),
                      UserClusterIndexA5: value2.clusterData.userClusterIndexA5,
                      UserClusterLabelA5: correspondingLabelA5(
                        value2.clusterData.userClusterIndexA5
                      ),
                      MLClusterIndexA5: value2.sentenceAIClassified,
                      InsightIndex: null,
                      InsightLabel: null,
                      NeedIndex: null,
                      NeedLabel: null,
                    };
                  } else if (
                    Object.keys(
                      finalData.content.insightsAndNeeds[
                        value2.clusterData.userClusterIndexA5
                      ].insights
                    ).length === 0
                  ) {
                    Object.entries(
                      finalData.content.insightsAndNeeds[
                        value2.clusterData.userClusterIndexA5
                      ].needs
                    ).map(([key4, value4]) => {
                      summary_data[Object.keys(summary_data).length] = {
                        InstructorId: null,
                        ActivitySequenceId: null,
                        StudentId: parseInt(sessionStorage.getItem("UserId")),
                        StudentTemplateId: parseInt(
                          sessionStorage.getItem("ActivitiesId")
                        ),
                        InterviewerSentenceIndexA1: value.response_id,
                        InterviewerSentenceContentA1:
                          finalData.content.content[value.response_id]
                            .question_text,
                        IntervieweeSentenceIndexA1: parseInt(key2),
                        IntervieweeSentenceContentA1: value2.text,
                        SentenceUserHighlightA2: value2.sentenceUserHighlightA2,
                        SentenceUserHighlightA3: value2.sentenceUserHighlightA3,
                        SentenceMLHighlightA3: value2.sentenceMLHighlightA3,
                        UserClusterIndexA4: value2.clusterData.userClusterIndexA4,
                        UserClusterLabelA4: correspondingLabelA4(
                          value2.clusterData.userClusterIndexA4
                        ),
                        UserClusterIndexA5: value2.clusterData.userClusterIndexA5,
                        UserClusterLabelA5: correspondingLabelA5(
                          value2.clusterData.userClusterIndexA5
                        ),
                        MLClusterIndexA5: value2.sentenceAIClassified,
                        InsightIndex: null,
                        InsightLabel: null,
                        NeedIndex: key4,
                        NeedLabel: value4,
                      };
                    });
                  } else if (
                    Object.keys(
                      finalData.content.insightsAndNeeds[
                        value2.clusterData.userClusterIndexA5
                      ].needs
                    ).length === 0
                  ) {
                    Object.entries(
                      finalData.content.insightsAndNeeds[
                        value2.clusterData.userClusterIndexA5
                      ].insights
                    ).map(([key3, value3]) => {
                      summary_data[Object.keys(summary_data).length] = {
                        InstructorId: null,
                        ActivitySequenceId: null,
                        StudentId: parseInt(sessionStorage.getItem("UserId")),
                        StudentTemplateId: parseInt(
                          sessionStorage.getItem("ActivitiesId")
                        ),
                        InterviewerSentenceIndexA1: value.response_id,
                        InterviewerSentenceContentA1:
                          finalData.content.content[value.response_id]
                            .question_text,
                        IntervieweeSentenceIndexA1: parseInt(key2),
                        IntervieweeSentenceContentA1: value2.text,
                        SentenceUserHighlightA2: value2.sentenceUserHighlightA2,
                        SentenceUserHighlightA3: value2.sentenceUserHighlightA3,
                        SentenceMLHighlightA3: value2.sentenceMLHighlightA3,
                        UserClusterIndexA4: value2.clusterData.userClusterIndexA4,
                        UserClusterLabelA4: correspondingLabelA4(
                          value2.clusterData.userClusterIndexA4
                        ),
                        UserClusterIndexA5: value2.clusterData.userClusterIndexA5,
                        UserClusterLabelA5: correspondingLabelA5(
                          value2.clusterData.userClusterIndexA5
                        ),
                        MLClusterIndexA5: value2.sentenceAIClassified,
                        InsightIndex: key3,
                        InsightLabel: value3,
                        NeedIndex: null,
                        NeedLabel: null,
                      };
                    });
                  } else {
                    Object.entries(
                      finalData.content.insightsAndNeeds[
                        value2.clusterData.userClusterIndexA5
                      ].insights
                    ).map(([key3, value3]) => {
                      Object.entries(
                        finalData.content.insightsAndNeeds[
                          value2.clusterData.userClusterIndexA5
                        ].needs
                      ).map(([key4, value4]) => {
                        summary_data[Object.keys(summary_data).length] = {
                          InstructorId: null,
                          ActivitySequenceId: null,
                          StudentId: parseInt(sessionStorage.getItem("UserId")),
                          StudentTemplateId: parseInt(
                            sessionStorage.getItem("ActivitiesId")
                          ),
                          InterviewerSentenceIndexA1: value.response_id,
                          InterviewerSentenceContentA1:
                            finalData.content.content[value.response_id]
                              .question_text,
                          IntervieweeSentenceIndexA1: parseInt(key2),
                          IntervieweeSentenceContentA1: value2.text,
                          SentenceUserHighlightA2: value2.sentenceUserHighlightA2,
                          SentenceUserHighlightA3: value2.sentenceUserHighlightA3,
                          SentenceMLHighlightA3: value2.sentenceMLHighlightA3,
                          UserClusterIndexA4: value2.clusterData.userClusterIndexA4,
                          UserClusterLabelA4: correspondingLabelA4(
                            value2.clusterData.userClusterIndexA4
                          ),
                          UserClusterIndexA5: value2.clusterData.userClusterIndexA5,
                          UserClusterLabelA5: correspondingLabelA5(
                            value2.clusterData.userClusterIndexA5
                          ),
                          MLClusterIndexA5: value2.sentenceAIClassified,
                          InsightIndex: key3,
                          InsightLabel: value3,
                          NeedIndex: key4,
                          NeedLabel: value4,
                        };
                      });
                    });
                  }
                }

              });
            }
          });
        }

      }
      console.log("summary-data-result");
      console.log(summary_data);
      Object.entries(summary_data).map(([key, value]) => {
        axios.post(
          `https://activities-alset-aef528d2fd94.herokuapp.com/summary/create`,
          value
        );
      });
    }
    navigate("/home");
  };

  const replaceName = () => {
    Object.entries(insightsAndNeeds).map(([key, value]) => {
      Object.entries(value.insights).map(([key2, value2]) => {
        let val = document.querySelector(
          `[Insight-id="${key.toString() + key2.toString()}"]`
        ).innerHTML;
        insightsAndNeeds[key].insights[key2] = val;
      });
      Object.entries(value.needs).map(([key2, value2]) => {
        let val = document.querySelector(
          `[Needs-id="${key.toString() + key2.toString()}"]`
        ).innerHTML;
        insightsAndNeeds[key].needs[key2] = val;
      });
    });
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
        {/* <h2>Activity 6:</h2>&nbsp;&nbsp; */}
        <h2
          dangerouslySetInnerHTML={{ __html: ` ${label}` }}
          contentEditable="true"
          style={{
            minHeight: 1,
            borderRight: "solid rgba(0,0,0,0) 1px",
            outline: "none",
          }}
          id="activity-six-label"
        ></h2>
        <Button
          onClick={() => {
            window.location.reload(false);
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
      <form onSubmit={handleSubmit}>

        <Typography
          id="activity-six-instruction"
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
        {blankTemplate && <Typography className="infoText">
          No transcript has been displayed since no data was entered in Activity 1.
        </Typography>}
        {!blankTemplate && (
          <div>
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "space-around",
                marginTop: 20,
                marginBottom: 10,
              }}
            >
              <Typography
                style={{ fontFamily: `"Lato", sans-serif`, fontSize: 17 }}
              >
                Cluster
              </Typography>
              <Typography
                style={{ fontFamily: `"Lato", sans-serif`, fontSize: 17 }}
              >
                Insights
              </Typography>
              <Typography
                style={{ fontFamily: `"Lato", sans-serif`, fontSize: 17 }}
              >
                Needs
              </Typography>
            </div>
            <Divider></Divider>
            {Object.entries(insightsAndNeeds).map(([key, value]) => {
              {
                console.log(insightsAndNeeds);
              }
              return (
                <>
                  <div
                    key={key}
                    style={{
                      display: "flex",
                      with: "100%",
                      justifyContent: "space-around",
                      marginTop: 10,
                      marginBottom: 10,
                    }}
                  >
                    <div style={{ width: "100%" }}>
                      <Accordion style={{ borderRadius: 3 }}>
                        <AccordionSummary
                          style={{ backgroundColor: "#E6E6FA" }}
                          expandIcon={<ExpandMoreIcon />}
                        >
                          <Typography
                            style={{
                              fontFamily: `"Lato", sans-serif`,
                              fontSize: 17,
                            }}
                          >
                            {value.label.text}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>{getContent(value)}</AccordionDetails>
                      </Accordion>
                    </div>
                    <div style={{ width: "100%" }}>
                      {getInsight(value, key)}
                      <Button
                        variant="outlined"
                        onClick={() => addInsight(key)}
                        style={{
                          padding: "10px",
                          minWidth: "0",
                          marginLeft: 15,
                          width: "20px",
                          height: "20px",
                          borderRadius: "50%",
                          textAlign: "center",
                        }}
                      >
                        +
                      </Button>
                    </div>
                    <div style={{ width: "100%" }}>
                      {getNeed(value, key)}
                      <Button
                        variant="outlined"
                        onClick={() => addNeed(key)}
                        style={{
                          padding: "10px",
                          minWidth: "0",
                          marginLeft: 15,
                          width: "20px",
                          height: "20px",
                          borderRadius: "50%",
                          textAlign: "center",
                        }}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </>
              );
            })}
          </div>
        )}
        <Button
          sx={{ marginTop: 3, marginBottom: 3 }}
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

export default Act6;
