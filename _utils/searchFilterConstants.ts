import { PhaseInternalNames, QuizState } from "@customTypes/dashboardTypes";
import moment from "moment";

const allFilterNames = {
	moodboardsToBeCreated: "Moodboards to be created",
	rendersToBeReviewed: "Renders to be reviewed",
	inProgress: "All Projects in Progress",
	quizNotStarted: "Projects where Quiz has Not Started",
	quizUnderReview: "Projects where Quiz is Under Review",
	quizInProgress: "Projects where Quiz is  In Progress",
	delayed: "All Delayed Projects",
	dueThisWeek: "All Projects due this Week",
	dueIn3Days: "All Projects due in next 3 Days",
	dueIn4InModelling: "Projects due in next 4 days and in Modelling or before",
	dueIn3daysAndInRender: "Projects due in next 3 days and in Render or before",
	modelsToBeCompleted: "Models to be completed",
};

const timeBasedFilters = ["delayed", "dueIn3Days", "dueThisWeek", "dueIn4InModelling", "dueIn3daysAndInRender"];

const quizStatusBasedFilters = ["quizNotStarted", "quizInProgress", "quizUnderReview"];

const phaseBasedFilters = [
	"moodboardsToBeCreated",
	"modelsToBeCompleted",
	"designsToBeCompleted",
	"rendersToBeReviewed",
	"designsInRevision",
	"inProgress",
	// "deliveredBtwXAndY",
];

interface searchFiltersPresets {
	type: string;
	from?: number;
	to?: number;
}

const searchFiltersPresets = ({ type, from, to }: searchFiltersPresets): Record<string, any> => {
	const today = moment().utc().startOf("day");
	if (type === "delayed")
		return {
			nameSearchText: "",
			designerSearchText: "",
			data: [],
			pageCount: 0,
			phase: ["requirement", "designConcept", "modelling", "designRender", "design3D"],
			name: "",
			sortBy: "endedAt",
			hasMore: true,
			currentTab: "active",
			status: "active",
			searchResults: [],
			sortOrder: 1,
			count: 0,
			startedAt: [],
			endedAt: [null, today.clone().subtract(1, "day")],
			minMax: [null, -1],
		};
	if (type === "dueThisWeek")
		return {
			nameSearchText: "",
			designerSearchText: "",
			data: [],
			pageCount: 0,
			phase: ["requirement", "designConcept", "modelling", "design3D", "designRender"],
			name: "",
			sortBy: "endedAt",
			hasMore: true,
			currentTab: "active",
			status: "active",
			searchResults: [],
			sortOrder: 1,
			count: 0,
			startedAt: [],
			endedAt: [null, today.clone().endOf("week")],
			minMax: [null, today.clone().diff(today.endOf("week"), "days")],
		};
	if (type === "dueIn3Days")
		return {
			nameSearchText: "",
			designerSearchText: "",
			data: [],
			pageCount: 0,
			phase: ["designConcept", "modelling", "design3D", "designRender", "requirement"],
			name: "",
			sortBy: "endedAt",
			hasMore: true,
			currentTab: "active",
			status: "active",
			searchResults: [],
			sortOrder: 1,
			count: 0,
			startedAt: [],
			endedAt: [null, today.clone().add(3, "days")],
			minMax: [null, 3],
		};
	if (type === "inProgress")
		return {
			nameSearchText: "",
			designerSearchText: "",
			data: [],
			pageCount: 0,
			phase: ["requirement", "designConcept", "modelling", "design3D", "designRender", "designsInRevision"],
			name: "",
			sortBy: "endedAt",
			hasMore: true,
			currentTab: "active",
			status: "active",
			searchResults: [],
			sortOrder: 1,
			count: 0,
			startedAt: [],
			endedAt: [null, null],
			minMax: [null, null],
		};
	if (type === "deliveredBtwXAndY")
		return {
			nameSearchText: "",
			designerSearchText: "",
			data: [],
			pageCount: 0,
			phase: ["designReady", "designsInRevision", "shop"],
			name: "",
			sortBy: "endedAt",
			hasMore: true,
			currentTab: "active",
			status: "active",
			searchResults: [],
			sortOrder: 1,
			count: 0,
			startedAt: [],
			endedAt: [today.clone().add(from, "days"), today.clone().add(to, "days")],
			minMax: [from, to],
		};
	if (type === "dueIn4InModelling")
		return {
			nameSearchText: "",
			designerSearchText: "",
			data: [],
			pageCount: 0,
			phase: ["modelling", "designConcept", "requirement"],
			name: "",
			sortBy: "endedAt",
			hasMore: true,
			currentTab: "active",
			status: "active",
			searchResults: [],
			sortOrder: 1,
			count: 0,
			startedAt: [],
			endedAt: [null, today.clone().add(4, "days")],
			minMax: [null, 5],
		};
	if (type === "dueIn3daysAndInRender")
		return {
			nameSearchText: "",
			designerSearchText: "",
			data: [],
			pageCount: 0,
			phase: ["modelling", "designConcept", "requirement"],
			name: "",
			sortBy: "endedAt",
			hasMore: true,
			currentTab: "active",
			status: "active",
			searchResults: [],
			sortOrder: 1,
			count: 0,
			startedAt: [],
			endedAt: [null, today.clone().add(4, "days")],
			minMax: [null, 4],
		};
	if (type === "quizNotStarted")
		return {
			nameSearchText: "",
			designerSearchText: "",
			data: [],
			pageCount: 0,
			phase: [],
			name: "",
			sortBy: "endedAt",
			hasMore: true,
			currentTab: "active",
			status: "active",
			searchResults: [],
			sortOrder: 1,
			count: 0,
			startedAt: [],
			endedAt: [],
			minMax: [null, null],
			quizStatus: QuizState.open,
		};
	if (type === "quizUnderReview")
		return {
			nameSearchText: "",
			designerSearchText: "",
			data: [],
			pageCount: 0,
			phase: [],
			name: "",
			sortBy: "endedAt",
			hasMore: true,
			currentTab: "active",
			status: "active",
			searchResults: [],
			sortOrder: 1,
			count: 0,
			startedAt: [],
			endedAt: [],
			minMax: [null, null],
			quizStatus: QuizState.underReview,
		};
	if (type === "quizInProgress")
		return {
			nameSearchText: "",
			designerSearchText: "",
			data: [],
			pageCount: 0,
			phase: [],
			name: "",
			sortBy: "endedAt",
			hasMore: true,
			currentTab: "active",
			status: "active",
			searchResults: [],
			sortOrder: 1,
			count: 0,
			startedAt: [],
			endedAt: [],
			minMax: [null, null],
			quizStatus: QuizState.inProgress,
		};
	if (type === "rendersToBeReviewed")
		return {
			nameSearchText: "",
			designerSearchText: "",
			data: [],
			pageCount: 0,
			phase: [PhaseInternalNames.designRender],
			name: "",
			sortBy: "endedAt",
			hasMore: true,
			currentTab: "active",
			status: "active",
			searchResults: [],
			sortOrder: 1,
			count: 0,
			startedAt: [],
			endedAt: [],
			minMax: [null, null],
		};
	if (type === "moodboardsToBeCreated")
		return {
			nameSearchText: "",
			designerSearchText: "",
			data: [],
			pageCount: 0,
			phase: [PhaseInternalNames.designConcept],
			name: "",
			sortBy: "endedAt",
			hasMore: true,
			currentTab: "active",
			status: "active",
			searchResults: [],
			sortOrder: 1,
			count: 0,
			startedAt: [],
			endedAt: [],
			minMax: [null, null],
		};
	if (type === "modelsToBeCompleted")
		return {
			nameSearchText: "",
			designerSearchText: "",
			data: [],
			pageCount: 0,
			phase: [PhaseInternalNames.modelling],
			name: "",
			sortBy: "endedAt",
			hasMore: true,
			currentTab: "active",
			status: "active",
			searchResults: [],
			sortOrder: 1,
			count: 0,
			startedAt: [],
			endedAt: [],
			minMax: [null, null],
		};
};

export { searchFiltersPresets, phaseBasedFilters, timeBasedFilters, quizStatusBasedFilters, allFilterNames };
