import { OrbitControls } from "@utils/OrbitControls";
import { Icon } from "antd";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { AmbientLight, Box3, DirectionalLight, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from "three";
import GLTFLoader from "three-gltf-loader";

interface ModelViewer {
	type: "obj" | "glb";
	pathToFile: string;
}

const ModelViewerParentStyled = styled.div`
	position: relative;
`;

const ModelLoaderProgress = styled.span`
	width: 100%;
	position: absolute;
	height: 100%;
	display: flex;
	color: black;
	flex-direction: column;
	background: white;
	justify-content: center;
	align-items: center;
	align-content: center;
`;

const ModelViewer: React.FC<ModelViewer> = ({ type, pathToFile }) => {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const canvasRef = useRef(null);
	const camera = new PerspectiveCamera(70, 1, 0.01, 1000);
	const scene = new Scene();
	const renderer = new WebGLRenderer({ antialias: true });
	const controls = new OrbitControls(camera, renderer.domElement);
	const directionalLight = new DirectionalLight(0xffffff, 0.7);

	directionalLight.position.set(5, 10, 7.5);
	const directionalLight2 = new DirectionalLight(0xffffff, 0.7);
	const directionalLightFront = new DirectionalLight(0xffffff, 0.7);
	directionalLightFront.position.set(-5, 0, 20);
	directionalLight2.position.set(-5, -10, -7.5);
	const ambientLight = new AmbientLight(0xffffff, 1);
	const render = (): void => {
		renderer.render(scene, camera);
	};

	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(312, 312);
	renderer.setClearColor(0xf2f3f5, 0.5);

	camera.position.set(0, 1, 1);
	controls.update();

	controls.addEventListener("change", render);
	controls.minDistance = 0.1;
	controls.maxDistance = 50;
	controls.enableZoom = true;
	controls.enableKeys = true;
	controls.enableRotate = true;
	controls.enableDamping = true;
	controls.maxZoom = 2;
	controls.minZoom = 1;
	// Scene Setup
	scene.add(directionalLight);
	scene.add(directionalLight2);
	scene.add(directionalLightFront);
	scene.add(camera);
	scene.add(ambientLight);

	useEffect(() => {
		if (canvasRef.current) {
			canvasRef.current.appendChild(renderer.domElement);
		}
	}, [canvasRef]);

	useEffect(() => {
		if (canvasRef.current) {
			if (type === "glb") {
				const loader = new GLTFLoader();

				loader.load(
					pathToFile,
					gltf => {
						setLoading(false);
						const objectBound = new Box3().setFromObject(gltf.scene);
						gltf.scene.position.set(0, 0, 0);
						const center = new Vector3();
						const size = new Vector3();
						objectBound.getSize(size);
						objectBound.getCenter(center);
						const cameraDistance = size.x * 1.6 > size.y * 1.2 ? size.x * 1.6 : size.y * 1.2;
						camera.position.set(0, center.y, cameraDistance);
						camera.lookAt(center);

						controls.target = center;

						scene.add(gltf.scene);
						renderer.render(scene, camera);
					},
					() => {
						setLoading(true);
					},
					() => {
						setError(true);
					}
				);
			}
		}
	}, [canvasRef]);
	return (
		<ModelViewerParentStyled>
			{loading && (
				<ModelLoaderProgress>
					{!error ? (
						<Icon style={{ fontSize: "2rem" }} type="loading" />
					) : (
						<>
							<Icon type="close" />
							<span>Failed to load model</span>
						</>
					)}
				</ModelLoaderProgress>
			)}
			<div ref={canvasRef} />
		</ModelViewerParentStyled>
	);
};

export default ModelViewer;
