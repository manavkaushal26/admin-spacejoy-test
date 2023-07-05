import { DownloadOutlined } from "@ant-design/icons";
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
    const [loading, setLoading] = useState<boolean>(false);

    const handleDownload = () => {
        const [startDate, endDate] = [moment(value[0]).format(dateFormat), moment(value[1]).format(dateFormat)]
        const url = `https://report-wise-o4kexohprq-uc.a.run.app/csv/montly-signup-vs-order?startDate=${startDate}&endDate=${endDate}`;
        setLoading(true);
        axios.get(url, {
            responseType: 'blob'
        }).then((response) => {
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(
                new Blob([response.data])
            );
            link.setAttribute('download', `montly-signup-vs-order-${Date.now()}.csv`);
            document.body.appendChild(link);
            link.click();
        }).finally(() => {
            setLoading(false);
        })
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
                            <Button style={{ marginLeft: '2px' }} icon={<DownloadOutlined />} onClick={handleDownload} loading={loading}>{loading ? "Downloading" : "Download"}</Button>
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