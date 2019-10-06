import Link from "next/link";
import React from "react";
import styled from "styled-components";
import SVGIcon from "../SVGIcon";

const BreadCrumbStyled = styled.div`
	border-top: 1px solid ${({ theme }) => theme.colors.bg.light2};
	padding: 1rem 0;
	ul {
		margin: 0;
		padding: 0;
		li {
			margin: 0;
			list-style: none;
			display: inline-block;
			font-size: 0.8rem;
			&:last-child {
				&:after {
					content: "";
				}
			}
			&:after {
				content: "/";
				padding: 0 0.5rem;
			}
			a {
				color: ${({ theme }) => theme.colors.fc.dark1};
				&:hover {
					color: ${({ theme }) => theme.colors.primary1};
				}
			}
		}
	}
`;

export default function index() {
	return (
		<div className="container">
			<div className="grid">
				<div className="col-12 col-bleed-y">
					<BreadCrumbStyled>
						<ul>
							<li>
								<Link href={{ pathname: "/", query: {} }} as="/">
									<a>
										<SVGIcon name="logo" height={15} width={14} />
									</a>
								</Link>
							</li>
							<li>
								<Link href={{ pathname: "/designMySpace", query: {} }} as="/designMySpace">
									<a>Design My Space</a>
								</Link>
							</li>
							<li>
								<Link
									href={{ pathname: "/designMySpace", query: { quiz: "start", plan: "free" } }}
									as="/designMySpace?quiz=start"
								>
									<a>Quiz</a>
								</Link>
							</li>
							<li>Which room are you designing</li>
						</ul>
					</BreadCrumbStyled>
				</div>
			</div>
		</div>
	);
}
