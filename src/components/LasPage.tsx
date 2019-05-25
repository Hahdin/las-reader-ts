import React from 'react';
import { connect } from 'react-redux';
import { LasInputFile } from './LasInputFile'
import { Chart } from './Chart'
import { Section } from './Section'
import {
  Col,
  Row,
  Tabs,
  Tab,
  Container,
} from "react-bootstrap";
import { AppState } from "../store";

const LasPage = ({ ...props }) => {
  return (
    <div>
      <LasInputFile />
      <br/>
      <br/>
      <Container fluid>
        <Row>
          <Col> 
          <Tabs defaultActiveKey={1} id="tab1">
            <Tab eventKey={1}  title={'Well'}>
              <Section
                section={props.files.WELL}
                heading={'Well'}
              />
            </Tab>
              <Tab eventKey={2} title={'Curves'}>
                <Section
                  section={props.files.CURVE_INFORMATION}
                  heading={'Curve Information'}
                />
              </Tab>
              <Tab eventKey={3} title={'Parameters'}>
                <Section
                  section={props.files.PARAMETER_INFORMATION}
                  heading={'Param. Information'}
                />
              </Tab>
          </Tabs>
          </Col>
          <Col><div style={{ backgroundColor: 'white' }}><Chart /></div></Col>
        </Row>
      </Container>

      {/* <Container >
        <Row className="show-grid">
          <Col xs={4} md={4}>
            <div style={{ backgroundColor: 'white' }}>
              Here
              <Tabs defaultActiveKey={1} id="tab1">
              <Tab eventKey={1}  title={'Well'}>
                  <Section
                    section={props.files.WELL}
                    heading={'Well'}
                  />
                </Tab>
                <Tab eventKey={2}  title={'Curves'}>
                  <Section
                    section={props.files.CURVE_INFORMATION}
                    heading={'Curve Information'}
                  />
                </Tab>
                <Tab eventKey={3} title={'Parameters'}>
                  <Section 
                    section={props.files.PARAMETER_INFORMATION}
                    heading={'Param. Information'}
                  />
                </Tab>
              </Tabs>
            </div>
          </Col>
          There
          <Col xs={8} md={8}>
            <div style={{ backgroundColor: 'white' }}><Chart /></div>
          </Col>
        </Row>
      </Container> */}
    </div>
  );
}

function mapStateToProps(state: AppState) {
  return ({
    files: state.files || {},
  })
}

const connected = connect(mapStateToProps)(LasPage);
export { connected as LasPage };