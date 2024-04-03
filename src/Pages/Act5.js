import {
  Box,
  Button,
  ButtonGroup,
  Container,
  FormControlLabel,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import Draggable from "react-draggable";
import {
  json,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { getColor } from "../Components/Colors.js";

const Act5 = () => {
  const [clustData, setClustData] = useState({});
  const [oriData, setOriData] = useState({});
  const [viewUser, setViewUser] = useState(true);
  const [containerHeight, setContainerHeight] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [MLClusters, setMLClusters] = useState(false);
  const [newChain, setNewChain] = useState(false);
  const [alternateView, setAlternateView] = useState(false);
  const [AISetting, setAISetting] = useState(false);
  const [AIClusters, setAIClusters] = useState({});
  const [instructor, setInstructor] = useState(false);
  const [label, setLabel] = useState("Activity 5 Label");
  const [instruction, setInstruction] = useState(`
    <Typography>For this activity, you will see two views of your clusters and labels. In the User view, you will see the arrangement you submitted in the previous activity or the arrangement you are currently working on. In the Alternative view, you will see how the AI model would have clustered the sentences you selected. The Alternative view does not provide labels for the clusters, but you might be able to infer them yourself.</Typography>
    <br />
    <br />
    <Typography>Compare the two arrangement and refine the arrangement in the User view in anyway that you feel improves it. When you are satisfied with the arrangement in the User view, click the Submit button to continue to the next activity.</Typography>`);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id === "null") {
      alert(
        "Please go back to the previous activity and submit it to continue."
      );
    }

    if (sessionStorage.getItem("Occupation") == "Instructor") {
      setInstructor(true);
    }

    let height = sessionStorage.getItem("mainContainerHeight");

    if (id) {
      axios
        .get(
          `https://activities-alset-aef528d2fd94.herokuapp.com/activityfive/byId/${id}`
        )
        .then((response) => {
          if (response.data !== null) {
            if (response.data.MLClusters) {
              setMLClusters(response.data.MLClusters);
            } else {
              setMLClusters(false);
            }

            setLabel(response.data.label);
            setInstruction(response.data.instruction);

            if (response.data.content) {
              setClustData(response.data.content);
            } else {
              axios
                .get(
                  `https://activities-alset-aef528d2fd94.herokuapp.com/activityfour/byId/${sessionStorage.getItem(
                    "ActivityFourId"
                  )}`
                )
                .then((response) => {
                  if (response.data !== null) {
                    setClustData(response.data.content);

                    // axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/activitythree/byId/${sessionStorage.getItem("ActivityThreeId")}`).then((response) => {
                    //     if (response.data != null) {
                    //         setOriData(response.data)
                    //     }
                    // })
                  }
                });
            }

            if (height != null) {
              setContainerHeight(parseInt(height) + 50);
            }
          }
        });
      axios
        .get(
          `https://activities-alset-aef528d2fd94.herokuapp.com/activitythree/byId/${sessionStorage.getItem(
            "ActivityThreeId"
          )}`
        )
        .then((response) => {
          if (response.data != null) {
            setOriData(response.data);
          }
        });
    } else {
      axios
        .get(
          `https://activities-alset-aef528d2fd94.herokuapp.com/activityfour/byId/${sessionStorage.getItem(
            "ActivityFourId"
          )}`
        )
        .then((response) => {
          if (response.data !== null) {
            console.log(response.data.content);
            setClustData(response.data.content);

            // axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/activitythree/byId/${sessionStorage.getItem("ActivityThreeId")}`).then((response) => {
            //     if (response.data != null) {
            //         setOriData(response.data)
            //     }
            // })

            if (height != null) {
              setContainerHeight(parseInt(height) + 50);
            }
          } else {
            alert(
              "Before progressing to Activity 5, please complete Activity 4."
            );
          }
        });
    }
  }, []);

  const createAIClustering = () => {
    AI_clusters();

    // let clusters = {}
    // console.log("to clusters")
    // if (!AISetting) {
    //     console.log("should be once")
    //     clusters = AI_clusters()
    //     setAISetting(true)
    //     setAIClusters(clusters)
    // } else {
    //     clusters = AIClusters
    //     console.log(clusters)
    // }

    // const check = new RegExp('background-color: yellow', 'g');
    // console.log("AI Clusters")
    // console.log(clusters)
    // let x_coordinate = 200
    // let y_coordinate = 200
    // let count = 0
    // if (MLClusters) {
    //     // return <>yay</>
    //     Object.entries(clusters).map(([key, value], index) => {
    //         if (Object.entries(value.content).length != 0) {
    //             Object.entries(value.content).map(([key2, value2]) => {
    //                 Object.entries(clustData).map(([key3, value3]) => {
    //                     if (value2.text == value3.text) {
    //                         console.log(value2.text)
    //                         console.log(value3.text)
    //                         console.log(clusters[key].color)
    //                         clustData[key3].ai_color = clusters[key].color
    //                     }
    //                 })
    //             })
    //         }
    //     })
    // } else {
    //     return <>no</>
    // }
  };

  const createLabel = () => {

    const dataLength = Object.keys(clustData.content).length;
    let data_y = 0;
    let data = clustData;
    for (let i = dataLength; i > 1; i -= 2) {
      if (data.content[i].type === "label") {
        data_y = data.content[i].y + 60;
        break;
      }
      for (let j = Object.keys(data.content[i].response_text).length; j > 1; j--) {
        if (data.content[i].response_text[j].clusterData) {
          data_y = data.content[i].response_text[j].clusterData.y + 100;
          break;
        }
      }
    }

    const key = uuidv4();
    const currColor = getColor();
    setClustData((prevState) => {
      const newData = {
        ...prevState,
        content: {
          ...prevState.content,
          [dataLength + 1]: {
            id: key,
            clusterLabelA5: "Click to edit label",
            x: 120,
            y: data_y,
            new_x: 0,
            new_y: 0,
            userClusterIndexA5: -1,
            type: "label",
            color: currColor,
          },
        },
      };
      return newData;
    });

    // const newKey = Object.keys(clustData).length;
    // let data_y = 0
    // let data = clustData
    // let value = data[newKey - 1].y
    // if (data[newKey - 1].type === "label") {
    //     data_y = value + 60
    // } else {
    //     data_y = value + 100
    // }

    // const key = uuidv4()
    // const currColor = getColor();
    // data = { [newKey]: { id: key, text: "Click to edit label", x: 120, y: data_y, new_x: 0, new_y: 0, class: -1, type: "label", color: currColor }, ...clustData };
    // console.log(data)
    // setClustData(data);

    scrollNewLabelIntoView(key);
  };
  const checkProximity = (x1, y1, x2, y2, height1, height2) => {
    if (Math.abs(x1 - x2) <= 230) {
      if (height1 == 120 && height2 == 120) {
        if (Math.abs(y1 - y2) <= 140) {
          return true;
        }
      }
      if (height1 == 40 && height2 == 40) {
        if (Math.abs(y1 - y2) <= 60) {
          return true;
        }
      } else {
        if (Math.abs(y1 - y2) <= 110) {
          return true;
        }
      }
    } else {
      return false;
    }
  };

  const checkClass = () => {
    let userData = clustData;
    let currentClass = 0;
    let flag = false;
    let flag2 = false;
    let colorsUsedData = {};
    let checkClassData = {};
    console.log(userData);

    // Object.entries(userData).map(([key, value]) => {
    //     value.class = -1
    // })

    Object.entries(userData.content).map(([key, data]) => {
      if (data.type === "label") {
        data.userClusterIndexA5 = -1;
      } else if (data.response_id) {
        Object.entries(data.response_text).map(([key2, data2]) => {
          if (data2.clusterData) {
            data2.clusterData.userClusterIndexA5 = -1;
          }
        });
      }
    });

    Object.entries(userData.content).map(([key, data]) => {
      if (data.response_id) {
        Object.entries(data.response_text).map(([key2, data2]) => {
          if (data2.clusterData) {
            data2.clusterData.coreKey = key;
          data2.clusterData.subKey = key2;
          checkClassData[Object.keys(checkClassData).length + 1] =
            data2.clusterData;
          }
        });
      } else if (data.type === "label") {
        data.coreKey = key;
        checkClassData[Object.keys(checkClassData).length + 1] = data;
      }
    });

    // Object.entries(userData).map(([key, value]) => {
    //     Object.entries(userData).map(([key2, value2]) => {
    //         if (checkProximity(value.x + value.new_x, value.y + value.new_y, value2.x + value2.new_x, value2.y + value2.new_y, value.type, value2.type, value.height, value2.height) && value2.class === -1) {
    //             console.log(value)
    //             console.log(value2)
    //             if (flag === true) {
    //                 currentClass = currentClass + 1
    //                 flag = false
    //                 flag2 = true
    //             }
    //             if (flag2 === true && value.class !== -1) {
    //                 currentClass = currentClass - 1
    //                 flag2 = false
    //                 userData[key2].class = userData[key].class
    //                 if (userData[key2].type == "label") {
    //                     colorsUsedData[userData[key2].class] = userData[key2].color
    //                 }
    //             } else {
    //                 userData[key2].class = currentClass
    //                 flag2 = false
    //                 if (userData[key2].type == "label") {
    //                     colorsUsedData[userData[key2].class] = userData[key2].color
    //                 }
    //             }
    //             console.log(currentClass)
    //         }
    //     })
    //     flag = true
    //     flag2 = false
    // })

    Object.entries(checkClassData).map(([key, value]) => {
      Object.entries(checkClassData).map(([key2, value2]) => {
        if (
          checkProximity(
            value.x + value.new_x,
            value.y + value.new_y,
            value2.x + value2.new_x,
            value2.y + value2.new_y,
            value.height,
            value2.height
          ) &&
          value2.userClusterIndexA5 === -1
        ) {
          if (flag === true) {
            currentClass = currentClass + 1;
            flag = false;
            flag2 = true;
          }
          if (flag2 === true && value.userClusterIndexA5 !== -1) {
            currentClass = currentClass - 1;
            flag2 = false;

            checkClassData[key2].userClusterIndexA5 =
              checkClassData[key].userClusterIndexA5;
            if (checkClassData[key2].type == "label") {
              colorsUsedData[checkClassData[key2].userClusterIndexA5] =
                checkClassData[key2].color;
            }
          } else {
            checkClassData[key2].userClusterIndexA5 = currentClass;
            flag2 = false;
            if (checkClassData[key2].type == "label") {
              colorsUsedData[checkClassData[key2].userClusterIndexA5] =
                checkClassData[key2].color;
            }
          }
        }
      });
      flag = true;
      flag2 = false;
    });

    Object.entries(checkClassData).map(([key, data]) => {
      if (data.subKey) {
        userData.content[data.coreKey].response_text[
          data.subKey
        ].clusterData.class = data.userClusterIndexA5;
      } else {
        userData.content[data.coreKey].userClusterIndexA5 =
          data.userClusterIndexA5;
      }
    });

    console.log(userData);
    setClustData(userData);
    return colorsUsedData;
  };

  const checkClustering = () => {
    Object.entries(clustData.content).map(([key, data]) => {
      if (data.type === "label") {
        const element = document.querySelector(`[height-id="${data.id}"]`);
        clustData.content[key].height = element.clientHeight;
      } else if (data.response_id) {
        Object.entries(data.response_text).map(([key2, data2]) => {
          if (data2.clusterData) {
            console.log(data2);
          const element = document.querySelector(
            `[height-id="${data2.clusterData.id}"]`
          );
          clustData.content[key].response_text[key2].clusterData.height =
            element.clientHeight;
          }
        });
      }
    });

    // Object.entries(clustData).map(([key, data]) => {
    //     console.log(key)
    //     const element = document.querySelector(`[height-id="${data.id}"]`)
    //     console.log(element.clientHeight)
    //     clustData[key].height = element.clientHeight
    // })

    let colorsUsedData = {};
    colorsUsedData = checkClass();
    replaceLabelNames();
    const updatedClustData = { ...clustData };

    Object.entries(updatedClustData.content).forEach(([key, value]) => {
      if (value.response_id) {
        Object.entries(value.response_text).map(([key2, value2]) => {
          if (value2.clusterData) {
            updatedClustData.content[key].response_text[key2].clusterData.color = colorsUsedData[value2.clusterData.userClusterIndexA5];
          }
        });
      }
    });

    // Object.entries(updatedClustData).forEach(([key, value]) => {
    //     if (value.type !== "label") {
    //         updatedClustData[key].color = colorsUsedData[value.class];
    //     }
    // });

    console.log(updatedClustData);
    setClustData(updatedClustData);
  };

  const replaceLabelNames = () => {
    let data = clustData;

    console.log("label name replacement - pre");
    console.log(data);

    Object.entries(data.content).map(([key, value]) => {
      if (value.type === "label") {
        let val = document.getElementById(value.id).innerHTML;
        data.content[key].clusterLabelA5 = val;
      }
    });

    // let data = clustData
    // console.log(data)
    // Object.entries(data).map(([key, value]) => {
    //     if (value.type === "label") {
    //         let val = document.getElementById(value.id).innerHTML
    //         data[key].text = val
    //     }
    // })
    setClustData(data);
  };

  const displayConfig = () => {
    if (sessionStorage.getItem("Occupation") === "Instructor") {
      return (
        <div style={{ width: "100%" }}>
          <FormControlLabel
            style={{ marginTop: 10 }}
            control={
              <Switch
                checked={MLClusters}
                onChange={() => setMLClusters((prev) => !prev)}
              />
            }
            label="Allow Machine Learning Clustering"
          />
        </div>
      );
    }
  };

  const handleDrag = (e, data, coreKey, subKey) => {
    //let userData = clustData
    // let ori_x = userData[key].x
    // let ori_y = userData[key].y
    // checkClustering()
    // setClustData((prevData) => ({
    //     ...prevData,
    //     [key]: { ...prevData[key], new_x: data.x, new_y: data.y },
    // }));
    // console.log(clustData)

    let userData = clustData;
    checkClustering();

    console.log("handle drag - 1");
    console.log(coreKey);
    console.log(subKey);

    setClustData((prevState) => {
      const updatedContent = { ...prevState.content };
      if (subKey !== undefined) {
        const updatedSubItem = {
          ...updatedContent[coreKey].response_text[subKey].clusterData,
          new_x: data.x,
          new_y: data.y,
        };
        updatedContent[coreKey].response_text[subKey].clusterData =
          updatedSubItem;
      } else {
        const updatedItem = {
          ...updatedContent[coreKey],
          new_x: data.x,
          new_y: data.y,
        };
        updatedContent[coreKey] = updatedItem;
      }
      return { ...prevState, content: updatedContent };
    });
  };

  const displayComponents = () => {
    if (Object.keys(clustData).length !== 0) {
      return Object.entries(clustData.content).map(([key, data]) => {
        if (data.type === "label") {
          if (data.removed === true) {
            return (
              <Draggable
                defaultPosition={{ x: data.new_x, y: data.new_y }}
                key={data.id}
                onDrag={(e, data) => handleDrag(e, data, key)}
                bounds="parent"
              >
                <div
                  height-id={data.id}
                  style={{
                    maxWidth: 200,
                    maxHeight: 20,
                    padding: 10,
                    margin: 10,
                    cursor: "move",
                    whiteSpace: "nowrap",
                  }}
                >
                  <Typography
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                      }
                    }}
                    style={{
                      borderRadius: 5,
                      padding: 1,
                      display: "flex",
                      overflowX: "hidden",
                    }}
                    id={data.id}
                    variant="h6"
                  >
                    {data.clusterLabelA5
                      ? data.clusterLabelA5
                      : data.clusterLabelA4}
                  </Typography>
                </div>
              </Draggable>
            );
          } else {
            return (
              <Draggable
                defaultPosition={{ x: data.new_x, y: data.new_y }}
                key={data.id}
                onDrag={(e, data) => handleDrag(e, data, key)}
                bounds="parent"
              >
                <div
                  height-id={data.id}
                  style={{
                    maxWidth: 200,
                    maxHeight: 20,
                    padding: 10,
                    margin: 10,
                    cursor: "move",
                    whiteSpace: "nowrap",
                  }}
                >
                  <Typography
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                      }
                    }}
                    style={{
                      border: "1px solid black",
                      backgroundColor: alternateView
                        ? data.ai_color
                        : data.color,
                      borderRadius: 5,
                      padding: 1,
                      display: "flex",
                      overflowX: "hidden",
                    }}
                    id={data.id}
                    onBlur={() => {
                      let text = document.getElementById(data.id).innerHTML;
                      text === "" || text === `<br>`
                        ? removeLabel(data.id, key)
                        : console.log(text);
                    }}
                    contenteditable="true"
                    variant="h6"
                  >
                    {data.clusterLabelA5
                      ? data.clusterLabelA5
                      : data.clusterLabelA4}
                  </Typography>
                </div>
              </Draggable>
            );
          }
        } else if (data.response_id) {
          return Object.entries(data.response_text).map(([key2, data2]) => {
            if (data2.clusterData) {
              return (
                <Draggable
                  defaultPosition={{
                    x: data2.clusterData.new_x,
                    y: data2.clusterData.new_y,
                  }}
                  key={data2.clusterData.id}
                  onDrag={(e, data) => handleDrag(e, data, key, key2)}
                  bounds="parent"
                >
                  <div
                    height-id={data2.clusterData.id}
                    style={{
                      width: 200,
                      height: 100,
                      backgroundColor: alternateView
                        ? data2.clusterData.AIColor
                        : data2.clusterData.color
                        ? data2.clusterData.color
                        : "lightgrey",
                      padding: 10,
                      margin: 10,
                      cursor: "move",
                      borderRadius: 15,
                      border: "1px solid black",
                      overflow: "hidden",
                    }}
                  >
                    <Tooltip title={data.response_text[key2].text}>
                      <Typography id={data2.clusterData.id} fontSize={13}>
                        {data.response_text[key2].text}
                      </Typography>
                    </Tooltip>
                  </div>
                </Draggable>
              );
            }
          });
        }
      });
    }
  };

  const scrollNewLabelIntoView = (key) => {
    setTimeout(() => {
      const labelElement = document.getElementById(key);
      if (labelElement) {
        labelElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 0);
  };

  const AI_clusters = () => {
    let clusters = {
      0: getColor(),
      1: getColor(),
      2: getColor(),
      3: getColor(),
      4: getColor(),
    };

    // const ori_y = 0
    // const ori_x = 0
    // const check = new RegExp('background-color: yellow', 'g');
    console.log("clust data");
    console.log(clustData);
    // Object.entries(oriData.content).map(([key, value]) => {
    //     if (value.questioner_tag === undefined) {
    //         Object.entries(value.response_text).map(([key2, value2]) => {
    //             console.log(value2)
    //             if ((value2.AI_classified !== -1 && value2.AI_classified !== undefined) && value2.activity_mvc.css.match(check) || value2.activity_mvc.css.match(check)) {
    //                 clusters[value2.AI_classified.toString()].content[Object.keys(clusters[value2.AI_classified.toString()]).length - 1] = value2
    //             }
    //         })
    //     }
    // })

    Object.entries(clustData.content).map(([key, value]) => {
      if (value.response_id) {
        Object.entries(value.response_text).map(([key2, value2]) => {
          if (value2.sentenceAIClassified !== -1) {
            clustData.content[key].response_text[key2].clusterData.AIColor =
              clusters[value2.sentenceAIClassified];
          }
        });
      }
    });

    // Object.entries(clustData).map(([key, value]) => {
    //     if (value.AI_classified != null && value.ai_color == null && value.AI_classified != -1) {
    //         clustData[key].ai_color = clusters[value.AI_classified.toString()]
    //         //clusters[value.AI_classified.toString()].content[Object.keys(clusters[value.AI_classified.toString()]).length - 1] = value
    //     } else if (value.AI_classified != null && value.AI_classified == -1) {
    //         clustData[key].ai_color = ''
    //     }
    // })
    console.log("returned");
    console.log(clustData);
    return clusters;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Object.entries(clustData).map(([key, data]) => {
    //     console.log(key)
    //     const element = document.querySelector(`[height-id="${data.id}"]`)
    //     console.log(element.clientHeight)
    //     clustData[key].height = element.clientHeight
    // })

    Object.entries(clustData.content).map(([key, data]) => {
      if (data.type === "label") {
        const element = document.querySelector(`[height-id="${data.id}"]`);
        clustData.content[key].height = element.clientHeight;
      } else if (data.response_id) {
        Object.entries(data.response_text).map(([key2, data2]) => {
          if (data2.clusterData) {
            console.log(data2);
            const element = document.querySelector(
              `[height-id="${data2.clusterData.id}"]`
            );
            clustData.content[key].response_text[key2].clusterData.height =
              element.clientHeight;
          }
        });
      }
    });

    checkClass();
    replaceLabelNames();
    let final_data = {};
    final_data.content = clustData;
    final_data.UserId = sessionStorage.getItem("UserId");
    final_data.MLClusters = MLClusters;
    delete final_data["id"];
    final_data.label = document.getElementById("activity-five-label").innerHTML;
    final_data.instruction = document.getElementById(
      "activity-five-instruction"
    ).innerHTML;
    final_data.activity_mvc = {};
    console.log(final_data.MLClusters);

    let data = {
      id: sessionStorage.getItem("ActivitiesId"),
      content: final_data,
    };

    // if (newChain) {
    //     await axios.post("https://activities-alset-aef528d2fd94.herokuapp.com/activityfive/new-chain", data).then((response) => {
    //         const ActivitiesID = response.data.ActivitiesId.id
    //         const ActivityFiveId = response.data.ActivityFiveId
    //         sessionStorage.setItem("ActivitiesId", ActivitiesID)
    //         sessionStorage.setItem("ActivityFiveId", ActivityFiveId)
    //         sessionStorage.removeItem("ActivitySixId")
    //     })
    // } else
    if (id) {
      await axios
        .post(
          `https://activities-alset-aef528d2fd94.herokuapp.com/activityfive/byId/${id}`,
          data
        )
        .then((response) => {
          console.log(response);
        });

      if (newChain) {
        await axios.post(
          `https://activities-alset-aef528d2fd94.herokuapp.com/activityfive/byId/${sessionStorage.getItem(
            "ActivitiesId"
          )}/new-chain`
        );
        sessionStorage.removeItem("ActivitySixId");

        if (!instructor) {
          let data = {
            DateTime: Date.now(),
            StudentTemplateId: sessionStorage.getItem("ActivitiesId"),
            StudentId: sessionStorage.getItem("UserId"),
            Event: "Reinitialise",
            ActivityId: sessionStorage.getItem("ActivityFiveId"),
            ActivityType: "Activity 5",
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
            ActivityId: sessionStorage.getItem("ActivityFiveId"),
            ActivityType: "Activity 5",
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
            ActivityId: sessionStorage.getItem("ActivityFiveId"),
            ActivityType: "Activity 5",
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
            ActivityId: sessionStorage.getItem("ActivityFiveId"),
            ActivityType: "Activity 5",
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
          "https://activities-alset-aef528d2fd94.herokuapp.com/activityfive",
          data
        )
        .then((response) => {
          const ActivityFiveId = response.data.id;
          sessionStorage.setItem("ActivityFiveId", ActivityFiveId);
        });

      if (!instructor) {
        let data = {
          DateTime: Date.now(),
          StudentTemplateId: sessionStorage.getItem("ActivitiesId"),
          StudentId: sessionStorage.getItem("UserId"),
          Event: "Create",
          ActivityId: sessionStorage.getItem("ActivityFiveId"),
          ActivityType: "Activity 5",
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
          ActivityId: sessionStorage.getItem("ActivityFourId"),
          ActivityType: "Activity 5",
        };
        await axios.post(
          `https://activities-alset-aef528d2fd94.herokuapp.com/instructorlog/create`,
          data
        );
      }
    }

    if (
      sessionStorage.getItem("ActivitySixId") !== "null" &&
      sessionStorage.getItem("ActivitySixId") !== null
    ) {
      navigate(`/activitysix/${sessionStorage.getItem("ActivitySixId")}`);
    } else {
      navigate("/activitysix");
    }
  };

  const removeLabel = (idToRemove, key) => {
    setClustData((prevData) => {
      const newData = { ...prevData };
      newData.content[key].removed = true;
      const labelElement = document.querySelector(
        `[height-id="${newData.content[key].id}"] > h6`
      );
      if (labelElement) {
        labelElement.contentEditable = "false";
        labelElement.style.border = "none";
        labelElement.style.height = 200;
      }
      const labelElement2 = document.querySelector(
        `[height-id="${newData.content[key].id}"]`
      );
      if (labelElement2) {
        labelElement2.style.cursor = "default";
      }
      return newData;
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
        {/* <h2>Activity 5:</h2>&nbsp;&nbsp; */}
        <h2
          dangerouslySetInnerHTML={{ __html: ` ${label}` }}
          contentEditable="true"
          style={{
            minHeight: 1,
            borderRight: "solid rgba(0,0,0,0) 1px",
            outline: "none",
          }}
          id="activity-five-label"
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
        {/* <Typography>Instructions (Editable by Instructors): </Typography> */}
        <Typography
          id="activity-five-instruction"
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
        {/* {displayConfig()} */}
        <FormControlLabel
          style={{ marginTop: 10 }}
          control={
            <Switch
              checked={newChain}
              onChange={() => {
                if (!newChain) {
                  alert(
                    "Caution: Data associated with the next activity in this sequence will be permanently deleted"
                  );
                }
                setNewChain((prev) => !prev);
              }}
            />
          }
          label="Re-initialise Activity 5 and subsequent activites"
        />
        <FormControlLabel
          style={{ marginTop: 10, marginLeft: 10 }}
          control={
            <Switch
              checked={alternateView}
              onChange={() => {
                console.log("yay");
                createAIClustering();
                setAlternateView((prev) => !prev);
              }}
            />
          }
          label="View AI Clustering"
        />

        <Button
          onClick={() => {
            createLabel();
          }}
          sx={{ marginTop: 2, marginBottom: 3 }}
          fullWidth
          variant="outlined"
        >
          Add Label
        </Button>

        {console.log("container height")}
        {console.log(containerHeight)}
        {/* <Button onClick={()=>{createLabel()}} sx={{marginTop:3,marginBottom:3}} fullWidth variant='outlined'>Add Label</Button> */}
        <Box
          style={{
            backgroundColor: "#E6E6FA",
            borderRadius: 2,
            minHeight: containerHeight,
            width: "100%",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexWrap: "wrap",
            flexDirection: viewUser ? "column" : "row",
            alignContent: "flex-start",
          }}
        >
          <div style={{ display: "flex" }}></div>
          {displayComponents()}
        </Box>
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

export default Act5;
