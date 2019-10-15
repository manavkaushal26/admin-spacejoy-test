import Router from "next/router";

const goToQuiz = ({ pathname, query, as }) => {
	Router.push({ pathname, query }, as);
};

const quizReqBody = (entry = "0", question = "begin", answer = "new") => {
	return {
		data: {
			name: "onboardingQuiz",
			environment: process.env.NODE_ENV,
			formData: [
				{
					entry,
					question,
					answer
				}
			],
			userId: "",
			userEmail: ""
		}
	};
};

export { goToQuiz, quizReqBody };
