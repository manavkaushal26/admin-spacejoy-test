import ChatPanel from "@sections/AdminChatInterface";
import { Tabs } from "antd";
import React, { useState } from "react";

const ChatWrapper = ({ projectId, designs, chatdid }) => {
	const [activeKey, setActiveKey] = useState(chatdid || projectId);
	return (
		<Tabs activeKey={activeKey} onChange={setActiveKey}>
			<Tabs.TabPane tab='General' key={projectId}>
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
