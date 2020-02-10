/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { cloudinary } from "@utils/config";
import React, { useEffect, useCallback, useState } from "react";

interface ImageProps {
	src: string;
	height?: string;
	preLoadHeight?: string;
	width?: string;
	alt?: string;
	onClick?: (e: any) => void;
}

function Image({ src, height = "auto", width = "auto", alt, onClick, preLoadHeight }: ImageProps): JSX.Element {
	const source =
		src.includes("storage.googleapis.com") || src.includes("api.homefuly.com")
			? src
			: `${cloudinary.baseDeliveryURL}/image/upload/${src}`;
	const lowQualitySource =
		src.includes("storage.googleapis.com") || src.includes("api.homefuly.com")
			? src
			: `${cloudinary.baseDeliveryURL}/image/upload/e_blur:828,q_10/${src}`;

	const [selectedNode, setSelectedNode] = useState<HTMLImageElement>();
	useEffect(() => {
		const intersectionObserver = new IntersectionObserver(
			(entries, observer) => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						const target = entry.target as HTMLImageElement;
						target.src = target.dataset.src;
						observer.unobserve(entry.target);
					}
				});
			},
			{
				rootMargin: "0px 0px 0px 0px",
				threshold: 0.2,
			}
		);
		if (selectedNode) {
			intersectionObserver.observe(selectedNode);

			return (): void => {
				intersectionObserver.unobserve(selectedNode);
			};
		}
		return (): void => {};
	}, [selectedNode]);

	const callbackRef = useCallback(node => {
		if (node) {
			setSelectedNode(node);
		}
	}, []);

	const onLoad = () => {
		if (selectedNode) {
			if (!selectedNode.complete) {
				selectedNode.style.height = preLoadHeight;
			} else {
				selectedNode.style.height = height;
			}
		}
	};

	return (
		<>
			<img
				onClick={onClick}
				ref={callbackRef}
				alt={alt}
				onLoad={onLoad}
				onKeyDown={(e): void => {
					if (e.keyCode === 13) {
						onClick(e);
					}
				}}
				width={width}
				height={height === "auto" ? preLoadHeight : height}
				src={lowQualitySource}
				data-src={source}
			/>
			{/* <LazyLoadImage
				{...props}
				src={source}
				alt={alt}
				width={width}
				height={height}
				scrollPosition={scrollPosition}
				visibleByDefault={nolazy}
				className={shape}
			/> */}
		</>
	);
}

export default React.memo(Image);
