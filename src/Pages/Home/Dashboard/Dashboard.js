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
        <div className='container'>
            {occupation === "Instructor" ? <CustomActivitiesInstructor /> : <CustomActivitiesStudent />}
            {occupation === "Instructor" ? <StudentDesignedActivities /> : <InstructorDesignedActivities />}
        </div>
    )
}

export default Dashboard