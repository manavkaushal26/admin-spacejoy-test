import { blogApi, createBlogCategoryApi, getBlogCategories, publishBlog, slugCheckApi } from "@api/blogApi";
import Image from "@components/Image";
import { BlogTypes, Category } from "@customTypes/blogTypes";
import { Role, Status } from "@customTypes/userType";
import { MaxHeightDiv, SilentDivider } from "@sections/Dashboard/styled";
import { debounce, getValueSafely } from "@utils/commonUtils";
import { cookieNames } from "@utils/config";
import fetcher from "@utils/fetcher";
import getCookie from "@utils/getCookie";
import { Button, Col, Collapse, Input, notification, Row, Select, Spin, Typography } from "antd";
import hotkeys from "hotkeys-js";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { AuthorPlatformProps } from "..";
import { AuthorActionType, AuthorState, AUTHOR_ACTIONS } from "../reducer";
import { getQueryObject, getQueryString } from "../utils";
import AddCategoryModal, { AddCategoryModalState } from "./AddCategoryModal";
import ImageManagementConsole from "./ImageManagementConsole";

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

const onSaveBlog = async (
	state: AuthorState,
	dispatch: React.Dispatch<AuthorActionType>,
	Router,
	setLoading: React.Dispatch<React.SetStateAction<boolean>>
): Promise<void> => {
	setLoading(true);
	const endPoint = blogApi(state.activeBlogId);
	const method = state.activeBlogId ? "PUT" : "POST";

	const renderBody =
		state.activeBlog.blogType === BlogTypes.Short
			? state.activeBlog.body.split("<!-- pagebreak -->")
			: [state.activeBlog.body];
	if (method === "PUT") {
		const slugEndpoint = slugCheckApi(state.activeBlog.slug);
		try {
			const slugCheck = await fetcher({ endPoint: slugEndpoint, method: "GET" });
			if (!slugCheck.data.canCreate) {
				if (slugCheck.data.article._id !== state.activeBlog._id) {
					notification.warn({ message: "Blog link is already used" });
					setLoading(false);
					return;
				}
			}
		} catch (e) {
			notification.error({ message: "Couldn't check if Blog link is valid." });
			setLoading(false);
			return;
		}
	}
	if (state.activeBlog.title === "New Blog") {
		notification.warning({ message: "Please change the title" });
	} else {
		try {
			const response = await fetcher({
				endPoint,
				method,
				body: {
					data: { ...state.activeBlog, renderBody },
				},
			});
			if (response.status === "success") {
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
				}
			} else {
				notification.error({ message: response.message });
			}
		} catch (e) {
			notification.error({ message: "Error Saving Article" });
		}
	}
	setLoading(false);
};

const debouncedSaveBlog = debounce(onSaveBlog, 2000);

const BlogMetaPanel: React.FC<AuthorPlatformProps> = ({ state, dispatch }) => {
	const [imageConsoleVisible, setImageConsoleVisible] = useState<boolean>(false);
	const [categories, setCategories] = useState<Category[]>([]);
	const [fetching, setFetching] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);

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

	const [activeKey, setActiveKey] = useState<string | string[]>([]);

	const titleRef = useRef(null);

	useEffect(() => {
		if (state.activeBlog.title === "New Blog") {
			if (titleRef.current) {
				setActiveKey(["1"]);
				titleRef.current.focus();
			}
		}
	}, [state.activeBlog.title, titleRef.current]);

	const role = getCookie(null, cookieNames.userRole);
	const [firstLoad, setFirstLoad] = useState(true);
	useEffect(() => {
		if (!firstLoad && !loading) {
			if (state.activeBlog.status !== Status.active) debouncedSaveBlog(state, dispatch, Router, setLoading);
		} else {
			setFirstLoad(false);
			hotkeys("ctrl+s, command+s", event => {
				event.stopPropagation();
				event.preventDefault();
				onSaveBlog(state, dispatch, Router, setLoading);
			});
		}
		return (): void => {
			hotkeys.unbind("ctrl+s, command+s");
		};
	}, [state.activeBlog]);

	const onPublish = async (): Promise<void> => {
		const publish = !(state.activeBlog.status === Status.active) && Role.BlogAuthor !== role;

		const endPoint = publishBlog(state.activeBlog._id);
		const body = role === Role.BlogAuthor ? { data: { publish: false } } : { data: { publish } };

		const response = await fetcher({ endPoint, method: "PUT", body });
		let notificationResponse = "";
		if (publish) {
			notificationResponse = role === Role.BlogAuthor ? "Marked as Ready to Publish" : "Published Article";
		} else {
			notificationResponse = role === Role.BlogAuthor ? "Marked as Draft" : "Unpublished";
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
				dispatch({
					type: AUTHOR_ACTIONS.ACTIVE_KEY,
					value: {
						activeKey: Status.active,
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
				dispatch({
					type: AUTHOR_ACTIONS.ACTIVE_KEY,
					value: {
						activeKey: Status.pending,
					},
				});
			}
			notification.success({ message: notificationResponse });
		} else {
			notification.error({ message: "Action failed", description: response.message });
		}
	};

	const saveBlogButtonClicked = (): void => {
		onSaveBlog(state, dispatch, Router, setLoading);
	};

	const handleSelect = (value, type: "category" | "tags" | "blogType"): void => {
		let valueToSave = value;
		if (type === "category") {
			valueToSave = categories.find(category => {
				return category._id === value;
			});
		}

		dispatch({
			type: AUTHOR_ACTIONS.UPDATE_BLOG_DATA,
			value: {
				activeBlog: {
					[type]: valueToSave,
				},
			},
		});
	};

	const onSearch = (searchText: string): void => {
		debouncedFetchCategories(searchText, setFetching, setCategories);
	};

	const publishButtonText = useMemo(() => {
		if (role === Role.BlogAuthor) {
			return state.activeBlog.status === Status.active ? "Mark as draft" : "Ready to publish";
		}

		return state.activeBlog.status === Status.active ? "Unpublish" : "Publish";
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
		<MaxHeightDiv>
			<Row gutter={[0, 12]} style={{ padding: "0 0.5rem 0 0" }}>
				<Col span={24}>
					<Button
						onClick={saveBlogButtonClicked}
						disabled={!!state.activeBlog.publishDate || state.activeBlog.status === Status.active}
						type='primary'
						loading={loading}
						block
					>
						Save Blog
					</Button>
				</Col>
				<Col span={24}>
					<Collapse onChange={(key): void => setActiveKey(key)} activeKey={activeKey}>
						<Panel key='1' header='General'>
							<Row gutter={[8, 8]}>
								<Col span={24}>
									<Row gutter={[8, 8]}>
										<Col span={24}>
											<Text>Title</Text>
										</Col>
										<Col span={24}>
											<Input ref={titleRef} onChange={handleChange} name='title' value={state.activeBlog.title} />
										</Col>
									</Row>
								</Col>
								<Col span={24}>
									<Row gutter={[8, 8]}>
										<Col span={214}>
											<Text>Description</Text>
										</Col>
										<Col span={24}>
											<Input.TextArea
												rows={2}
												onChange={handleChange}
												name='description'
												value={state.activeBlog.description}
											/>
										</Col>
									</Row>
								</Col>
								<Col span={24}>
									<Row gutter={[8, 8]}>
										<Col span={24}>
											<Text>Blog Type</Text>
										</Col>
										<Col span={24}>
											<Select
												style={{ width: "100%" }}
												onChange={(value): void => handleSelect(value, "blogType")}
												value={state.activeBlog.blogType}
											>
												{Object.keys(BlogTypes).map(key => {
													return (
														<Select.Option value={BlogTypes[key]} key={key}>
															{key}
														</Select.Option>
													);
												})}
											</Select>
										</Col>
									</Row>
								</Col>
								<Col span={24}>
									<Button
										disabled={!state.activeBlog._id}
										type='ghost'
										block
										onClick={(): void => setImageConsoleVisible(true)}
									>
										Manage Image Console
									</Button>
								</Col>
								<Col span={24}>
									<Text>Cover Image</Text>
								</Col>
								<Col span={24}>
									<Image
										width='100%'
										src={`w_300,c_pad,ar_1/${
											state.activeBlog.coverImgCdn || "v1581080070/admin/productImagePlaceholder.jpg"
										}`}
									/>
								</Col>
							</Row>
						</Panel>
						<Panel key='2' header='Categories'>
							<Row gutter={[8, 8]}>
								<Col span={24}>
									<Row gutter={[8, 8]}>
										<Col span={24}>Category</Col>
										<Col span={24}>
											<Select
												value={getValueSafely(() => state.activeBlog.category._id, "")}
												style={{ width: "100%" }}
												onSearch={onSearch}
												showSearch
												notFoundContent={
													<Row justify='center'>{fetching ? <Spin spinning /> : "No Category Found"}</Row>
												}
												dropdownRender={(menu): JSX.Element => {
													return (
														<Row gutter={[4, 4]}>
															<Col>{menu}</Col>
															<Col>
																<SilentDivider />
															</Col>
															<Col>
																<Button
																	type='ghost'
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
								<Col span={24}>
									<Row gutter={[8, 8]}>
										<Col span={24}>Tags</Col>
										<Col span={24}>
											<Select
												open={false}
												maxTagCount={5}
												tokenSeparators={[","]}
												value={state.activeBlog.tags}
												style={{ width: "100%" }}
												mode='tags'
												onChange={(value): void => handleSelect(value, "tags")}
											/>
										</Col>
									</Row>
								</Col>
							</Row>
						</Panel>
						<Panel key='3' header='SEO'>
							<Row>
								<Col span={24}>
									<Row gutter={[8, 8]}>
										<Col span={24}>Meta Title</Col>
										<Col span={24}>
											<Input onChange={handleChange} name='metaTitle' value={state.activeBlog.metaTitle} />
										</Col>
									</Row>
								</Col>
								<Col span={24}>
									<Row gutter={[8, 8]}>
										<Col span={24}>Meta Description</Col>
										<Col span={24}>
											<Input onChange={handleChange} name='metaDescription' value={state.activeBlog.metaDescription} />
										</Col>
									</Row>
								</Col>
								<Col span={24}>
									<Row gutter={[8, 8]}>
										<Col span={24}>What&apos;s the blog URL?</Col>
										<Col span={24}>
											<Input onChange={handleChange} name='slug' value={state.activeBlog.slug} />
										</Col>
									</Row>
								</Col>
							</Row>
						</Panel>
					</Collapse>
				</Col>
				<Col span={24}>
					<StyledButton
						disabled={(state.activeBlog.status === Status.active && role === Role.BlogAuthor) || !state.activeBlogId}
						onClick={onPublish}
						block
						type='primary'
						danger
						loading={loading}
					>
						{publishButtonText}
					</StyledButton>
				</Col>
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
		</MaxHeightDiv>
	);
};

export default React.memo(BlogMetaPanel);
