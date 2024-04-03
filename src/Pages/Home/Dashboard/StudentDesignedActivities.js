import { Button, Typography } from "@mui/material"
import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import './Dashboard.css'

const StudentDesignedActivities = () => {

    const [listOfActivities, setListOfActivities] = useState({})
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("https://activities-alset-aef528d2fd94.herokuapp.com/home/students").then((response) => {
            if (response.data) {
                Object.entries(response.data).forEach(([key, value]) => {
                    (async () => {
                        await axios.post("https://activities-alset-aef528d2fd94.herokuapp.com/home", { UserId: parseInt(value.id) }).then((response) => {
                            if (response.data) {
                                Object.entries(response.data).forEach(([key2, value2]) => {
                                    (async () => {
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

    return (
        <div>

            <Typography variant="h5" className="custom-activities-title">
                Student Activities
            </Typography>

            {Object.entries(listOfActivities).map(([key, value]) => {
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

                        </div>

                    </div>
                )
            })}

        </div>
    )
}

export default StudentDesignedActivities