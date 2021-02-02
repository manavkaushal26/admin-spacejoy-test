import fetcher from "@utils/fetcher";
import { Button, Input } from "antd";
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
		const payload = {
			file: e.target.files[0],
		};
		try {
			const resData = await fetcher({ endPoint: "/v1/seoKeywords", method: "POST", body: payload });
			const { data, statusCode } = resData;
			if (statusCode && statusCode <= 201) {
				return data;
			} else {
				throw new Error();
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
