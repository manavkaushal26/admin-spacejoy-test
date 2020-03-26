import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import { MaxHeightDiv } from "@sections/Dashboard/styled";
import { useRouter } from "next/router";
import { BlogTypes } from "@customTypes/blogTypes";
import { AuthorPlatformProps } from "..";
import { AUTHOR_ACTIONS } from "../reducer";
import { getQueryObject, getQueryString } from "../utils";

const TinyMCEEditor: React.FC<AuthorPlatformProps> = ({ state, dispatch }) => {
	const Router = useRouter();

	const handleEditorChange = (content): void => {
		dispatch({ type: AUTHOR_ACTIONS.BLOG_CONTENT, value: { blogContent: content } });
	};
	return (
		<MaxHeightDiv>
			<Editor
				value={state.activeBlog.body}
				apiKey="nodxa0klye29turh3kyb50oizr3vzfpjakvcb1bfwg6heqrq"
				init={{
					menubar: "file edit insert view format table tools help",
					toolbar:
						" undo redo | pagebreak | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
					menu: {
						file: { title: "File", items: "customnewdocument print preview" },
					},
					height: "100%",
					setup: (editor): void => {
						editor.ui.registry.addNestedMenuItem("customnewdocument", {
							text: "New Document",
							icon: "document-properties",
							getSubmenuItems: () => {
								return [
									{
										type: "menuitem",
										text: "New Short Blog",
										onAction: (): void => {
											dispatch({ type: AUTHOR_ACTIONS.NEW_BLOG, value: { activeBlog: { blogType: BlogTypes.Short } } });

											Router.push(
												{
													pathname: "/author",
													query: { ...getQueryObject({ ...state, activeBlogId: "" }), blogType: BlogTypes.Short },
												},
												`/author${getQueryString({ ...state, activeBlogId: "" })}&blogType=${BlogTypes.Short}`
											);
										},
									},
									{
										type: "menuitem",
										text: "New Long Blog",
										onAction: (): void => {
											dispatch({ type: AUTHOR_ACTIONS.NEW_BLOG, value: { activeBlog: { blogType: BlogTypes.Full } } });
											Router.push(
												{
													pathname: "/author",
													query: { ...getQueryObject({ ...state, activeBlogId: "" }), blogType: BlogTypes.Full },
												},
												`/author${getQueryString({ ...state, activeBlogId: "" })}&blogType=${BlogTypes.Full}`
											);
										},
									},
								];
							},
						});
					},
					plugins: [
						"advlist autolink lists link image charmap print preview anchor pagebreak spellchecker",
						"searchreplace visualblocks code fullscreen",
						"insertdatetime media table paste code help wordcount",
					],
					removed_menuitems: "newdocument",
					object_resizing: true,
					contextmenu: "link image imagetools table spellchecker",
					br_in_pre: false,
				}}
				onEditorChange={handleEditorChange}
			/>
		</MaxHeightDiv>
	);
};

export default React.memo(TinyMCEEditor);
