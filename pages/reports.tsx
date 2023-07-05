import PageLayout from "@sections/Layout";
import { ProtectRoute } from "@utils/authContext";
import { company } from "@utils/config";
import IndexPageMeta from "@utils/meta";
import { Button, Col, DatePicker, Row } from "antd";
import axios from "axios";
import moment from "moment";
import { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import styled from "styled-components";

const { RangePicker } = DatePicker;

const dateFormat = 'MM-DD-YYYY';

const Reports: NextPage = () => {
    const [value, setValue] = useState<any>([moment().add(15, "days"), moment()])

    const handleDownload = () => {
        const [startDate, endDate] = [moment(value[0]).format(dateFormat), moment(value[1]).format(dateFormat)]
        const url = `https://report-wise-o4kexohprq-uc.a.run.app/csv/montly-signup-vs-order?startDate=${startDate}&endDate=${endDate}`;
        axios.get(url, {
            // If you forget this, your download will be corrupt.
            responseType: 'blob'
        }).then((response) => {
            // Let's create a link in the document that we'll
            // programmatically 'click'.
            const link = document.createElement('a');

            // Tell the browser to associate the response data to
            // the URL of the link we created above.
            link.href = window.URL.createObjectURL(
                new Blob([response.data])
            );

            // Tell the browser to download, not render, the file.
            link.setAttribute('download', `montly-signup-vs-order-${Date.now()}.csv`);

            // Place the link in the DOM.
            document.body.appendChild(link);

            // Make the magic happen!
            link.click();
        });
    }
    return (
        <PageLayout pageName='Reports'>
            <Head>
                <title>Reports | {company.product}</title>
                {IndexPageMeta}
            </Head>
            <GreyMaxHeightDiv>
                <LoudPaddingDiv>
                    <Row gutter={[0, 16]}>
                        <Col span={24}>
                            <RangePicker
                                allowEmpty={[false, false]}
                                defaultValue={value}
                                format={dateFormat}
                                onChange={(dates) => setValue(dates)}
                            />
                            <Button onClick={handleDownload}>Download</Button>
                        </Col>
                        <Col span={24}>
                            <Row gutter={[12, 12]}>
                            </Row>
                        </Col>
                    </Row>
                </LoudPaddingDiv>
            </GreyMaxHeightDiv>
        </PageLayout>
    );
};

export default ProtectRoute(Reports);

const GreyMaxHeightDiv = styled.div``;

const LoudPaddingDiv = styled.div`
	padding: 2rem 1.15rem;
	@media only screen and (max-width: 1200px) {
		padding: 2rem 1.15rem;
	}
	max-width: 1200px;
	margin: auto;
`;