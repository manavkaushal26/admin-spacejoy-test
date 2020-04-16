/* eslint-disable no-param-reassign */
import { OrbitControls } from "@utils/OrbitControls";
import { Icon } from "antd";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import {
	Box3,
	PerspectiveCamera,
	Scene,
	Vector3,
	WebGLRenderer,
	PlaneGeometry,
	sRGBEncoding,
	PointLight,
	MeshStandardMaterial,
	Fog,
	Mesh,
	HemisphereLight,
	PCFSoftShadowMap,
	PCFShadowMap,
	FrontSide,
	Vector2,
	Color,
} from "three";
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

const addMeshShadow = (children): void => {
	children.map((child): void => {
		if (child.type === "Group") {
			if (child.children && child.children.length !== 0) {
				addMeshShadow(child.children);
			}
		}
		if (child.type === "Mesh") {
			child.castShadow = true;
		}
	});
};

const ModelViewer: React.FC<ModelViewer> = ({ type, pathToFile }) => {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const canvasRef = useRef(null);
	const camera = new PerspectiveCamera(70, 1, 0.01, 1000);
	const scene = new Scene();
	const renderer = new WebGLRenderer({ antialias: true });
	const controls = new OrbitControls(camera, renderer.domElement);
	const hemisphereLight = new HemisphereLight(0xffffff, 0x9d9b8c, 0.8);
	const pointLight = new PointLight(0xffffff, 0.8);
	const pointLight2 = new PointLight(0xffffff, 0.8);

	const floorGeometry = new PlaneGeometry(50, 50, 32);
	floorGeometry.lookAt(new Vector3(0, 10, 0));
	const floorMaterial = new MeshStandardMaterial({ color: 0x9d9b8c, side: FrontSide, shadowSide: FrontSide });
	const floorMesh = new Mesh(floorGeometry, floorMaterial);
	const fog = new Fog(0x9d9b8c, 2, 10);

	floorMesh.receiveShadow = true;

	pointLight.position.set(5, 20, 7.5);
	pointLight.castShadow = true;
	pointLight.shadow.radius = 4;
	pointLight.shadow.mapSize = new Vector2(2048, 2048);
	pointLight.decay = 2;
	pointLight2.position.set(-5, -10, -7.5);
	pointLight2.decay = 2;

	const render = (): void => {
		if (camera.position.z > 20) {
			camera.position.set(camera.position.x, camera.position.y, 20);
		}
		renderer.render(scene, camera);
	};

	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(312, 312);
	renderer.setClearColor(0x9d9b8c, 1);
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = PCFShadowMap;
	renderer.outputEncoding = sRGBEncoding;
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
	// scene.add(directionalLight);
	scene.add(camera);
	scene.add(pointLight);
	scene.add(floorMesh);
	scene.add(hemisphereLight);
	scene.add(pointLight2);
	scene.fog = fog;
	scene.background = new Color(0x9d9b8c);

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
					readGltf => {
						const gltf = { ...readGltf };
						setLoading(false);
						const objectBound = new Box3().setFromObject(gltf.scene);
						addMeshShadow(gltf.scene.children);
						gltf.scene.position.set(0, 0, 0);
						gltf.scene.scale.set(1, 1, 1);
						const center = new Vector3();
						const size = new Vector3();
						gltf.scene.castShadow = true;
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
