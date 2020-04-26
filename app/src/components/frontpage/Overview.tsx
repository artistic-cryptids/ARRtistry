import * as React from 'react';
import * as styles from './Info.module.scss';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

import Paper from './whitepaper.png';

const Overview: React.FC = () => {
  const title = (
    <h2>
      <strong>Overview</strong>
    </h2>
  );

  const content = (
    <p>
      There is nothing else like ARRtistry.
      It is the first to integrate Artist Resale Right,
      a legally required royalty throughout the EU, to a decentralised registry,
      backed by Arweave.
      All automated with smart contracts in a trust-free way.
      We turn a process that galleries told us “feels a VAT Return you have to do 4 times”,
      into something that provides value
    </p>
  );

  const style: React.CSSProperties = {
    backgroundColor: `white`,
    color: 'black',
    opacity: 1,
    visibility: 'visible',
  };

  return (
    <div className={styles.screen} style={style}>
      <Container>
        <Row>
          <Col>
            <img src={Paper} alt="Whitepaper"/>
          </Col>
          <Col>
            <div className={styles.container}>
              <Card className={styles.card}>
                <div className={styles.header} style={style}>
                  {title}
                  {content}
                </div>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Overview;
