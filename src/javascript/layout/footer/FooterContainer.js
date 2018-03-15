import React from 'react';

import { Card, Flex } from 'antd-mobile';

class FooterContainer extends React.Component {

    render() {
        return (
            <div className="footer-container">
                <Flex>
                    <Flex.Item className="main-help">
                        <Card>
                            <Card.Body>
                                <p>윙크 학부모님 공감센터 <a href="tel:1522-1244">1522-1244</a></p>
                                <p>월-금요일 10:00~20:00</p>
                            </Card.Body>
                        </Card>
                    </Flex.Item>
                </Flex>
            </div>
        );
    }
}

export default FooterContainer;
