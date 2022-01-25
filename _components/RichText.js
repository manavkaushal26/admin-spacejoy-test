import { Editor } from "@tinymce/tinymce-react";
import React from "react";

const RichText = props => {
	const handleEditorChange = e => {
		// eslint-disable-next-line no-console
		// console.log("Content was updated: ", e.target.getContent());
		props.onTextChange(e.target.getContent());
	};

	return (
		<Editor
			initialValue={`${props.initialValue ?? ""}`}
			selector={`${props.id}`}
			init={{
				setup: function (editor) {
					editor.on("change", editor.save);
				},
				height: 250,
				menubar: false,
				plugins: [
					"advlist autolink lists link image",
					"charmap print preview anchor help",
					"searchreplace visualblocks code",
					"insertdatetime media table paste wordcount",
				],
				toolbar:
					"undo redo | formatselect | bold italic | \
					alignleft aligncenter alignright | \
					bullist numlist outdent indent | help",
			}}
			onChange={handleEditorChange}
		/>
	);
};

export default RichText;
