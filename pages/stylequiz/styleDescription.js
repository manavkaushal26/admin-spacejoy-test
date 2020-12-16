import { ArrowLeftOutlined } from "@ant-design/icons";
import * as StyleQuizAPI from "@api/styleQuizApis";
import { MaxHeightDiv } from "@sections/Dashboard/styled";
import PageLayout from "@sections/Layout";
import { styleFetcher, updateResource } from "@utils/styleQuizHelper";
import { Button, Card, Col, Input, notification, Row, Select, Spin, Typography } from "antd";
import { useRouter } from "next/router";
import { LoudPaddingDiv } from "pages/platformanager";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
const Wrapper = styled.div`
	input[type="file"],
	input[type="file"]::-webkit-file-upload-button {
		cursor: pointer;
		z-index: 12;
	}
`;

export default function StyleDescription() {
	const textareaRef = useRef(null);
	const { Title } = Typography;
	const Router = useRouter();
	const { TextArea } = Input;
	const [isLoading, setLoader] = useState(false);
	const [styles, setStylesData] = useState([]);
	const [primaryStyleId, setPrimaryStyleId] = useState("");
	const [secondaryStyleId, setSecondaryStyleId] = useState("");
	const [description, setDescription] = useState("");
	const stylesCategoryArray = ["Primary", "Secondary"];

	useEffect(() => {
		fetchStyles();
	}, []);

	useEffect(() => {
		setDescription("");
	}, [primaryStyleId, secondaryStyleId]);

	const fetchStyles = () => {
		styleFetcher(StyleQuizAPI.getActiveStylesAPI(), "GET")
			.then(res => {
				setStylesData(res.data);
			})
			.catch(err => {
				throw new Error();
			});
	};

	const handleSelection = (value, type) => {
		if (type === "Primary") {
			setPrimaryStyleId(value);
		} else {
			setSecondaryStyleId(value);
		}
	};

	const fetchDescriptions = async () => {
		if (primaryStyleId && secondaryStyleId) {
			const resData = await updateResource(StyleQuizAPI.descriptionsAPI(), "POST", {
				primaryId: primaryStyleId,
				secondaryId: secondaryStyleId,
			});
			setDescription(resData.description);
		} else {
			notification.error({ message: "Please choose valid styles" });
		}
	};

	const handleDescriptionChange = e => {
		setDescription(e.target.value);
	};

	const updateDescription = async () => {
		if (primaryStyleId && secondaryStyleId && description !== "") {
			await updateResource(StyleQuizAPI.descriptionsAPI(), "PUT", {
				primaryId: primaryStyleId,
				secondaryId: secondaryStyleId,
				description: description,
			});
			notification.success({ message: "Successfully Saved" });
		} else {
			notification.error({ message: "Please choose valid styles/Check for empty description" });
		}
		fetchStyles();
	};

	return (
		<PageLayout pageName='Styles List'>
			<MaxHeightDiv>
				<LoudPaddingDiv>
					<Col span={24}>
						<Title level={3}>
							<Row gutter={[8, 8]}>
								<Col>
									<ArrowLeftOutlined onClick={() => Router.back()} />
								</Col>
								<Col>Go Back</Col>
							</Row>
						</Title>
					</Col>
					<br></br>
					<Spin spinning={isLoading}>
						<Wrapper>
							<Card>
								<Row gutter={[8, 16]} type='flex' style={{ alignItems: "center" }}>
									{styles.length
										? stylesCategoryArray.map(item => {
												return (
													<Col sm={8} md={8} lg={8} align='left' key={item}>
														<span>
															<b>{item} Style</b>
														</span>
														<br></br>
														<br></br>
														<Select
															showSearch
															filterOption={(input, option) =>
																option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
															}
															style={{ width: "100%" }}
															onChange={value => handleSelection(value, item)}
															defaultValue='all'
														>
															{styles.map(style => {
																return (
																	<Select.Option key={style?.id} value={style?.id}>
																		{style?.name}
																	</Select.Option>
																);
															})}
														</Select>
													</Col>
												);
										  })
										: null}
									<Col sm={8} md={8} lg={8} align='right'>
										<Button onClick={fetchDescriptions}>Get Description</Button>
									</Col>
								</Row>
								<Row gutter={[8, 16]}>
									<Col span={24}>
										<Card>
											<TextArea
												onChange={handleDescriptionChange}
												value={description}
												placeholder='Add description...'
											></TextArea>
											<br></br>
											<br></br>
											<Button onClick={updateDescription}>Save</Button>
										</Card>
									</Col>
								</Row>
							</Card>
						</Wrapper>
					</Spin>
				</LoudPaddingDiv>
			</MaxHeightDiv>
		</PageLayout>
	);
}
