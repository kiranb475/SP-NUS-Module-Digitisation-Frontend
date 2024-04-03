import { Box, Typography } from '@mui/material'
import './Dashboard.css'
import CustomActivitiesInstructor from './CustomActivitiesInstructor';
import CustomActivitiesStudent from './CustomActivitiesStudent';
import InstructorDesignedActivities from './InstructorDesignedActivities';
import StudentDesignedActivities from './StudentDesignedActivities';

const Dashboard = () => {

    const username = sessionStorage.getItem("Username");
    const occupation = sessionStorage.getItem("Occupation");

    return (
        <Box>
            <Typography className="credentials-title" variant="h5">
                Credentials
            </Typography>
            <Typography className="credentials-detail" variant="h5">
                Username: {username}
            </Typography>
            <Typography className="credentials-detail" variant="h5">
                Role: {occupation}
            </Typography>
            {occupation === "Instructor" ? <CustomActivitiesInstructor /> : <CustomActivitiesStudent />}
            <div style={{marginTop: 50}}></div>
            {occupation === "Instructor" ? <StudentDesignedActivities /> : <InstructorDesignedActivities />}
        </Box>
    )
}

export default Dashboard