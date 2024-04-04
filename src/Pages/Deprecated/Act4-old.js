import './Act4-old.css'
import { Box, Button, ButtonGroup, Container, FormControlLabel, Switch, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Draggable from "react-draggable";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { getColor } from "../../Components/Colors.js";

const Act4 = () => {
  const [selectedData, setSelectedData] = useState({});
  const [containerHeight, setContainerHeight] = useState(0);
  const [instructor, setInstructor] = useState(false);
  const [newChain, setNewChain] = useState(false);
  const [label, setLabel] = useState("Activity 4 Label");
  const [instruction, setInstruction] = useState(
    `<Typography>The sentences you selected in the previous activity have been arranged on the left side of the pane below. Use the space below to cluster the sentences into themes by arranging the sentences that go together near each other. It’s okay if the sentences in a cluster overlap a bit.</Typography>
      <br />
      <br />
      <Typography>You can then name the cluster by clicking the Add Label button to create a new text box. You can edit the label text by clicking on its text. You can drag the label anywhere in the clustering area by clicking and holding the label area. You can remove a label from the clustering area by deleting all of its text.</Typography>
      <br />
      <br />
      <Typography>Once you are satisfied with your clusters and their labels, you can save everything by clicking the Submit button. Once submitted, your clusters and labels will be used in the next activity.</Typography>`
  );
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {

    // checks if id passed in the url is null
    if (id === "null") {
      alert("Please go back to the previous activity and submit it to continue.");
      navigate("/")
    }

    // checks occupation of the user
    if (sessionStorage.getItem("Occupation") == "Instructor") {
      setInstructor(true);
    }

    let height = sessionStorage.getItem("mainContainerHeight");
    let x = 120;
    let y = 70;

    // if valid id exists, fetch data from activity 4 table
    if (id) {
      axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/activityfour/byId/${id}`).then((response) => {
        setLabel(response.data.label);
        setInstruction(response.data.instruction);
        if (response.data.content !== null) {
          setSelectedData(response.data.content);
          if (height != null) {
            setContainerHeight(height);
          }
        }
      });
    } else if (id !== "null") {
      axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/activitythree/byId/${sessionStorage.getItem("ActivityThreeId")}`).then((response) => {
        if (response.data !== null) {
          let userData = response.data;
          const check = new RegExp("background-color: yellow", "g");
          const check2 = new RegExp("background-color: lightgreen", "g");
          Object.entries(userData.content).forEach(([key, value]) => {
            if (value.questioner_tag === undefined) {
              Object.entries(value.response_text).forEach(([key2, value2]) => {
                if (userData.activity_mvc[key][key2].css.match(check) || userData.activity_mvc[key][key2].css.match(check2)) {
                  userData.content[key].response_text[key2].clusterData = {
                    id: uuidv4(),
                    x: x,
                    y: y,
                    new_x: 0,
                    new_y: 0,
                    userClusterIndexA4: -1,
                    type: "text",
                    height: 0,
                  };
                  y = y + 140;
                }
              });
            }
          });
          setSelectedData(userData);
        } else if (id === "null") {
          alert("Before progressing to Activity 4, please complete Activity 3.");
        }
      });
    }
  }, []);

  const checkClass = () => {
    let colorsUsedData = {};
    let checkClassData = {};
    let userData = selectedData;
    let currentClass = 0;
    let flag = false;
    let flag2 = false;

    Object.entries(userData.content).map(([key, data]) => {
      if (data.type === "label") {
        data.userClusterIndexA4 = -1;
      } else if (data.response_id) {
        Object.entries(data.response_text).map(([key2, data2]) => {
          if (data2.clusterData) {
            data2.clusterData.userClusterIndexA4 = -1;
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
            checkClassData[Object.keys(checkClassData).length + 1] = data2.clusterData;
          }

        });
      } else if (data.type === "label") {
        data.coreKey = key;
        checkClassData[Object.keys(checkClassData).length + 1] = data;
      }
    });

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
          value2.userClusterIndexA4 === -1
        ) {
          if (flag === true) {
            currentClass = currentClass + 1;
            flag = false;
            flag2 = true;
          }
          if (flag2 === true && value.userClusterIndexA4 !== -1) {
            currentClass = currentClass - 1;
            flag2 = false;

            checkClassData[key2].userClusterIndexA4 = checkClassData[key].userClusterIndexA4;
            if (checkClassData[key2].type == "label") {
              colorsUsedData[checkClassData[key2].userClusterIndexA4] = checkClassData[key2].color;
            }
          } else {
            checkClassData[key2].userClusterIndexA4 = currentClass;
            flag2 = false;
            if (checkClassData[key2].type == "label") {
              colorsUsedData[checkClassData[key2].userClusterIndexA4] = checkClassData[key2].color;
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
        ].clusterData.userClusterIndexA4 = data.userClusterIndexA4;
      } else {
        userData.content[data.coreKey].userClusterIndexA4 = data.userClusterIndexA4;
      }
    });

    setSelectedData(userData);
    return colorsUsedData;
  };

  // checks whether two components are close to each other
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

  // checks which components are next to each other
  const checkClustering = () => {
    console.log("check clustering");
    console.log(selectedData);

    Object.entries(selectedData.content).map(([key, data]) => {
      if (data.type === "label") {
        const element = document.querySelector(`[height-id="${data.id}"]`);
        selectedData.content[key].height = element.clientHeight;
      } else if (data.response_id) {
        Object.entries(data.response_text).map(([key2, data2]) => {
          if (data2.clusterData) {
            console.log(data2);
            const element = document.querySelector(
              `[height-id="${data2.clusterData.id}"]`
            );
            selectedData.content[key].response_text[key2].clusterData.height = element.clientHeight;
          }
        });
      }
    });

    const mainContainer = document.getElementById("main-container");
    sessionStorage.setItem("mainContainerHeight", mainContainer.clientHeight);

    let colorsUsedData = {};
    colorsUsedData = checkClass();

    replaceLabelNames();
    const updatedSelectedData = { ...selectedData };

    Object.entries(updatedSelectedData.content).forEach(([key, value]) => {
      if (value.response_id) {
        Object.entries(value.response_text).map(([key2, value2]) => {
          if (value2.clusterData) {
            updatedSelectedData.content[key].response_text[
              key2
            ].clusterData.color =
              colorsUsedData[value2.clusterData.userClusterIndexA4];
          }

        });
      }
    });

    setSelectedData(updatedSelectedData);
  };

  const handleDrag = (e, data, coreKey, subKey) => {
    let userData = selectedData;
    checkClustering();

    console.log("handle drag - 1");
    console.log(coreKey);
    console.log(subKey);
    console.log(selectedData);

    setSelectedData((prevState) => {
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

  // if the label is blank, it will remove the label from the screen
  const removeLabel = (idToRemove, key) => {
    setSelectedData((prevData) => {
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

  // displays the components on the screen
  const displayComponents = () => {
    console.log("data");
    console.log(selectedData);

    if (Object.keys(selectedData).length !== 0) {
      return Object.entries(selectedData.content).map(([key, data]) => {
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
                    {data.clusterLabelA4}
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
                      backgroundColor: data.color,
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
                    {data.clusterLabelA4}
                  </Typography>
                </div>
              </Draggable>
            );
          }
        } else if (data.response_id) {
          return Object.entries(data.response_text).map(([key2, data2]) => {
            if (data2.removed === true) {
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
                        backgroundColor: "transparent", 
                        padding: 10,
                        margin: 10,
                        cursor: "move",
                        borderRadius: 15,
                        border: "1px solid black",
                        overflow: "hidden",
                      }}
                    >
                      <Tooltip title={data.response_text[key2].text}>
                        <div style={{ display: "flex" }}>
                          <Button variant="outlined" onClick={() => handleCreateCopy(key, key2)} className='create-copy-button'>
                            +
                          </Button>
                          {data2.clusterData.type === "text-copy" && <Button variant="outlined" onClick={() => handleDeleteCopy(key, key2)} className='create-delete-button'>
                            -
                          </Button>}
                        </div>
                        <Typography id={data2.clusterData.id} fontSize={13}>
                          {data.response_text[key2].text}
                        </Typography>
                      </Tooltip>
                    </div>
                  </Draggable>
                );
              }
            } else {
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
                        backgroundColor: data2.clusterData.color
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
                        <div style={{ display: "flex" }}>
                          <Button variant="outlined" onClick={() => handleCreateCopy(key, key2)} className='create-copy-button'>
                            +
                          </Button>
                          {data2.clusterData.type === "text-copy" && <Button variant="outlined" onClick={() => handleDeleteCopy(key, key2)} className='create-delete-button'>
                            -
                          </Button>}
                        </div>
                        <Typography id={data2.clusterData.id} fontSize={13}>
                          {data.response_text[key2].text}
                        </Typography>
                      </Tooltip>
                    </div>
                  </Draggable>
                );
              }
            }
          

          });
        }
      });
    }

  };

  // scrolls the screen to where the label has been generated
  const scrollNewLabelIntoView = (key) => {
    setTimeout(() => {
      const labelElement = document.getElementById(key);
      if (labelElement) {
        labelElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 0);
  };

  // creates a new label
  const createLabel = () => {
    const newKey = Object.keys(selectedData.content).length;
    let data_y = 0;
    let data = selectedData;
    if (data.content[newKey].type === "label") {
      data_y = data.content[newKey].y + 60;
    } else {
      const keyIntervieweeText = Object.keys(
        data.content[newKey].response_text
      ).length;
      data_y =
        data.content[newKey].response_text[keyIntervieweeText].clusterData.y +
        100;
    }

    const key = uuidv4();
    const currColor = getColor();
    setSelectedData((prevState) => {
      const newData = {
        ...prevState,
        content: {
          ...prevState.content,
          [newKey + 1]: {
            id: key,
            clusterLabelA4: "Click to edit label",
            x: 120,
            y: data_y,
            new_x: 0,
            new_y: 0,
            userClusterIndexA4: -1,
            type: "label",
            color: currColor,
          },
        },
      };
      return newData;
    });

    scrollNewLabelIntoView(key);

  };

  // searches for the current label name and replaces it
  const replaceLabelNames = () => {
    let data = selectedData;

    console.log("label name replacement - pre");
    console.log(data);

    Object.entries(data.content).map(([key, value]) => {
      if (value.type === "label") {
        let val = document.getElementById(value.id).innerHTML;
        data.content[key].clusterLabelA4 = val;
      }
    });

    setSelectedData(data);
  };

  const handleDeleteCopy = (coreKey, subKey) => {
    setSelectedData((prevData) => {
      const newData = { ...prevData };
      newData.content[coreKey].response_text[subKey].removed = true;
      const elementToRemove = document.querySelector(`[height-id="${newData.content[coreKey].response_text[subKey].clusterData.id}"]`);
      if (elementToRemove) {
        elementToRemove.style.border = "none";
        elementToRemove.style.height = 100;
        elementToRemove.style.backgroundColor = "transparent";
        elementToRemove.innerHTML = "";
      }
      return newData;
    });
  };

  const handleCreateCopy = (coreKey, subKey) => {

    setSelectedData(prevState => {
      const newData = { ...prevState };
      const itemToCopy = { ...newData.content[coreKey].response_text[subKey] };
      itemToCopy.clusterData = {
        ...itemToCopy.clusterData,
        id: uuidv4(),
        x: itemToCopy.clusterData.x,
        y: itemToCopy.clusterData.y,
        // new_x: 250,
        // new_y: -137,
        new_x: 0,
        new_y: 0,
        userClusterIndexA4: -1,
        type: "text-copy",
        height: 0,
      };
      const newSubKey = Object.keys(newData.content[coreKey].response_text).length + 1;
      newData.content[coreKey].response_text[newSubKey] = itemToCopy;
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    Object.entries(selectedData.content).map(([key, data]) => {
      if (data.type === "label") {
        const element = document.querySelector(`[data-height-id="${data.id}"]`);
        if (element) {
          selectedData.content[key].height = element.clientHeight;
        }
      } else if (data.response_id) {
        Object.entries(data.response_text).map(([key2, data2]) => {
          if (data2.clusterData) {
            const element = document.querySelector(`[data-height-id="${data2.clusterData.id}"]`);
            if (element) {
              selectedData.content[key].response_text[key2].clusterData.height = element.clientHeight;
            }
          }
        });
      }
    });

    const mainContainer = document.getElementById("main-container");
    sessionStorage.setItem("mainContainerHeight", mainContainer.clientHeight);

    checkClass();
    replaceLabelNames();

    if (!id) {
      delete selectedData["MLModel"];
      delete selectedData["AllowMLMOdel"];
      delete selectedData["predefinedMLSelection"];
    }

    let finalData = {};
    finalData.UserId = sessionStorage.getItem("UserId");
    finalData.content = selectedData;
    finalData.label = document.getElementById("activity-four-label").innerHTML;
    finalData.instruction = document.getElementById("activity-four-instruction").innerHTML;
    finalData.activity_mvc = {};
    delete finalData["id"];
    let data = {
      id: sessionStorage.getItem("ActivitiesId"),
      content: finalData,
    };

    let event;

    if (id) {
      await axios.post(`https://activities-alset-aef528d2fd94.herokuapp.com/activityfour/byId/${id}`, data);
      if (newChain) {
        await axios.post(`https://activities-alset-aef528d2fd94.herokuapp.com/activityfour/byId/${sessionStorage.getItem("ActivitiesId")}/new-chain`);
        sessionStorage.removeItem("ActivityFiveId");
        sessionStorage.removeItem("ActivitySixId");

        event = "Reinitialise";
      } else {
        event = "Update";
      }
    } else {
      await axios.post("https://activities-alset-aef528d2fd94.herokuapp.com/activityfour", data).then((response) => {
        const ActivityFourId = response.data.id;
        sessionStorage.setItem("ActivityFourId", ActivityFourId);
      });

      event = "Create";
    }

    if (!instructor) {
      let data = {
        DateTime: Date.now(),
        StudentTemplateId: sessionStorage.getItem("ActivitiesId"),
        StudentId: sessionStorage.getItem("UserId"),
        Event: event,
        ActivityId: sessionStorage.getItem("ActivityFourId"),
        ActivityType: "Activity 4",
      };
      await axios.post(`https://activities-alset-aef528d2fd94.herokuapp.com/studentlog/create`, data);
    } else {
      let data = {
        DateTime: Date.now(),
        ActivitySequenceId: sessionStorage.getItem("ActivitiesId"),
        InstructorId: sessionStorage.getItem("UserId"),
        Event: event,
        ActivityId: sessionStorage.getItem("ActivityFourId"),
        ActivityType: "Activity 4",
      };
      await axios.post(`https://activities-alset-aef528d2fd94.herokuapp.com/instructorlog/create`, data);
    }

    if (sessionStorage.getItem("ActivityFiveId") !== "null" && sessionStorage.getItem("ActivityFiveId") !== null) {
      navigate(`/activityfive/${sessionStorage.getItem("ActivityFiveId")}`);
    } else {
      navigate("/activityfive");
    }
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
        {/* <h2>Activity 4:</h2>&nbsp;&nbsp; */}
        <h2
          dangerouslySetInnerHTML={{ __html: ` ${label}` }}
          contentEditable="true"
          style={{
            minHeight: 1,
            borderRight: "solid rgba(0,0,0,0) 1px",
            outline: "none",
          }}
          id="activity-four-label"
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
          id="activity-four-instruction"
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
        <FormControlLabel
          style={{ marginTop: 10 }}
          control={
            <Switch
              checked={newChain}
              onChange={() => {
                if (!newChain) {
                  // eslint-disable-next-line no-restricted-globals
                  if (confirm("Caution: Data associated with the next two activities in this sequence will be permanently deleted")) {
                    setNewChain((prev) => !prev);
                  }
                } else {
                  setNewChain((prev) => !prev);
                }
              }}
            />
          }
          label="Re-initialise Activity 4 and subsequent activites"
        />
        <ButtonGroup fullWidth sx={{ marginTop: 2, marginBottom: 1 }}>
          <Button
            onClick={() => {
              createLabel();
            }}
            fullWidth
            variant="outlined"
          >
            Add Label
          </Button>
        </ButtonGroup>

        <Box
          id="main-container"
          style={{
            minHeight: containerHeight === 0 ? 900 : containerHeight,
            width: "100%",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexWrap: "wrap",
            flexDirection: "column",
            backgroundColor: "#E6E6FA",
            borderRadius: 2,
          }}
        >
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

export default Act4;