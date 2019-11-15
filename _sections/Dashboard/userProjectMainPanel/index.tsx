import React, { useState } from 'react';
import { UserProjectType } from '@customTypes/dashboardTypes';
import ProjectSummary from './projectSummary';
import { number } from 'prop-types';


const userProjectMainPanel:React.FC<{userProjectData:string}> = ({userProjectData}):JSX.Element => {
    const [state, setState] = useState<UserProjectType>(null);
    


    return (
        <div>
            {/* <ProjectSummary userProjectData={userProjectData}/> */}
        </div>
    )
};

export default userProjectMainPanel;