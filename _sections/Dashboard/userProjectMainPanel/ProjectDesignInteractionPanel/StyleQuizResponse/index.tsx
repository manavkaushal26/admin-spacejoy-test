import { imageKitConfig } from "@utils/config";
import fetcher from "@utils/fetcher";
import { Image } from "antd";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
const Heading = styled.h1`
	font-size: 26px;
	text-transform: capitalize;
	text-decoration: underline;
`;

const StyledImage = styled(Image)`
	max-width: 300px;
	cursor: pointer;
`;

interface LogObject {
	isActive: boolean;
	cdn: string;
	id: number;
	description: string;
}

interface ActiveStyleObject {
	cdn?: string;
	name: string;
}

interface SecondaryStyleObject {
	cdn?: string;
	name: string;
}

interface LogShape {
	[key: string]: Array<LogObject>;
}

const UserStyleQuizResponse: React.FC<{ userId: string }> = ({ userId }) => {
	const [userStyleLogs, setUserStyleLogs] = useState([]);
	const [activeStyle, setActiveStyle] = useState<ActiveStyleObject>({
		name: "",
		cdn: "",
	});
	const [secondaryStyle, setSecondaryStyle] = useState<SecondaryStyleObject>({
		name: "",
		cdn: "",
	});
	const fetchUserStyleResponse = async (userId: string): Promise<string> => {
		const endPoint = `/v1/quizUsers/${userId}/results`;
		let err;
		try {
			const res = await fetcher({ endPoint, method: "GET" });
			const {
				data: { data },
				statusCode,
			} = res;
			if (statusCode <= 300) {
				setActiveStyle(data[0]?.styleIds[0]);
				setSecondaryStyle(data[0]?.styleIds[1]);
				return data[0].quizId || "";
			} else {
				throw new Error("");
			}
		} catch (e) {
			return err;
		}
	};

	const fetchUserQuizLog = async (quizId: string): Promise<Array<LogShape>> => {
		const endPoint = `/v1/quizzes/${quizId}/logs`;
		let err;
		try {
			const res = await fetcher({ endPoint, method: "GET" });
			const { data, statusCode } = res;
			if (statusCode <= 300) {
				return data.logs || [];
			} else {
				throw new Error("");
			}
		} catch (e) {
			return err;
		}
	};
	const fetchResults = async (userId: string): Promise<void> => {
		const userStyleQuizResponse = await fetchUserStyleResponse(userId);
		if (userStyleQuizResponse) {
			const quizResultLog = await fetchUserQuizLog(userStyleQuizResponse);
			setUserStyleLogs(quizResultLog);
		}
	};
	useEffect(() => {
		if (userId) {
			fetchResults(userId);
		}
	}, [userId]);

	return (
		<div>
			<div>
				<br></br>
				{activeStyle?.name && (
					<Heading>
						Style - <i>{activeStyle?.name || ""}</i>
						&nbsp;
						<i>{secondaryStyle ? <span>and {secondaryStyle?.name || ""}</span> : null}</i>
					</Heading>
				)}
				{activeStyle?.cdn && (
					<span>
						<StyledImage src={`q_70,w_300,h_180/${activeStyle?.cdn}`} width='100%' />
					</span>
				)}
			</div>
			<br></br>
			{userStyleLogs.map(userStyle => {
				const styleCategory = Object.keys(userStyle)[0];
				const values: { cdn: string }[][] = Object.values(userStyle);
				return (
					<div key={userStyle?.id}>
						<h2 style={{ textTransform: "capitalize" }}>{styleCategory}</h2>
						{values[0] &&
							values[0].map((value: LogObject): JSX.Element => {
								return (
									<>
										{/* /q_70,w_300 */}
										<StyledImage src={`${imageKitConfig.baseDeliveryURL}/${value?.cdn}`} width='100%' />
										&nbsp;
									</>
								);
							})}
						<br></br>
						<br></br>
					</div>
				);
			})}
		</div>
	);
};

export default UserStyleQuizResponse;
