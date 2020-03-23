import { blogApi, getBlogCategories, publishBlog, createBlogCategoryApi } from "@api/blogApi";
import Image from "@components/Image";
import { Category } from "@customTypes/blogTypes";
import { MaxHeightDiv, SilentDivider } from "@sections/Dashboard/styled";
import { debounce, getValueSafely } from "@utils/commonUtils";
import fetcher from "@utils/fetcher";
import { Button, Col, Collapse, Input, notification, Row, Select, Spin, Typography } from "antd";
import React, { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import { Status, Role } from "@customTypes/userType";
import { cookieNames } from "@utils/config";
import getCookie from "@utils/getCookie";
import { useRouter } from "next/router";
import { AuthorPlatformProps } from "..";
import { AUTHOR_ACTIONS } from "../reducer";
import ImageManagementConsole from "./ImageManagementConsole";
import AddCategoryModal, { AddCategoryModalState } from "./AddCategoryModal";
import { getQueryObject, getQueryString } from "../utils";

const { Panel } = Collapse;
const { Text } = Typography;

const StyledButton = styled(Button)`
	background-color: #fa8c16;
	border-color: #fa8c16;
	color: #ffffff;
	:focus,
	:hover {
		background-color: #fcb161;
		color: #ffffff;
	}
`;

const fetchCategories = async (
	searchText: string,
	setFetching: React.Dispatch<React.SetStateAction<boolean>>,
	setCategories: React.Dispatch<React.SetStateAction<Category[]>>
): Promise<void> => {
	setFetching(true);
	const endPoint = `${getBlogCategories()}?search=title:${searchText}&select=title,description`;
	try {
		const response = await fetcher({ endPoint, method: "GET" });
		if (response.statusCode <= 300) {
			setCategories(response.data);
		}
	} catch (e) {
		notification.error({ message: "Failed to fetch Categories" });
	}
	setFetching(false);
};

const debouncedFetchCategories = debounce(fetchCategories, 300);

const BlogMetaPanel: React.FC<AuthorPlatformProps> = ({ state, dispatch }) => {
	const [imageConsoleVisible, setImageConsoleVisible] = useState<boolean>(false);
	const [categories, setCategories] = useState<Category[]>([]);
	const [fetching, setFetching] = useState<boolean>(false);
	const Router = useRouter();

	useEffect(() => {
		fetchCategories("", setFetching, setCategories);
		return (): void => {
			setCategories([]);
		};
	}, [state.activeBlogId]);

	const handleChange = (e): void => {
		const {
			target: { name, value },
		} = e;
		dispatch({
			type: AUTHOR_ACTIONS.UPDATE_BLOG_DATA,
			value: {
				activeBlog: {
					[name]: value,
				},
			},
		});
	};

	const role = getCookie(null, cookieNames.userRole);

	const onPublish = async (): Promise<void> => {
		const publish = !(state.activeBlog.status === Status.active);

		const endPoint = publishBlog(state.activeBlog._id);
		const body = role === Role.Author ? { data: { publish: false } } : { data: { publish } };

		const response = await fetcher({ endPoint, method: "PUT", body });
		let notificationResponse = "";
		if (publish) {
			notificationResponse = role === Role.Author ? "Marked as Ready to Publish" : "Published Article";
		} else {
			notificationResponse = role === Role.Author ? "Marked as Draft" : "UnPublished";
		}
		if (response.statusCode <= 300) {
			if (publish) {
				dispatch({
					type: AUTHOR_ACTIONS.UPDATE_BLOG_DATA,
					value: {
						activeBlog: {
							status: Status.active,
							publishDate: new Date().toString(),
						},
					},
				});
			} else {
				dispatch({
					type: AUTHOR_ACTIONS.UPDATE_BLOG_DATA,
					value: {
						activeBlog: {
							status: Status.pending,
							publishDate: null,
						},
					},
				});
			}

			notification.success({ message: notificationResponse });
		} else {
			notification.error({ message: "Action failed", description: response.message });
		}
	};

	const handleSelect = (value, type: "category" | "tags"): void => {
		let valueToSave = value;
		if (type === "category") {
			valueToSave = categories.find(category => {
				return category._id === value;
			});
		}

		dispatch({
			type: AUTHOR_ACTIONS.UPDATE_BLOG_DATA,
			value: {
				[type]: valueToSave,
			},
		});
	};
	const onSaveBlog = async (): Promise<void> => {
		const endPoint = blogApi(state.activeBlogId);
		const method = state.activeBlogId ? "PUT" : "POST";
		try {
			const response = await fetcher({
				endPoint,
				method,
				body: {
					data: state.activeBlog,
				},
			});
			if (response.statusCode <= 300) {
				notification.success({ message: "Saved Article" });
				if (method === "POST") {
					Router.push(
						{
							pathname: "/author",
							query: { ...getQueryObject({ ...state, activeBlogId: response.data._id }) },
						},
						`/author${getQueryString({ ...state, activeBlogId: response.data._id })}`
					);
					if (state.activeKey === getValueSafely(() => response.data.status, Status.inactive)) {
						dispatch({
							type: AUTHOR_ACTIONS.SET_BLOGS_DATA,
							value: {
								...state,
								blogs: [response.data, ...state.blogs],
							},
						});
					}

					return;
				}
			} else {
				notification.error({ message: response.message });
			}
		} catch (e) {
			notification.error({ message: "Error Saving Article" });
		}
	};

	const onSearch = (searchText: string): void => {
		debouncedFetchCategories(searchText, setFetching, setCategories);
	};

	const publishButtonText = useMemo(() => {
		if (state.activeBlog.status === Status.active) {
			return role === Role.Author ? "Mark as Draft" : "UnPublish";
		}
		return role === Role.Author ? "Ready to Publish" : "Publish";
	}, [role, state.activeBlog.publishDate, state.activeBlog.status]);

	const [addingCategoryLoading, setAddingCategoryLoading] = useState<boolean>(false);
	const [addCategoryModalVisible, setAddCategoryModalVisible] = useState<boolean>(false);

	const toggleAddCategoryModal = (): void => {
		setAddCategoryModalVisible(prevState => !prevState);
	};

	const onAddCategoryOk = async (data: AddCategoryModalState): Promise<void> => {
		setAddingCategoryLoading(true);
		const endPoint = createBlogCategoryApi();
		if (data.title.length) {
			try {
				const response = await fetcher({
					endPoint,
					method: "POST",
					body: {
						data,
					},
				});

				if (response.status === "success") {
					notification.success({ message: "Successfully added Category" });
				} else {
					notification.error({ message: "Failed to add Category. Try again" });
				}
			} catch (e) {
				notification.error({ message: "Problem with Internet connectivity" });
			}
		} else {
			notification.error({ message: "Please enter a Title for the category" });
		}
		setAddingCategoryLoading(false);
	};

	return (
		<Row gutter={[0, 12]} style={{ padding: "0 0.5rem 0 0" }}>
			<MaxHeightDiv>
				<Col>
					<Button
						onClick={onSaveBlog}
						disabled={!!state.activeBlog.publishDate || state.activeBlog.status === Status.active}
						type="primary"
						block
					>
						Save Post
					</Button>
				</Col>
				<Col>
					<Collapse defaultActiveKey={[""]}>
						<Panel key="1" header="General">
							<Row gutter={[8, 8]}>
								<Col>
									<Row gutter={[8, 8]}>
										<Col>
											<Text>Title</Text>
										</Col>
										<Col>
											<Input onChange={handleChange} name="title" value={state.activeBlog.title} />
										</Col>
									</Row>
								</Col>
								<Col>
									<Row gutter={[8, 8]}>
										<Col>
											<Text>Description</Text>
										</Col>
										<Col>
											<Input.TextArea
												rows={2}
												onChange={handleChange}
												name="description"
												value={state.activeBlog.description}
											/>
										</Col>
									</Row>
								</Col>
								<Col>
									<Button
										disabled={!state.activeBlog._id}
										type="ghost"
										block
										onClick={(): void => setImageConsoleVisible(true)}
									>
										Manage Image Console
									</Button>
								</Col>
								<Col>
									<Text>Cover Image</Text>
								</Col>
								<Col>
									<Image
										width="100%"
										src={state.activeBlog.coverImgCdn || "v1581080070/admin/productImagePlaceholder.jpg"}
									/>
								</Col>
							</Row>
						</Panel>
						<Panel key="2" header="Categories">
							<Row gutter={[8, 8]}>
								<Col>
									<Row gutter={[8, 8]}>
										<Col>Category</Col>
										<Col>
											<Select
												value={getValueSafely(() => state.activeBlog.category._id, "")}
												style={{ width: "100%" }}
												onSearch={onSearch}
												showSearch
												notFoundContent={
													<Row type="flex" justify="center">
														{fetching ? <Spin spinning /> : "No Category Found"}
													</Row>
												}
												dropdownRender={(menu): React.ReactNode => {
													return (
														<Row gutter={[4, 4]}>
															<Col>{menu}</Col>
															<Col>
																<SilentDivider />
															</Col>
															<Col>
																<Button
																	type="ghost"
																	block
																	onMouseDown={(e): void => e.preventDefault()}
																	onClick={toggleAddCategoryModal}
																>
																	Add Category
																</Button>
															</Col>
														</Row>
													);
												}}
												onSelect={(value): void => handleSelect(value, "category")}
												filterOption={false}
											>
												{categories.map(category => {
													return (
														<Select.Option key={category._id} label={category.title} value={category._id}>
															{category.title}
														</Select.Option>
													);
												})}
											</Select>
										</Col>
									</Row>
								</Col>
								<Col>
									<Row gutter={[8, 8]}>
										<Col>Tag</Col>
										<Col>
											<Select
												open={false}
												maxTagCount={5}
												tokenSeparators={[","]}
												value={state.activeBlog.tags}
												style={{ width: "100%" }}
												mode="tags"
												onChange={(value): void => handleSelect(value, "tags")}
											/>
										</Col>
									</Row>
								</Col>
							</Row>
						</Panel>
						<Panel key="3" header="SEO">
							<Row>
								<Col>
									<Row gutter={[8, 8]}>
										<Col>What&apos;s the post URL?</Col>
										<Col>
											<Input onChange={handleChange} name="slug" value={state.activeBlog.slug} />
										</Col>
									</Row>
								</Col>
							</Row>
						</Panel>
					</Collapse>
				</Col>
				<Col>
					<StyledButton
						disabled={(state.activeBlog.status === Status.active && role === Role.Author) || !state.activeBlogId}
						onClick={onPublish}
						block
						type="danger"
					>
						{publishButtonText}
					</StyledButton>
				</Col>
			</MaxHeightDiv>
			<AddCategoryModal
				visible={addCategoryModalVisible}
				loading={addingCategoryLoading}
				onCancel={toggleAddCategoryModal}
				onOk={onAddCategoryOk}
			/>
			<ImageManagementConsole
				state={state}
				dispatch={dispatch}
				imageConsoleVisible={imageConsoleVisible}
				setImageConsoleVisible={setImageConsoleVisible}
			/>
		</Row>
	);
};

export default React.memo(BlogMetaPanel);
