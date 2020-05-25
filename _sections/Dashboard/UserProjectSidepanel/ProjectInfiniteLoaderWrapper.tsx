import React, { useMemo } from "react";
import { FixedSizeList as List, ListChildComponentProps } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import { UserProjectType } from "@customTypes/dashboardTypes";

interface ProjectInfiniteLoaderWrapper {
	// Are there more items to load?
	// (This information comes from the most recent API request.)
	hasNextPage: boolean;
	height: number;
	infiniteLoaderRef: React.MutableRefObject<any>;
	Row: ({ index, style }: ListChildComponentProps) => JSX.Element;
	// Are we currently loading a page of items?
	// (This may be an in-flight flag in your Redux store for example.)
	isNextPageLoading: boolean;
	count: number;
	// Array of items loaded so far.
	items: UserProjectType[];

	// Callback function responsible for loading the next page of items.
	loadNextPage: (startIndex, endIndex) => Promise<void>;
}

const ProjectInfiniteLoaderWrapper: React.FC<ProjectInfiniteLoaderWrapper> = ({
	hasNextPage,
	height,
	isNextPageLoading,
	items,
	infiniteLoaderRef,
	Row,
	count,
	loadNextPage,
}) => {
	// If there are more items to be loaded then add an extra row to hold a loading indicator.
	const itemCount = useMemo(() => {
		if (hasNextPage) {
			return items.length + 300 < count ? items.length + 300 : count;
		}
		return items.length;
	}, [count, hasNextPage, items, isNextPageLoading]);

	// Only load 1 page of items at a time.
	// Pass an empty callback to InfiniteLoader in case it asks us to load more than once.
	const loadMoreItems = isNextPageLoading
		? (): Promise<void> => {
				return new Promise(resolve => resolve());
		  }
		: loadNextPage;

	// Every row is loaded except for our loading indicator row.
	const isItemLoaded = index => !hasNextPage || index < items.length;

	// Render an item or a loading indicator.

	return (
		<InfiniteLoader
			ref={infiniteLoaderRef}
			isItemLoaded={isItemLoaded}
			itemCount={itemCount}
			loadMoreItems={loadMoreItems}
			minimumBatchSize={300}
		>
			{({ onItemsRendered, ref }): JSX.Element => (
				<List
					className="List"
					height={height}
					itemCount={itemCount}
					itemSize={97}
					onItemsRendered={onItemsRendered}
					ref={ref}
					width="100%"
				>
					{Row}
				</List>
			)}
		</InfiniteLoader>
	);
};

export default ProjectInfiniteLoaderWrapper;
