import { Blog } from "@customTypes/blogTypes";
import { getTimeSince, getValueSafely } from "@utils/commonUtils";
import { Card, Col, Row, Tag, Typography } from "antd";
import React from "react";
import styled, { css, FlattenInterpolation, ThemeProps } from "styled-components";
import { getBlogTagColor, getBlogTextColor } from "../utils";

const { Text, Paragraph } = Typography;

interface BlogListCard {
	blog: Partial<Blog>;
	onCardClick: (blogId: string) => void;
	activeBlogId: string;
}

const StyledCard = styled(Card)<{ active: boolean }>`
	background: transparent;
	.ant-card-body {
		padding: 1rem 1rem !important;
	}
	${({ active }): FlattenInterpolation<ThemeProps<string>> =>
		active &&
		css`
			background: ${({ theme }): string => theme.colors.dark};
			border-right: 3px solid ${({ theme }): string => theme.colors.antblue};
			box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
			:hover {
				border-right: 5px solid ${({ theme }): string => theme.colors.blue};
			}
		`};
	:hover {
		background: ${({ theme }): string => theme.colors.dark};
	}
`;

const BlogListCard: React.FC<BlogListCard> = ({ blog, onCardClick, activeBlogId }) => {
	return (
		<StyledCard
			key={blog._id}
			onClick={(): void => onCardClick(blog._id)}
			active={blog._id === activeBlogId}
			bordered={false}
			hoverable
		>
			<Row gutter={[4, 4]}>
				<Col span={24}>
					<Row justify='space-between'>
						<Col>
							<Text type='secondary'>{getValueSafely(() => blog.category.title, "No Category")}</Text>
						</Col>
						<Col>
							<Text type='secondary'>{getTimeSince(blog.publishDate || blog.createdAt)}</Text>
						</Col>
					</Row>
				</Col>
				<Col span={24}>
					<Text strong>{blog.title}</Text>
				</Col>
				<Col span={24}>
					<Paragraph style={{ width: "100%" }} ellipsis={{ rows: 3 }}>
						{blog.excerpt}
					</Paragraph>
				</Col>
				<Col span={24}>
					<Text disabled>Author: {getValueSafely(() => blog.author.profile.firstName, "N/A")}</Text>
				</Col>
				<Col span={24}>
					<Tag color={getBlogTagColor(blog.status)}>{getBlogTextColor(blog.status)}</Tag>
				</Col>
			</Row>
		</StyledCard>
	);
};

export default React.memo(BlogListCard);
