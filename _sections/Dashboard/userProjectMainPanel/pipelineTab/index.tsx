import React from 'react'
import { Typography } from 'antd'
import { CustomDiv } from '@sections/Dashboard/styled';
import styled from 'styled-components';

const {Title, Text} = Typography;

const StepsContainer = styled(CustomDiv)`
    > * + * {
        margin-top: 0.5em;
    }
    
    > *:last-child {
        margin-bottom: 0.5em
    }
`;

const ShadowDiv = styled.div`
    box-shadow: 0px 2px 16px #999BA81F;
`;

export default function index() {
    return (
        <div>
            <Title level={2}>Task Overview</Title>
            <StepsContainer>
            <ShadowDiv>
                <CustomDiv px='0.5em' py='0.5em'>
                    
                </CustomDiv>>
            </ShadowDiv>
            <ShadowDiv>
                Hello
            </ShadowDiv>
            </StepsContainer>
        </div>
    )
}
