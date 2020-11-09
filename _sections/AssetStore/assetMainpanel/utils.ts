import { MoodboardAsset } from "@customTypes/moodboardTypes";

export const categoryIdNameMapper = metaData => {
	if (metaData) {
		return metaData.categories.list.reduce((acc, category) => ({ ...acc, [category._id]: category.name }), {});
	}
	return {};
};

export const subCategoryIdNameMapper = metaData => {
	if (metaData) {
		return metaData.subcategories.list.reduce(
			(acc, subCategory) => ({ ...acc, [subCategory._id]: subCategory.name }),
			{}
		);
	}
	return {};
};

export const verticalIdNameMapper = metaData => {
	if (metaData) {
		return metaData.verticals.list.reduce((acc, vertical) => ({ ...acc, [vertical._id]: vertical.name }), {});
	}
	return {};
};

export const isAssetInMoodboard: (moodboard: MoodboardAsset[], assetId: string, assetEntryId: string) => boolean = (
	moodboard,
	assetId,
	assetEntryId
) => {
	if (moodboard) {
		if (assetEntryId) {
			return moodboard
				.filter(asset => asset.isExistingAsset && asset.asset !== null)
				.find(asset => asset.asset._id === assetEntryId)
				.recommendations.some(asset => asset._id === assetId);
		}
		return moodboard.filter(asset => asset.isExistingAsset).some(asset => asset?.asset?._id === assetId);
	}
	return false;
};
