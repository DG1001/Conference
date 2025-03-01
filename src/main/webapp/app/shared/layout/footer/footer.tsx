import './footer.scss';

import React from 'react';

import { Col, Row } from 'reactstrap';

const Footer = () => (
  <div className="footer page-content">
    <Row>
      <Col md="12">
        <p>Dies ist Ihre Fußzeile</p>
      </Col>
    </Row>
  </div>
);

export default Footer;
