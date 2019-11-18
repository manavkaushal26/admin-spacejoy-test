import moment from "moment";
import { Status } from "@customTypes/userType";
import { Progress } from "antd";
import { projectConfig } from '@utils/config';

interface ProgressBarProps {
	status: Status|"";
    endTime: number;
    width?: number
}

const getProgressBarText = (days:number):string => {
    const displayDays = days < 0 ? 0 : days;
    return `${displayDays}`
}

const ProgressBar: React.FC<ProgressBarProps> = ({ status,endTime, width=66}):JSX.Element => {
    const duration = moment.duration(moment(endTime).diff(moment()));
    const days = duration.get('days');
    const progressPercentage = (days/projectConfig.lifetime)* 100;
    let progressStatus: "normal"|"exception" = 'normal';
	if(status === Status.completed) {
		return (<Progress percent={100} type="circle" width={width}/>)
	} else if (days===0) {
        progressStatus = 'exception'
    }
	return (<Progress percent={progressPercentage} status={progressStatus} format={()=>getProgressBarText(days)} type="circle" width={width}/>)
}

export default ProgressBar;