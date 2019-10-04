import Router from "next/router";

const goToDesignMySpace = ({ pathname, query, as }) => {
	Router.push({ pathname, query }, as);
};

export default goToDesignMySpace;
