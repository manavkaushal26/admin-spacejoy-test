import { MaxHeightDiv } from "@sections/Dashboard/styled";
import { Editor } from "@tinymce/tinymce-react";
import { page } from "@utils/config";
import { useRouter } from "next/router";
import React from "react";
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
				apiKey={page.tinyMceApiKey}
				init={{
					menubar: "file edit insert view format table tools help",
					toolbar:
						" undo redo | pagebreak | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
					menu: {
						file: { title: "File", items: "customnewdocument print preview" },
					},
					height: "100%",
					setup: (editor): void => {
						editor.ui.registry.addMenuItem("customnewdocument", {
							text: "New Document",
							icon: "document-properties",
							onAction: (): void => {
								dispatch({ type: AUTHOR_ACTIONS.NEW_BLOG, value: { activeBlog: {} } });

								Router.push(
									{
										pathname: "/author",
										query: { ...getQueryObject({ ...state, activeBlogId: "" }) },
									},
									`/author${getQueryString({ ...state, activeBlogId: "" })}`
								);
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
