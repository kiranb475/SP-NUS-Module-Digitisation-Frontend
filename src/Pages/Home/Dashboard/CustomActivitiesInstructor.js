import { useNavigate } from 'react-router-dom';
import './Dashboard.css'
import { Accordion, AccordionDetails, AccordionSummary, Alert, Button, CircularProgress, Dialog, DialogActions, DialogTitle, Divider, FormControlLabel, LinearProgress, MenuItem, Select, Switch, Tooltip, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ClearIcon from '@mui/icons-material/Clear';
import InfoIcon from '@mui/icons-material/Info';

const CustomActivitiesInstructor = () => {

    const UserId = sessionStorage.getItem("UserId");
    const [yourActivitiesData, setYourActivitiesData] = useState({});
    const [open, setOpen] = useState(false)
    const [deleteItem, setDeleteItem] = useState(null);
    const [loadingId, setLoadingId] = useState(null)
    const [loadingIdDelete, setLoadingIdDelete] = useState(null)


    // enters the relevant data into the yourActivitiesData variable
    const createActivitiesData = (activityId, activityTitle, activityOneUpdate, activityTwoUpdate, activityThreeUpdate, activityFourUpdate, activityFiveUpdate, activitySixUpdate) => {
        setYourActivitiesData((prevValues) => ({
            ...prevValues,
            [activityId]: {
                ["activityTitle"]: activityTitle === "" ? "No Title Provided" : activityTitle,
                ["activityOne"]: activityOneUpdate,
                ["activityTwo"]: activityTwoUpdate,
                ["activityThree"]: activityThreeUpdate,
                ["activityFour"]: activityFourUpdate,
                ["activityFive"]: activityFiveUpdate,
                ["activitySix"]: activitySixUpdate,
                ["activityId"]: activityId,
            }
        }))
    }

    // retreives data from table if available or generates activities with default configurations
    useEffect(() => {
        axios.post("https://activities-alset-aef528d2fd94.herokuapp.com/home", { UserId: UserId }).then((response) => {
            if (response.data) {
                Object.entries(response.data).forEach(([key, value]) => {

                    (async () => {
                        let activityId = value.id;
                        let activityTitle;
                        let activityOneUpdate = null;
                        let activityTwoUpdate = null;
                        let activityThreeUpdate = null;
                        let activityFourUpdate = null;
                        let activityFiveUpdate = null;
                        let activitySixUpdate = null;

                        // it is assumed that activity one always exists.
                        if (value.ActivityOneId !== null) {
                            await axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/activityone/byId/${parseInt(value.ActivityOneId)}`).then((response) => {
                                if (response.data) {
                                    activityOneUpdate = {
                                        ["label"]: response.data.label,
                                        ["instruction"]: response.data.instruction,
                                        ["notEditableTranscript"]: response.data.transcriptEditable,
                                        ["key"]: value.ActivityOneId
                                    }
                                    activityTitle = response.data.transcript_source_id;
                                }
                            })
                        }

                        // reads data from activity two
                        if (value.ActivityTwoId !== null) {
                            await axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/activitytwo/byId/${parseInt(value.ActivityTwoId)}`).then((response) => {
                                if (response.data) {
                                    activityTwoUpdate = {
                                        ["label"]: response.data.label,
                                        ["instruction"]: response.data.instruction,
                                        ["highlightingNotAllowed"]: response.data.predefinedHighlighting,
                                        ["key"]: value.ActivityTwoId,
                                    }
                                }
                            })
                        } else {
                            activityTwoUpdate = {
                                ["label"]: "Custom Text",
                                ["instruction"]: `Read through the transcript and click on sentences from the <strong>interviewee</strong> that you think provide insights or convey important information. Clicking a sentence will highlight it in yellow. Clicking a highlighted sentence again will unhighlight it. When you are satisfied with your sentence selections, click the Submit button to continue to the next activity. Your choices of which sentences to highlight will be carried forward to the next activity.`,
                                ["highlightingNotAllowed"]: false,
                            }
                        }

                        // reads data from activity three
                        if (value.ActivityThreeId !== null) {
                            await axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/activitythree/byId/${parseInt(value.ActivityThreeId)}`).then((response) => {
                                if (response.data) {
                                    activityThreeUpdate = {
                                        ["label"]: response.data.label,
                                        ["instruction"]: response.data.instruction,
                                        ["MLModel"]: response.data.MLModel,
                                        ["enableMLModel"]: response.data.AllowMLModel,
                                        ["MLSelectionNotAllowed"]: response.data.predefinedMLSelection,
                                        ["key"]: value.ActivityThreeId,
                                    }
                                }
                            })
                        } else {
                            activityThreeUpdate = {
                                ["label"]: "Custom Text",
                                ["instruction"]:
                                    `<Typography>The transcript you submitted was passed through an AI model trained to identify important sentences. The model’s sentence selection was then compared with yours. The sentences you and the model both selected are now highlighted in green. Sentences that the model classified as being important but you did not are highlighted in blue. Sentences you selected as being important but the model did not are highlighted in yellow.</Typography>
                                <br/> <br/>
                                <Typography>Please review the version of your transcript with the new highlights below. You’ll likely agree with some of the sentence selections and disagree with others. As you review the transcript, feel free to refine your sentence selections. When you are satisfied with your selections, click the Submit button to continue to the next activity. Only your choices about which sentences are important (yellow and green highlights) will be used in the next activity.</Typography>
                                <br/> <br/>
                                <Typography>You can refer to the following key to remind yourself of what the three colours mean.</Typography>
                                <ul style={{ marginTop: 0 }}>
                                    <li><Typography>Only the model selected - blue</Typography></li>
                                    <li><Typography>Only you selected - yellow</Typography></li>
                                    <li><Typography>Both you and the model selected - green</Typography></li>
                                </ul>`,
                                ["MLModel"]: "None",
                                ["enableMLModel"]: false,
                                ["MLSelectionNotAllowed"]: false,
                            }
                        }

                        // reads data from activity four
                        if (value.ActivityFourId !== null) {
                            await axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/activityfour/byId/${parseInt(value.ActivityFourId)}`).then((response) => {
                                if (response.data) {
                                    activityFourUpdate = {
                                        ["label"]: response.data.label,
                                        ["instruction"]: response.data.instruction,
                                        ["key"]: value.ActivityFourId
                                    }
                                }
                            })
                        } else {
                            activityFourUpdate = {
                                ["label"]: "Custom Text",
                                ["instruction"]:
                                    `<Typography>The sentences you selected in the previous activity have been arranged on the left side of the pane below. Use the space below to cluster the sentences into themes by arranging the sentences that go together near each other. It’s okay if the sentences in a cluster overlap a bit.</Typography>
                                <br /> <br />
                                <Typography>You can then name the cluster by clicking the Add Label button to create a new text box. You can edit the label text by clicking on its text. You can drag the label anywhere in the clustering area by clicking and holding the label area. You can remove a label from the clustering area by deleting all of its text.</Typography>
                                <br /> <br />
                                <Typography>Once you are satisfied with your clusters and their labels, you can save everything by clicking the Submit button. Once submitted, your clusters and labels will be used in the next activity.</Typography>
                                `,
                            }
                        }

                        // reads data from activity five
                        if (value.ActivityFiveId !== null) {
                            await axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/activityfive/byId/${parseInt(value.ActivityFiveId)}`).then((response) => {
                                if (response.data) {
                                    activityFiveUpdate = {
                                        ["label"]: response.data.label,
                                        ["instruction"]: response.data.instruction,
                                        ["allowMLClustering"]: response.data.MLClusters,
                                        ["key"]: value.ActivityFiveId,
                                    }
                                }
                            })
                        } else {
                            activityFiveUpdate = {
                                ["label"]: "Custom Text",
                                ["instruction"]:
                                    `<Typography>For this activity, you will see two views of your clusters and labels. In the User view, you will see the arrangement you submitted in the previous activity or the arrangement you are currently working on. In the Alternative view, you will see how the AI model would have clustered the sentences you selected. The Alternative view does not provide labels for the clusters, but you might be able to infer them yourself.</Typography>
                                <br /> <br />
                                <Typography>Compare the two arrangement and refine the arrangement in the User view in anyway that you feel improves it. When you are satisfied with the arrangement in the User view, click the Submit button to continue to the next activity.</Typography>
                                `,
                                ["allowMLClustering"]: false,
                            }
                        }

                        // reads data from activity six
                        if (value.ActivitySixId !== null) {
                            await axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/activitysix/byId/${parseInt(value.ActivitySixId)}`).then((response) => {
                                if (response.data) {
                                    activitySixUpdate = {
                                        ["label"]: response.data.label,
                                        ["instruction"]: response.data.instruction,
                                        ["key"]: value.ActivitySixId
                                    }
                                }
                            })
                        } else {
                            activitySixUpdate = {
                                ["label"]: "Custom Text",
                                ["instruction"]:
                                    `<Typography>The sentences and cluster labels you submitted for the previous activity have been arranged in the space below. For each cluster, add any number of insights that you think emerge from the selected sentences. After surfacing the insights, add a set of needs that relate to those insights one at a time. Identifying the insights and needs should be helpful when designing your prototype.</Typography>
                                <br/> <br/>
                                <Typography>When you are satisfied with your listed insights and needs, click the Submit button to complete this stage of the design thinking process. You can come back and make changes to your submissions whenever you like.</Typography>
                                `,
                            }
                        }

                        createActivitiesData(activityId, activityTitle, activityOneUpdate, activityTwoUpdate, activityThreeUpdate, activityFourUpdate, activityFiveUpdate, activitySixUpdate)

                    })();
                })
            }
        });
    }, [])

    const navigate = useNavigate();

    //handles updating/saving of the updated activities
    const handleSubmit = async (key, value) => {

        setLoadingId(key);
        try {
            const activityId = key
            const activity1Id = value.activityOne.key
            const activity2Id = value.activityTwo.key
            const activity3Id = value.activityThree.key
            const activity4Id = value.activityFour.key
            const activity5Id = value.activityFive.key
            const activity6Id = value.activitySix.key

            const activityOneLabel = document.getElementById(`activity-one-${key}-label-${value.activityOne.key}`).innerHTML;
            const activityTwoLabel = document.getElementById(`activity-two-${key}-label-${value.activityTwo.key}`).innerHTML;
            const activityThreeLabel = document.getElementById(`activity-three-${key}-label-${value.activityThree.key}`).innerHTML;
            const activityFourLabel = document.getElementById(`activity-four-${key}-label-${value.activityFour.key}`).innerHTML;
            const activityFiveLabel = document.getElementById(`activity-five-${key}-label-${value.activityFive.key}`).innerHTML;
            const activitySixLabel = document.getElementById(`activity-six-${key}-label-${value.activitySix.key}`).innerHTML;

            const activityOneInstruction = document.getElementById(`activity-one-${key}-instruction-${value.activityOne.key}`).innerHTML;
            const activityTwoInstruction = document.getElementById(`activity-two-${key}-instruction-${value.activityTwo.key}`).innerHTML;
            const activityThreeInstruction = document.getElementById(`activity-three-${key}-instruction-${value.activityThree.key}`).innerHTML;
            const activityFourInstruction = document.getElementById(`activity-four-${key}-instruction-${value.activityFour.key}`).innerHTML;
            const activityFiveInstruction = document.getElementById(`activity-five-${key}-instruction-${value.activityFive.key}`).innerHTML;
            const activitySixInstruction = document.getElementById(`activity-six-${key}-instruction-${value.activitySix.key}`).innerHTML;

            let activity1Event;
            let activity2Event;
            let activity3Event;
            let activity4Event;
            let activity5Event;
            let activity6Event;

            if (activity1Id) {
                await axios.post(`https://activities-alset-aef528d2fd94.herokuapp.com/activityone/home/${activity1Id}`,
                    {
                        transcriptEditable: value.activityOne.notEditableTranscript,
                        label: activityOneLabel,
                        instruction: activityOneInstruction,
                    }
                );
                activity1Event = "Update";
            } else {
                await axios.post("https://activities-alset-aef528d2fd94.herokuapp.com/activityone",
                    {
                        transcriptEditable: value.activityOne.notEditableTranscript,
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
                activity1Event = "Create";
            }

            if (activity2Id) {
                await axios.post(`https://activities-alset-aef528d2fd94.herokuapp.com/activitytwo/home/${activity2Id}`,
                    {
                        predefinedHighlighting: value.activityTwo.highlightingNotAllowed,
                        label: activityTwoLabel,
                        instruction: activityTwoInstruction,
                    }
                );

                activity2Event = "Update"
            } else {
                await axios.post("https://activities-alset-aef528d2fd94.herokuapp.com/activitytwo/",
                    {
                        id: activityId,
                        content: {
                            predefinedHighlighting: value.activityTwo.highlightingNotAllowed,
                            label: activityTwoLabel,
                            instruction: activityTwoInstruction,
                        },
                    }
                )
                    .then((response) => {
                        const ActivityTwoId = response.data.id;
                        sessionStorage.setItem("ActivityTwoId", ActivityTwoId);
                    });

                activity2Event = "Create"
            }

            if (activity3Id) {
                await axios.post(`https://activities-alset-aef528d2fd94.herokuapp.com/activitythree/home/${activity3Id}`,
                    {
                        MLModel: value.activityThree.MLModel,
                        AllowMLModel: value.activityThree.enableMLModel,
                        predefinedMLSelection: value.activityThree.MLSelectionNotAllowed,
                        label: activityThreeLabel,
                        instruction: activityThreeInstruction,
                    }
                );

                activity3Event = "Update"
            } else {
                await axios.post("https://activities-alset-aef528d2fd94.herokuapp.com/activitythree",
                    {
                        id: activityId,
                        content: {
                            MLModel: value.activityThree.MLModel,
                            AllowMLModel: value.activityThree.enableMLModel,
                            predefinedMLSelection: value.activityThree.MLSelectionNotAllowed,
                            label: activityThreeLabel,
                            instruction: activityThreeInstruction,
                        },
                    }
                )
                    .then((response) => {
                        const ActivityThreeId = response.data.id;
                        sessionStorage.setItem("ActivityThreeId", ActivityThreeId);
                    });
                activity3Event = "Create"
            }

            if (activity4Id) {
                await axios.post(`https://activities-alset-aef528d2fd94.herokuapp.com/activityfour/home/${activity4Id}`,
                    {
                        label: activityFourLabel,
                        instruction: activityFourInstruction
                    }
                );
                activity4Event = "Update"
            } else {
                await axios.post("https://activities-alset-aef528d2fd94.herokuapp.com/activityfour/",
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

                activity4Event = "Create"
            }

            if (activity5Id) {
                await axios.post(`https://activities-alset-aef528d2fd94.herokuapp.com/activityfive/home/${activity5Id}`,
                    {
                        MLClusters: value.activityFive.allowMLClustering,
                        label: activityFiveLabel,
                        instruction: activityFiveInstruction,
                    }
                );

                activity5Event = "Update"
            } else {
                await axios.post(`https://activities-alset-aef528d2fd94.herokuapp.com/activityfive/`,
                    {
                        id: activityId,
                        content: {
                            MLClusters: value.activityFive.allowMLClustering,
                            label: activityFiveLabel,
                            instruction: activityFiveInstruction,
                        },
                    }
                )
                    .then((response) => {
                        const ActivityFiveId = response.data.id;
                        sessionStorage.setItem("ActivityFiveId", ActivityFiveId);
                    });

                activity5Event = "Create"
            }

            if (activity6Id) {
                await axios.post(`https://activities-alset-aef528d2fd94.herokuapp.com/activitysix/home/${activity6Id}`,
                    {
                        label: activitySixLabel,
                        instruction: activitySixInstruction
                    }
                );

                activity6Event = "Update"

            } else {
                await axios.post("https://activities-alset-aef528d2fd94.herokuapp.com/activitysix/",
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

                activity6Event = "Create"
            }

            for (let i = 1; i <= 6; i++) {
                let logs_data = {
                    DateTime: Date.now(),
                    ActivitySequenceId: activityId,
                    InstructorId: sessionStorage.getItem("UserId"),
                    Event: `activity${i}Event`,
                    ActivityId: `activity${i}Id`,
                    ActivityType: `Activity ${i}`,
                };

                await axios.post(`https://activities-alset-aef528d2fd94.herokuapp.com/instructorlog/create`, logs_data);
            }
            setLoadingId(null);

        } catch (error) {

            console.error('Failed to update template:', error);
            setLoadingId(null);

        }
    }

    //handle delete of templates
    const handleDelete = async (value) => {

        setLoadingIdDelete(value.activityId)

        try {
            //removes chain of activities in activities table
            await axios.post("https://activities-alset-aef528d2fd94.herokuapp.com/home/delete-activity", { activityId: value.activityId })

            //deletes activity one id
            await axios.post("https://activities-alset-aef528d2fd94.herokuapp.com/activityone/delete-activity", { activityId: value.activityOne.key })

            //deletes activity two id
            if (value.activityTwo.key) {
                await axios.post("https://activities-alset-aef528d2fd94.herokuapp.com/activitytwo/delete-activity", { activityId: value.activityTwo.key })
            }

            //deletes activity three id
            if (value.activityThree.key) {
                await axios.post("https://activities-alset-aef528d2fd94.herokuapp.com/activitythree/delete-activity", { activityId: value.activityThree.key })
            }

            //deletes activity two id
            if (value.activityFour.key) {
                await axios.post("https://activities-alset-aef528d2fd94.herokuapp.com/activityfour/delete-activity", { activityId: value.activityFour.key })
            }

            //deletes activity two id
            if (value.activityFive.key) {
                await axios.post("https://activities-alset-aef528d2fd94.herokuapp.com/activityfive/delete-activity", { activityId: value.activityFive.key })
            }

            //deletes activity two id
            if (value.activitySix.key) {
                await axios.post("https://activities-alset-aef528d2fd94.herokuapp.com/activitysix/delete-activity", { activityId: value.activitySix.key })
            }

            setLoadingIdDelete(null);

            setYourActivitiesData(prevActivities => {
                const updatedActivities = { ...prevActivities };
                delete updatedActivities[value.activityId];
                return updatedActivities;
            });

        } catch (error) {

            console.error('Failed to update template:', error);
            setLoadingIdDelete(null);

        }

    }

    //dialog for confirming user action for deleting a template
    const confirmDeleteDialog = () => {
        return (
            <Dialog open={open} onClose={() => setOpen(false)}
                BackdropProps={{
                    style: {
                        opacity: "10%"
                    },
                }}
                PaperProps={{
                    style: {
                        boxShadow: 'none',

                    },
                }}>
                <DialogTitle className='dialog-delete-header'>
                    <Typography className='dialog-delete-title'><strong>Are you sure?</strong></Typography>
                    <Typography>Once deleted, retrieval is impossible. Please consult your instructor before proceeding.</Typography>
                </DialogTitle>
                <DialogActions>
                    <Button onClick={(e) => { e.stopPropagation(); setOpen(false) }} >
                        Cancel
                    </Button>
                    <Button onClick={(e) => {
                        e.stopPropagation();
                        if (deleteItem) handleDelete(deleteItem);
                        setOpen(false);
                        setDeleteItem(null);
                    }} autoFocus>
                        Proceed
                    </Button>
                </DialogActions>
            </Dialog>
        );
    };

    // removes all id's of all the activities in sessionStorage
    const removeActivityDetails = () => {
        sessionStorage.removeItem("ActivityOneId");
        sessionStorage.removeItem("ActivityTwoId");
        sessionStorage.removeItem("ActivityThreeId");
        sessionStorage.removeItem("ActivityFourId");
        sessionStorage.removeItem("ActivityFiveId");
        sessionStorage.removeItem("ActivitySixId");
    }

    const storeActivityDetails = (value) => {
        sessionStorage.setItem("ActivityOneId", value.activityOne.key);
        sessionStorage.setItem("ActivityTwoId", value.activityTwo.key);
        sessionStorage.setItem("ActivityThreeId", value.activityThree.key);
        sessionStorage.setItem("ActivityFourId", value.activityFour.key);
        sessionStorage.setItem("ActivityFiveId", value.activityFive.key);
        sessionStorage.setItem("ActivitySixId", value.activitySix.key);
        sessionStorage.setItem("new-chain", false);
        sessionStorage.setItem("ActivitiesId", value.activityId);
    }

    //handles start activity button
    const handleStartActivity = (value) => {
        storeActivityDetails(value);
        sessionStorage.setItem("custom-activities-instructor", true);
        if (value.activityOne.notEditableTranscript) {
            navigate(`/activitytwo/${value.activityTwo.key}`);
        } else {
            navigate(`/activityone/${value.activityOne.key}`);
        }
    }

    const handleNavigate = (activityId, activityNumber, value) => {
        sessionStorage.setItem("ActivitiesId", value.id);
        storeActivityDetails(value);
        navigate(`/activity${activityNumber}/${activityId}`);
    };

    return (
        <div >
            {/* button to allow instructors to create a new template */}
            <Button className="create-template-button" fullWidth variant="outlined"
                onClick={() => { sessionStorage.setItem("new-chain", false); removeActivityDetails(); sessionStorage.setItem("custom-activities-instructor", true); navigate("/activityone"); }}>
                Create a Template
            </Button>

            <div className='custom-activities-container'>
                <Typography className="custom-activities-title">
                    Your Custom Activities
                </Typography>

                {Object.entries(yourActivitiesData).length === 0 ? (
                    <div className='custom-activities-blank'>
                        Currently, no templates are available. Please create one using the button above.
                    </div>
                ) : (
                    /*displays set of activities created by the instructor*/
                    Object.entries(yourActivitiesData).map(([key, value]) => {
                        return (
                            <div key={key} className="activity-accordion">
                                <Accordion className="accordion">
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />} id={`panel-header-${value.id}`} className="accordion-summary">
                                        <div className='activity-container'>
                                            <Typography className="activity-title">{value.activityTitle === "" ? "No Title Provided" : value.activityTitle}</Typography>
                                        </div>
                                        <Button disableRipple className="start-activity-button" onClick={() => { handleStartActivity(value) }}>
                                            Start Activity
                                        </Button>
                                        {loadingIdDelete === value.activityId ? (
                                            <CircularProgress size={37} className='delete-template-loading' />
                                        ) : (
                                            <Button disableRipple onClick={(e) => { e.stopPropagation(); setOpen(true); setDeleteItem(value); }} className='activity-button-delete'>
                                                <ClearIcon />
                                            </Button>
                                        )}
                                        {confirmDeleteDialog()}
                                    </AccordionSummary>

                                    <AccordionDetails className='accordian-details'>
                                        <Alert severity="warning" className="alert-warning" style={{ marginTop: "8px" }}>
                                            Please click the 'Publish Activities / Save Changes' button to make the activities available to all users.
                                        </Alert>

                                        {/* activity one */}
                                        <div>
                                            <div className='activity-header-section'>

                                                <Typography className="activity-sub-title" variant="h6">
                                                    <strong>Activity 1</strong>
                                                </Typography>

                                                <Button onClick={() => { handleNavigate(value.activityOne.key, "one", value) }} disabled={!value.activityOne.key}
                                                    className={`activity-button ${value.activityOne.key ? "active" : "disabled"}`}>
                                                    Activity One
                                                </Button>
                                            </div>

                                            <div className='activity-sub-section'>

                                                <Typography
                                                    dangerouslySetInnerHTML={{ __html: value.activityOne.label }}
                                                    contentEditable="true"
                                                    className="editable-label"
                                                    id={`activity-one-${key}-label-${value.activityOne.key}`}
                                                ></Typography>

                                                <Typography
                                                    dangerouslySetInnerHTML={{ __html: value.activityOne.instruction }}
                                                    contentEditable="true"
                                                    className="editable-instruction"
                                                    id={`activity-one-${key}-instruction-${value.activityOne.key}`}
                                                ></Typography>

                                                <Typography className='activity-info-text'>
                                                    To update the transcript, kindly navigate to Activity 1 and implement the necessary modifications.
                                                </Typography>

                                                <FormControlLabel className='activity-switch'
                                                    control={
                                                        <Switch
                                                            checked={value.activityOne.notEditableTranscript}
                                                            onChange={() => setYourActivitiesData(prevValues => {
                                                                const updatedActivity = {
                                                                    ...prevValues[key],
                                                                    activityOne: {
                                                                        ...prevValues[key].activityOne,
                                                                        notEditableTranscript: !prevValues[key].activityOne.notEditableTranscript
                                                                    }
                                                                };
                                                                return {
                                                                    ...prevValues,
                                                                    [key]: updatedActivity
                                                                };
                                                            })}
                                                        />
                                                    }
                                                    label={
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            Standardised Script
                                                            <Tooltip title="The transcript is standardized and cannot be edited by students across all template copies.">
                                                                <InfoIcon style={{ marginLeft: 4 }} fontSize="small" />
                                                            </Tooltip>
                                                        </div>
                                                    }
                                                />

                                                <Divider className='activity-divider' />

                                            </div>

                                        </div>

                                        {/* activity two */}

                                        <div>
                                            <div className='activity-header-section'>

                                                <Typography className="activity-title" variant="h6">
                                                    <strong>Activity 2</strong>
                                                </Typography>

                                                <Button onClick={() => { handleNavigate(value.activityTwo.key, "two", value) }} disabled={!value.activityTwo.key}
                                                    className={`activity-button ${value.activityTwo.key ? "active" : "disabled"}`}>
                                                    Activity Two
                                                </Button>
                                            </div>

                                            <div className='activity-sub-section'>

                                                <Typography
                                                    dangerouslySetInnerHTML={{ __html: value.activityTwo.label }}
                                                    contentEditable="true"
                                                    className="editable-label"
                                                    id={`activity-two-${key}-label-${value.activityTwo.key}`}
                                                ></Typography>

                                                <Typography
                                                    dangerouslySetInnerHTML={{ __html: value.activityTwo.instruction }}
                                                    contentEditable="true"
                                                    className="editable-instruction"
                                                    id={`activity-two-${key}-instruction-${value.activityTwo.key}`}
                                                    style={{ marginBottom: 10 }}
                                                ></Typography>

                                                <FormControlLabel className='activity-switch'
                                                    control={
                                                        <Switch
                                                            checked={value.activityTwo.highlightingNotAllowed}
                                                            onChange={() => setYourActivitiesData(prevValues => {
                                                                const updatedActivity = {
                                                                    ...prevValues[key],
                                                                    activityTwo: {
                                                                        ...prevValues[key].activityTwo,
                                                                        highlightingNotAllowed: !prevValues[key].activityTwo.highlightingNotAllowed
                                                                    }
                                                                };
                                                                return {
                                                                    ...prevValues,
                                                                    [key]: updatedActivity
                                                                };
                                                            })}
                                                        />
                                                    }
                                                    label={
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            Standardised Script Highlighting
                                                            <Tooltip title="The highlighting of the script is standardized and cannot be edited by students across all template copies.">
                                                                <InfoIcon style={{ marginLeft: 4 }} fontSize="small" />
                                                            </Tooltip>
                                                        </div>
                                                    }
                                                />

                                                <Divider className='activity-divider' />

                                            </div>

                                        </div>

                                        {/* activity three */}

                                        <div>
                                            <div className='activity-header-section'>

                                                <Typography className="activity-title" variant="h6">
                                                    <strong>Activity 3</strong>
                                                </Typography>

                                            </div>

                                            <div className='activity-sub-section'>

                                                <Typography
                                                    dangerouslySetInnerHTML={{ __html: value.activityThree.label }}
                                                    contentEditable="true"
                                                    className="editable-label"
                                                    id={`activity-three-${key}-label-${value.activityThree.key}`}
                                                ></Typography>

                                                <Typography
                                                    dangerouslySetInnerHTML={{ __html: value.activityThree.instruction }}
                                                    contentEditable="true"
                                                    className="editable-instruction"
                                                    id={`activity-three-${key}-instruction-${value.activityThree.key}`}
                                                ></Typography>

                                                <Typography className='activity-info-text'>
                                                    If a machine learning model isn't chosen, no selections based on machine learning will occur.
                                                </Typography>

                                                <Typography className='activity-info-text'>
                                                    Currently selected machine learning model: {value.activityThree.MLModel}
                                                </Typography>

                                                <Typography className='activity-info-text'>
                                                    To choose a different machine learning model, please make your selection from the options below.
                                                </Typography>

                                                <Select className='activity-switch'
                                                    value={value.activityThree.MLModel}
                                                    onChange={(e) => setYourActivitiesData(prevValues => {
                                                        const updatedActivity = {
                                                            ...prevValues[key],
                                                            activityThree: {
                                                                ...prevValues[key].activityThree,
                                                                MLModel: e.target.value,
                                                            }
                                                        };
                                                        return {
                                                            ...prevValues,
                                                            [key]: updatedActivity
                                                        };
                                                    })}

                                                >
                                                    <MenuItem value={"None"}>None</MenuItem>
                                                    <MenuItem value={"Model1"}>Model 1</MenuItem>
                                                    <MenuItem value={"Model2"}>Model 2</MenuItem>
                                                    <MenuItem value={"Model3"}>Model 3</MenuItem>
                                                    <MenuItem value={"Model4"}>Model 4</MenuItem>
                                                </Select>

                                                <FormControlLabel className='activity-switch'
                                                    control={
                                                        <Switch
                                                            checked={value.activityThree.enableMLModel}
                                                            onChange={() => setYourActivitiesData(prevValues => {
                                                                const updatedActivity = {
                                                                    ...prevValues[key],
                                                                    activityThree: {
                                                                        ...prevValues[key].activityThree,
                                                                        enableMLModel: !prevValues[key].activityThree.enableMLModel
                                                                    }
                                                                };
                                                                return {
                                                                    ...prevValues,
                                                                    [key]: updatedActivity
                                                                };
                                                            })}
                                                        />
                                                    }
                                                    label={
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            Enable Selections Based on Machine Learning Analysis
                                                            <Tooltip title="Grant the machine learning model permission to highlight text.">
                                                                <InfoIcon style={{ marginLeft: 4 }} fontSize="small" />
                                                            </Tooltip>
                                                        </div>
                                                    }
                                                />

                                                <FormControlLabel className='activity-switch'
                                                    control={
                                                        <Switch
                                                            checked={value.activityThree.MLSelectionNotAllowed}
                                                            onChange={() => setYourActivitiesData(prevValues => {
                                                                const updatedActivity = {
                                                                    ...prevValues[key],
                                                                    activityThree: {
                                                                        ...prevValues[key].activityThree,
                                                                        MLSelectionNotAllowed: !prevValues[key].activityThree.MLSelectionNotAllowed
                                                                    }
                                                                };
                                                                return {
                                                                    ...prevValues,
                                                                    [key]: updatedActivity
                                                                };
                                                            })}
                                                        />
                                                    }
                                                    disabled
                                                    label="Standardised Machine Learning Selections (Pending Approval)"
                                                />

                                                <Divider className='activity-divider' />

                                            </div>

                                        </div>

                                        {/* activity four */}

                                        <div>
                                            <div className='activity-section'>

                                                <Typography className="activity-title" variant="h6">
                                                    <strong>Activity 4</strong>
                                                </Typography>

                                            </div>

                                            <div className='activity-sub-section'>

                                                <Typography
                                                    dangerouslySetInnerHTML={{ __html: value.activityFour.label }}
                                                    contentEditable="true"
                                                    className="editable-label"
                                                    id={`activity-four-${key}-label-${value.activityFour.key}`}
                                                ></Typography>

                                                <Typography
                                                    dangerouslySetInnerHTML={{ __html: value.activityFour.instruction }}
                                                    contentEditable="true"
                                                    className="editable-instruction"
                                                    id={`activity-four-${key}-instruction-${value.activityFour.key}`}
                                                ></Typography>

                                                <Divider className='activity-divider' style={{ marginTop: 20 }} />

                                            </div>

                                        </div>

                                        {/* activity five */}

                                        <div>
                                            <div className='activity-section'>

                                                <Typography className="activity-title" variant="h6">
                                                    <strong>Activity 5</strong>
                                                </Typography>

                                            </div>

                                            <div className='activity-sub-section'>

                                                <Typography
                                                    dangerouslySetInnerHTML={{ __html: value.activityFive.label }}
                                                    contentEditable="true"
                                                    className="editable-label"
                                                    id={`activity-five-${key}-label-${value.activityFive.key}`}
                                                ></Typography>

                                                <Typography
                                                    dangerouslySetInnerHTML={{ __html: value.activityFive.instruction }}
                                                    contentEditable="true"
                                                    className="editable-instruction"
                                                    id={`activity-five-${key}-instruction-${value.activityFive.key}`}
                                                    style={{ marginBottom: 10 }}
                                                ></Typography>

                                                <FormControlLabel className='activity-switch'
                                                    control={
                                                        <Switch
                                                            checked={value.activityFive.allowMLClustering}
                                                            onChange={() => setYourActivitiesData(prevValues => {
                                                                const updatedActivity = {
                                                                    ...prevValues[key],
                                                                    activityFive: {
                                                                        ...prevValues[key].activityFive,
                                                                        allowMLClustering: !prevValues[key].activityFive.allowMLClustering
                                                                    }
                                                                };
                                                                return {
                                                                    ...prevValues,
                                                                    [key]: updatedActivity
                                                                };
                                                            })}
                                                        />
                                                    }
                                                    label={
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            Allow Machine Learning Clustering
                                                            <Tooltip title="Grant the machine learning model permission to cluster text.">
                                                                <InfoIcon style={{ marginLeft: 4 }} fontSize="small" />
                                                            </Tooltip>
                                                        </div>
                                                    }
                                                />

                                                <Divider className='activity-divider' />

                                            </div>

                                        </div>

                                        {/* activity six */}

                                        <div>
                                            <div className='activity-section'>

                                                <Typography className="activity-title" variant="h6">
                                                    <strong>Activity 6</strong>
                                                </Typography>

                                            </div>

                                            <div className='activity-sub-section'>

                                                <Typography
                                                    dangerouslySetInnerHTML={{ __html: value.activitySix.label }}
                                                    contentEditable="true"
                                                    className="editable-label"
                                                    id={`activity-six-${key}-label-${value.activitySix.key}`}
                                                ></Typography>

                                                <Typography
                                                    dangerouslySetInnerHTML={{ __html: value.activitySix.instruction }}
                                                    contentEditable="true"
                                                    className="editable-instruction"
                                                    id={`activity-six-${key}-instruction-${value.activitySix.key}`}
                                                ></Typography>

                                            </div>

                                        </div>

                                        {loadingId === key ? (
                                            <LinearProgress className='update-template-loading' />
                                        ) : (
                                            <Button fullWidth variant='contained' className='activity-submit-button' onClick={() => handleSubmit(key, value)}>
                                                Save and Publish Updates
                                            </Button>
                                        )}

                                    </AccordionDetails>

                                </Accordion>
                            </div>
                        )

                    })

                )}
            </div>



        </div>
    )
}

export default CustomActivitiesInstructor;