import { Button, Typography } from "@mui/material"
import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import './Dashboard.css'

const StudentDesignedActivities = () => {

    const [listOfActivities, setListOfActivities] = useState({})
    const navigate = useNavigate();

    useEffect(() => {

        //gets a list of all students
        axios.get("https://activities-alset-aef528d2fd94.herokuapp.com/home/students").then((response) => {
            if (response.data) {
                Object.entries(response.data).forEach(([key, value]) => {
                    (async () => {

                        //gets a list of activities created by each student
                        await axios.post("https://activities-alset-aef528d2fd94.herokuapp.com/home", { UserId: parseInt(value.id) }).then((response) => {
                            if (response.data) {
                                Object.entries(response.data).forEach(([key2, value2]) => {
                                    (async () => {

                                        //gets the title of each activity
                                        await axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/activityone/byId/${parseInt(value2.ActivityOneId)}`).then((response) => {
                                            if (response.data) {
                                                setListOfActivities((prevValues) => ({
                                                    ...prevValues,
                                                    [value2.id]: {
                                                        ...value2,
                                                        ["username"]: value.username,
                                                        ["activityTitle"]: response.data.transcript_source_id,
                                                    }
                                                }));
                                            }
                                        })
                                    })();
                                })

                            }
                        })
                    })();
                })
            }
        })
    }, [])

    //stores relevant metadata
    const storeActivityDetails = (value) => {
        sessionStorage.setItem("ActivityOneId", value.ActivityOneId);
        sessionStorage.setItem("ActivityTwoId", value.ActivityTwoId);
        sessionStorage.setItem("ActivityThreeId", value.ActivityThreeId);
        sessionStorage.setItem("ActivityFourId", value.ActivityFourId);
        sessionStorage.setItem("ActivityFiveId", value.ActivityFiveId);
        sessionStorage.setItem("ActivitySixId", value.ActivitySixId);
        sessionStorage.setItem("new-chain", false);
        sessionStorage.setItem("ActivitiesId", value.id);
    }

    const handleNavigate = (activityId, activityNumber, value) => {
        storeActivityDetails(value);
        navigate(`/activity${activityNumber}/${activityId}`);
    };

    return (
        <div className='custom-activities-container'>

            <Typography className="custom-activities-title">
                Student Activities
            </Typography>

            {Object.entries(listOfActivities).length === 0 ? (
                <div className='custom-activities-blank'>
                    Currently, no templates have been authored by students.
                </div>
            ) : (
                Object.entries(listOfActivities).map(([key, value]) => {
                    return (
                        <div className='other-activities'>
                            <div className='activity-container'>
                                <Typography className="activity-title">
                                    {value.activityTitle === "" ? "No Title Provided" : value.activityTitle}
                                </Typography>
                                <Typography className='activity-author'>
                                    ({value.username})
                                </Typography>
                            </div>

                            <div className="activity-buttons">

                                <Button disableRipple onClick={() => { handleNavigate(value.ActivityOneId, "one", value) }}
                                    className={`activity-button ${value.ActivityOneId ? "active" : "disabled"}`}>
                                    One
                                </Button>

                                <Button disableRipple onClick={() => { handleNavigate(value.ActivityTwoId, "two", value) }}
                                    disabled={!value.ActivityTwoId}
                                    className={`activity-button ${value.ActivityTwoId ? "active" : "disabled"}`}>
                                    Two
                                </Button>

                                <Button disableRipple onClick={() => { handleNavigate(value.ActivityThreeId, "three", value) }}
                                    disabled={!value.ActivityThreeId}
                                    className={`activity-button ${value.ActivityThreeId ? "active" : "disabled"}`}>
                                    Three
                                </Button>

                                <Button disableRipple onClick={() => { handleNavigate(value.ActivityFourId, "four", value) }}
                                    disabled={!value.ActivityFourId}
                                    className={`activity-button ${value.ActivityFourId ? "active" : "disabled"}`}>
                                    Four
                                </Button>

                                <Button disableRipple onClick={() => { handleNavigate(value.ActivityFiveId, "five", value) }}
                                    disabled={!value.ActivityFiveId}
                                    className={`activity-button ${value.ActivityFiveId ? "active" : "disabled"}`}>
                                    Five
                                </Button>

                                <Button disableRipple onClick={() => { handleNavigate(value.ActivitySixId, "six", value) }}
                                    disabled={!value.ActivitySixId}
                                    className={`activity-button ${value.ActivitySixId ? "active" : "disabled"}`}>
                                    Six
                                </Button>

                            </div>

                        </div>
                    )
                })
            )}


        </div>
    )
}

export default StudentDesignedActivities