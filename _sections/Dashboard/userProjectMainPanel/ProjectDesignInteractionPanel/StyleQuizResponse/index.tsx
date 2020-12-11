import Image from "@components/Image";
import fetcher from "@utils/fetcher";
import React, { useEffect, useState } from "react";

interface LogObject {
	isActive: boolean;
	cdn: string;
	id: number;
	description: string;
}
interface LogShape {
	[key: string]: Array<LogObject>;
}

const UserStyleQuizResponse: React.FC<{ userId: string }> = ({ userId }) => {
	const [userStyleLogs, setUserStyleLogs] = useState([]);

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
			{userStyleLogs.map(userStyle => {
				const styleCategory = Object.keys(userStyle)[0];
				const values = Object.values(userStyle);
				return (
					<div key={userStyle?.id}>
						<h2 style={{ textTransform: "capitalize" }}>{styleCategory}</h2>
						{values[0] &&
							values[0].map(
								(value: LogObject): JSX.Element => {
									console.log("value", value);
									return (
										<>
											<Image style={{ maxWidth: 300 }} src={`q_70,w_300,h_180/${value?.cdn}`} width='100%' />
											&nbsp;
										</>
									);
								}
							)}
						<br></br>
						<br></br>
					</div>
				);
			})}
		</div>
	);
};

export default UserStyleQuizResponse;
