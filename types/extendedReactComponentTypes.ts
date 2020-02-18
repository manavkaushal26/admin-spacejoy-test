import { ComponentClass } from "react";
import { NextPageContext } from "next";

export interface ExtendedJSXElement<T = {}> extends React.Component<T>, React.SFC<T> {
	displayName?: string;
	name?: string;
	getInitialProps?: (NextPageContext) => Record<string, any>;
}

export interface ExtendedJSXFC<T = {}> extends React.FC<T> {
	displayName?: string;
	name?: string;
	getInitialProps?: (NextPageContext) => Record<string, any>;
}

export interface ExtendedComponentClass<T = {}> extends ComponentClass<T> {
	displayName?: string;
	name?: string;
	getInitialProps?: (NextPageContext) => Record<string, any>;
}
