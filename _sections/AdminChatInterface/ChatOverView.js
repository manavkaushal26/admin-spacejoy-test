import ChatPanel from "@sections/AdminChatInterface";
import { Tabs } from "antd";
import React from "react";

const ChatWrapper = ({ projectId, designs }) => {
	return (
		<Tabs>
			<Tabs.TabPane tab='General'>
				<ChatPanel projectId={projectId} designID={null} />
			</Tabs.TabPane>
			{designs.map(designItem => {
				const {
					design: { name, id },
				} = designItem;

				return (
					<>
						<Tabs.TabPane tab={name} key={id}>
							<ChatPanel projectId={projectId} designID={id} />
						</Tabs.TabPane>
					</>
				);
			})}
		</Tabs>
	);
};

export default ChatWrapper;