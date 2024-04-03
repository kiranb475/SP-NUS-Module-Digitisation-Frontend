import { Alert, Button, Typography } from '@mui/material'
import './Dashboard.css'
import { useEffect, useState } from 'react'
import axios from 'axios'

const InstructorDesignedActivities = () => {

    const [listOfActivities, setListOfActivities] = useState({})

    useEffect(() => {
        axios.get("https://activities-alset-aef528d2fd94.herokuapp.com/home/instructors").then((response) => {
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
                                    })()
                                })

                            }
                        })
                    })();
                })
            }
        })
    }, [])

    const handleCopyTemplate = async (data) => {
        
        let ActivitiesID;
        let Activity1Id
        let Activity2Id
        let Activity3Id
        let Activity4Id
        let Activity5Id
        let Activity6Id

        if (data.ActivityOneId) {
            const response = await axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/activityone/byId/${data.ActivityOneId}`);

            const ActivityOneData = response.data;
            delete ActivityOneData["id"];
            delete ActivityOneData["createdAt"];
            delete ActivityOneData["updatedAt"];

            if (ActivityOneData !== null) {
                let data = {id: sessionStorage.getItem("UserId"), content: ActivityOneData};
                const ActivityOneIdResponse = await axios.post("https://activities-alset-aef528d2fd94.herokuapp.com/activityone/fromtemplate", data);
                const ActivitiesID = ActivityOneIdResponse.data.ActivitiesId.id;
                const Activity1Id = ActivityOneIdResponse.data.ActivityOneId;
                sessionStorage.setItem("ActivitiesId", ActivitiesID);
                sessionStorage.setItem("ActivityOneId", Activity1Id);
            }
        }

        if (data.ActivityTwoId) {
            const response2 = await axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/activitytwo/byId/${data.ActivityTwoId}`);
            const ActivityTwoData = response2.data;
            delete ActivityTwoData["id"];
            delete ActivityTwoData["createdAt"];
            delete ActivityTwoData["updatedAt"];

            if (ActivityTwoData !== null) {
                let data = {
                    id: sessionStorage.getItem("ActivitiesId"),
                    content: ActivityTwoData,
                };
                const ActivityTwoIdResponse = await axios.post("https://activities-alset-aef528d2fd94.herokuapp.com/activitytwo", data);
                const Activity2Id = ActivityTwoIdResponse.data.id;
                sessionStorage.setItem("ActivityTwoId", Activity2Id);
            }
        }

        if (data.ActivityThreeId) {
            const response3 = await axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/activitythree/byId/${data.ActivityThreeId}`);
            const ActivityThreeData = response3.data;
            delete ActivityThreeData["id"];
            delete ActivityThreeData["createdAt"];
            delete ActivityThreeData["updatedAt"];

            if (ActivityThreeData !== null) {
                let data = {
                    id: sessionStorage.getItem("ActivitiesId"),
                    content: ActivityThreeData,
                };
                const ActivityThreeIdResponse = await axios.post("https://activities-alset-aef528d2fd94.herokuapp.com/activitythree", data);
                const Activity3Id = ActivityThreeIdResponse.data.id;
                sessionStorage.setItem("ActivityThreeId", Activity3Id);
            }
        }

        if (data.ActivityFourId) {
            const response4 = await axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/activityfour/byId/${data.ActivityFourId}`);
            const ActivityFourData = response4.data;
            delete ActivityFourData["id"];
            delete ActivityFourData["createdAt"];
            delete ActivityFourData["updatedAt"];

            if (ActivityFourData !== null) {
                let data = {
                    id: sessionStorage.getItem("ActivitiesId"),
                    content: ActivityFourData,
                };
                const ActivityFourIdResponse = await axios.post("https://activities-alset-aef528d2fd94.herokuapp.com/activityfour", data);
                const Activity4Id = ActivityFourIdResponse.data.id;
                sessionStorage.setItem("ActivityFourId", Activity4Id);
            }
        }

        if (data.ActivityFiveId) {
            const response5 = await axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/activityfive/byId/${data.ActivityFiveId}`);
            const ActivityFiveData = response5.data;
            delete ActivityFiveData["id"];
            delete ActivityFiveData["createdAt"];
            delete ActivityFiveData["updatedAt"];

            if (ActivityFiveData !== null) {
                let data = {
                    id: sessionStorage.getItem("ActivitiesId"),
                    content: ActivityFiveData,
                };
                const ActivityFiveIdResponse = await axios.post("https://activities-alset-aef528d2fd94.herokuapp.com/activityfive", data);
                const Activity5Id = ActivityFiveIdResponse.data.id;
                sessionStorage.setItem("ActivityFiveId", Activity5Id);
            }
        }

        if (data.ActivitySixId) {
            const response6 = await axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/activitysix/byId/${data.ActivitySixId}`);
            const ActivitySixData = response6.data;
            delete ActivitySixData["id"];
            delete ActivitySixData["createdAt"];
            delete ActivitySixData["updatedAt"];

            if (ActivitySixData !== null) {
                let data = {
                    id: sessionStorage.getItem("ActivitiesId"),
                    content: ActivitySixData,
                };
                const ActivitySixIdResponse = await axios.post("https://activities-alset-aef528d2fd94.herokuapp.com/activitysix", data);
                const Activity6Id = ActivitySixIdResponse.data.id;
                sessionStorage.setItem("ActivityFourId", Activity6Id);
            }
        }

        for (let i = 1; i <= 6; i++ ) {
            let logs_data = {
                DateTime: Date.now(),
                ActivitySequenceId: ActivitiesID,
                InstructorId: sessionStorage.getItem("UserId"),
                Event: "Create",
                ActivityId: `Activity${i}Id`,
                ActivityType: `Activity ${i}`,
            };

            await axios.post(`https://activities-alset-aef528d2fd94.herokuapp.com/instructorlog/create`, logs_data);
        }

        window.location.reload(false);

    }

    return (
        <div>

            <Typography variant="h5" className="custom-activities-title">
                Instructor-Designed Activity Templates
            </Typography>

            <Alert className="alert-warning" severity="warning">
                Important: Please avoid refreshing the page while the template is being copied. The page will refresh automatically once the activities have been successfully duplicated.
            </Alert>

            {Object.entries(listOfActivities).map(([key, value]) => {
                return (
                    <div key={key} className="other-activities">
                        <div className='activity-container'>
                            <Typography className="activity-title">
                                {value.activityTitle === "" ? "No Title Provided" : value.activityTitle}
                            </Typography>
                            <Typography className='activity-author'>
                                ({value.username})
                            </Typography>
                        </div>
                        <Button
                            className="copy-template-button"
                            onClick={() => handleCopyTemplate(value)}
                        >
                            Copy Template
                        </Button>
                        
                    </div>
                )
            })}

        </div>
    )

}

export default InstructorDesignedActivities