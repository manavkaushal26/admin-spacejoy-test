import { MessageOutlined } from "@ant-design/icons";
import { clearAllNotificationsApi } from "@api/userApi";
import Button from "@components/Button";
import DropMenu from "@components/DropMenu";
import User from "@customTypes/userType";
import { FirestoreDocument } from "@react-firebase/firestore";
import useAuth from "@utils/authContext";
import { firebaseConfig } from "@utils/config";
import { allowedRoles } from "@utils/constants";
import fetcher from "@utils/fetcher";
import { Modal, notification, Typography } from "antd";
import moment from "moment";
import Link from "next/link";
import React, { useState } from "react";
import styled from "styled-components";
import ActiveLink from "./ActiveLink";
import { HorizontalListStyled } from "./styled";

const { Text, Title } = Typography;

interface NavRight {
	authVerification: Partial<User>;
	logout: () => Promise<void>;
}

const NotificationPanel = styled.div`
	background: #e6f7ff11;
	backdrop-filter: blur(5px);
	box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
	position: absolute;
	top: 160%;
	.sticky {
		top: 0;
	}

	right: -20%;
	font-weight: 400;
	width: 300px;
	max-height: 75vh;
	overflow-x: hidden;
	overflow-y: auto;

	padding: 1rem;
	.ellipsis {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	.notification {
		background: #fff;
		box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);

		padding: 0.8rem;

		.title {
			font-weight: bold;
		}
		.time {
			color: #999;
			font-size: 0.6rem;
		}
		> * + * {
			margin-top: 0.2rem;
		}
	}
	a {
		display: block;
		color: rgba(0, 0, 0, 0.85);
	}
	.title-card {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: space-between;

		.clear-btn {
			color: lightcoral;
			font-weight: 200;
			font-size: 0.8rem;
			&:hover {
				text-decoration: underline;
			}
		}
	}
	> * + * {
		margin-top: 1rem;
	}
`;

const NotificationStuff = styled.button`
	border: none;
	background: transparent;
	position: relative;
	cursor: pointer;
	.badge {
		position: absolute;
		pointer-events: none;
		user-select: none;
		top: -6px;
		right: -6px;
		background: #ff4d4f;
		padding: 0.25rem 0.25rem;
		min-width: 18px;
		text-align: center;
		min-height: 8px;
		color: white;
		border-radius: 50%;
		font-size: 0.7rem;
	}
`;

const NavRight: React.FC<NavRight> = ({ authVerification, logout }) => {
	const notificationButtonRef = React.useRef<HTMLButtonElement>(null);
	const [notificationDropdownVisible, setNotificationDropdownVisible] = useState(false);
	const { user } = useAuth();
	const clearNotification = async () => {
		const endPoint = clearAllNotificationsApi();
		const res = await fetcher({ endPoint, method: "GET" });
		if (!(res.statusCode <= 300)) {
			notification.error({ message: "Error clearing notifications", key: "clear-notification" });
		}
	};

	const onClear = () => {
		Modal.confirm({
			title: "Clear all notifications?",
			onOk: clearNotification,
		});
	};

	const toggleNotificationDropdown = e => {
		setNotificationDropdownVisible(!notificationDropdownVisible);
	};

	return (
		<FirestoreDocument path={`/${firebaseConfig.notificationDatabase}/${user?.id}`}>
			{data => {
				const notifications = data?.value?.notifications || [];
				const filteredNotifications = notifications?.filter(notification => notification.type === "newDesignMsg");
				return (
					<nav>
						<HorizontalListStyled align='right'>
							<li>
								<NotificationStuff ref={notificationButtonRef} onClick={toggleNotificationDropdown}>
									<MessageOutlined style={{ fontSize: "1.2rem" }} />
									{filteredNotifications?.length > 0 && <div className='badge'>{filteredNotifications?.length}</div>}
								</NotificationStuff>
								{notificationDropdownVisible && (
									<NotificationPanel>
										<Title level={5} className='sticky title-card'>
											Notification panel {filteredNotifications?.length > 0 && `(${filteredNotifications?.length})`}
											{!(filteredNotifications?.length === 0) && (
												<Button raw className='clear-btn' onClick={onClear}>
													Clear all
												</Button>
											)}
										</Title>
										{filteredNotifications?.length === 0 && (
											<div className='notification'>
												<div className='title'>All caught up</div>
											</div>
										)}
										{filteredNotifications?.map(notification => (
											<Link
												key={`${notification?.time}-${notification?.title}`}
												href={{
													pathname: "/dashboard",
													query: { pid: notification?.meta?.pid, chatdid: notification?.meta?.did },
												}}
												as={`/dashboard/pid/${notification?.meta?.pid}${
													notification?.meta?.did ? `?chatdid=${notification?.meta?.did}` : ""
												}`}
											>
												<a>
													<div className='notification' onClick={toggleNotificationDropdown}>
														<div className='time'>{moment(1631699584192)?.fromNow()}</div>
														<div className='title'>{notification?.title || "New Message"}</div>
													</div>
												</a>
											</Link>
										))}
									</NotificationPanel>
								)}
							</li>
							<li>
								{authVerification && allowedRoles.includes(authVerification.role) ? (
									<DropMenu>
										<DropMenu.Header>
											<ActiveLink href='/dashboard' as='/dashboard'>
												<Text>{authVerification.name}</Text>
											</ActiveLink>
										</DropMenu.Header>
										<DropMenu.Body>
											<Button size='xs' shape='rounded' variant='secondary' fill='ghost' onClick={logout}>
												Logout
											</Button>
										</DropMenu.Body>
									</DropMenu>
								) : (
									<ActiveLink
										href={{ pathname: "/auth", query: { flow: "login", redirectUrl: "/dashboard" } }}
										as='/auth/login?redirectUrl=/dashboard'
										replace
									>
										Login
									</ActiveLink>
								)}
							</li>
						</HorizontalListStyled>
					</nav>
				);
			}}
		</FirestoreDocument>
	);
};

export default NavRight;
