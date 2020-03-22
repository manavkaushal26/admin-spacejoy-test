import { SilentDivider } from "@sections/Dashboard/styled";
import { Col, Row } from "antd";
import React from "react";
import BlogLeftPanel from "./BlogLeftPanel";
import BlogMetaPanel from "./BlogMetaPanel";
import { AuthorActionType, AuthorState } from "./reducer";
import TinyMCEEditor from "./TinyMCEEditor";
import TopBar from "./TopBar";

export interface AuthorPlatformProps {
	state: AuthorState;
	dispatch: React.Dispatch<AuthorActionType>;
}

const AuthorPlatform: React.FC<AuthorPlatformProps> = ({ state, dispatch }) => {
	return (
		<Row gutter={[8, 8]}>
			<Col span={24}>
				<TopBar state={state} dispatch={dispatch} />
			</Col>
			<Col span={24}>
				<SilentDivider />
			</Col>
			<Col span={5}>
				<BlogLeftPanel state={state} dispatch={dispatch} />
			</Col>
			<Col span={14}>
				<TinyMCEEditor state={state} dispatch={dispatch} />
			</Col>
			<Col span={5}>
				<BlogMetaPanel state={state} dispatch={dispatch} />
			</Col>
		</Row>
	);
};

export default React.memo(AuthorPlatform);
