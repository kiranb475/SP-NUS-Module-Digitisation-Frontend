import { Button, Dialog, DialogActions, DialogTitle, Typography } from '@mui/material'
import './Dashboard.css'
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ClearIcon from '@mui/icons-material/Clear';

const CustomActivitiesStudent = () => {

    const navigate = useNavigate();
    const [yourActivitiesData, setYourActivitiesData] = useState({});
    const UserId = sessionStorage.getItem("UserId");
    const [open, setOpen] = useState(false)

    useEffect(() => {

        axios.post("https://activities-alset-aef528d2fd94.herokuapp.com/home", { UserId: UserId }).then((response) => {
            if (response.data) {
                Object.entries(response.data).forEach(([key, value]) => {
                    (async () => {
                        await axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/activityone/byId/${parseInt(value.ActivityOneId)}`).then((response) => {
                            if (response.data) {
                                setYourActivitiesData((prevValues) => ({
                                    ...prevValues,
                                    [value.id]: {
                                        ...value,
                                        ["activityTitle"]: response.data.transcript_source_id,
                                    }
                                }));
                            }
                        })
                    })()
                })
            }
        })
    }, [])

    const storeActivityDetails = (value) => {
        sessionStorage.setItem("ActivityOneId", value.ActivityOneId);
        sessionStorage.setItem("ActivityTwoId", value.ActivityTwoId);
        sessionStorage.setItem("ActivityThreeId", value.ActivityThreeId);
        sessionStorage.setItem("ActivityFourId", value.ActivityFourId);
        sessionStorage.setItem("ActivityFiveId", value.ActivityFiveId);
        sessionStorage.setItem("ActivitySixId", value.ActivitySixId);
    }

    const handleNavigate = (activityId, activityNumber, value) => {
        if (activityId === null) {
            alert("Please go back to the previous activity and submit it to continue.");
            return;
        }
        storeActivityDetails(value);
        navigate(`/activity${activityNumber}/${activityId}`);
    };

    const handleDelete = async (value) => {
        await axios.post("https://activities-alset-aef528d2fd94.herokuapp.com/home/delete-activity", { activityId: value.id })
        window.location.reload(false);
    }

    const confirmDeleteDialog = (value) => {
        return (
            <Dialog open={open} onClose={() => setOpen(false)}
                BackdropProps={{
                    style: {
                        backgroundColor: 'transparent',
                    },
                }}
                PaperProps={{
                    style: {
                        boxShadow: 'none',
                        border: '1px solid black'
                    },
                }}>
                <DialogTitle>Are you sure you would like to delete the following activity?</DialogTitle>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>
                        No
                    </Button>
                    <Button onClick={() => { handleDelete(value); setOpen(false); }} autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }

    return (
        <div>

            <Typography className="custom-activities-title" variant="h5">
                Your Custom Activities
            </Typography>

            {Object.entries(yourActivitiesData).map(([key, value]) => {
                return (
                    <div className='custom-activities'>
                        <div className='activity-container'>
                            <Typography variant="h6" className="activity-title">
                                {value.activityTitle}
                            </Typography>
                        </div>

                        <div className="activity-buttons">

                            <Button onClick={() => { handleNavigate(value.ActivityOneId, "one", value) }}
                                className={`activity-button ${value.ActivityOneId ? "active" : "disabled"}`}>
                                Activity 1
                            </Button>
                            <span className='seperator'>|</span>
                            <Button onClick={() => { handleNavigate(value.ActivityTwoId, "two", value) }}
                                className={`activity-button ${value.ActivityTwoId ? "active" : "disabled"}`}>
                                Activity 2
                            </Button>
                            <span className='seperator'>|</span>
                            <Button onClick={() => { handleNavigate(value.ActivityThreeId, "three", value) }}
                                className={`activity-button ${value.ActivityThreeId ? "active" : "disabled"}`}>
                                Activity 3
                            </Button>
                            <span className='seperator'>|</span>
                            <Button onClick={() => { handleNavigate(value.ActivityFourId, "four", value) }}
                                className={`activity-button ${value.ActivityFourId ? "active" : "disabled"}`}>
                                Activity 4
                            </Button>
                            <span className='seperator'>|</span>
                            <Button onClick={() => { handleNavigate(value.ActivityFiveId, "five", value) }}
                                className={`activity-button ${value.ActivityFiveId ? "active" : "disabled"}`}>
                                Activity 5
                            </Button>
                            <span className='seperator'>|</span>
                            <Button onClick={() => { handleNavigate(value.ActivitySixId, "six", value) }}
                                className={`activity-button ${value.ActivitySixId ? "active" : "disabled"}`}>
                                Activity 6
                            </Button>
                            <Button onClick={() => { setOpen(true) }} className='activity-button-delete'>
                                <ClearIcon />
                            </Button>

                            {confirmDeleteDialog(value)}

                        </div>

                    </div>
                )
            })}

        </div>
    )
}

export default CustomActivitiesStudent