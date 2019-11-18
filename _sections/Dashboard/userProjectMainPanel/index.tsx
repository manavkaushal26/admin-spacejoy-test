import React, { useState, useEffect } from 'react';
import { UserProjectType } from '@customTypes/dashboardTypes';
import ProjectSummary from './projectSummary';
import { Divider } from 'antd';


const userProjectMainPanel:React.FC<{userProjectData:string}> = ({userProjectData}):JSX.Element => {
    const [userData, setUserData] = useState<UserProjectType>(null);
    
    useEffect(()=> {

    }, [userProjectData]);

    return (
        <div>
            <ProjectSummary userProjectData={userProjectData}/>
            <Divider />
            {/* <BasicDetails userProjectData={userProjectData}/> */}
        </div>
    )
};

export default userProjectMainPanel;