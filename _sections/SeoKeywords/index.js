import fetcher from "@utils/fetcher";
import { Button, Input, notification } from "antd";
import React from "react";
import styled from "styled-components";
const SeoKeywordWrapper = styled.div`
	button {
		position: relative;
	}
`;

const FileUpload = styled(Input)`
	position: absolute;
	left: 0;
	opacity: 0;
	top: 0;
	width: 100%;
	height: 100%;
	cursor: pointer;
`;

export default function index() {
	const uploadKeywords = async e => {
		try {
			const resData = await fetcher({
				endPoint: "/v1/seoKeywordDesignMappings",
				method: "POST",
				body: {
					file: e.target.files[0],
				},
			});
			const { data, statusCode } = resData;
			if (statusCode && statusCode <= 201) {
				notification.success({ message: "File successfully uploaded" });
			} else {
				notification.error({ message: "Failed to upload file" });
			}
		} catch {
			throw new Error();
		}
	};

	return (
		<SeoKeywordWrapper>
			<Button key='publish' type='primary'>
				Upload SEO keywords
				<FileUpload
					type='file'
					onChange={e => uploadKeywords(e)}
					accept='.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
				/>
			</Button>
		</SeoKeywordWrapper>
	);
}
