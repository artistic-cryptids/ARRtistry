import * as React from 'react';
import * as styles from './Info.module.scss';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

const Us: React.FC = () => {
  const title = (
    <h2>
      <strong>Who are we?</strong>
    </h2>
  );

  const content = (
    <>
      <p>
        We are a group of Computer Scientists at Imperial College London.
      </p>

      <p>
        <ul>
          <li>Daniel Hails (daniel.hails17@imperial.ac.uk)</li>
          <li>James Dalboth (jd4917@ic.ac.uk)</li>
          <li>Matthew Ho (matthew.ho17@ic.ac.uk)</li>
          <li>Neil Sayers (neil.sayers17@imperial.ac.uk)</li>
          <li>Harry Black (harry.black17@imperial.ac.uk)</li>
          <li>Matthew Malarkey (matthew.malarkey17@imperial.ac.uk)</li>
        </ul>
      </p>

      <p>
        Together, we have over 20 years of collective experience and
        we’ve worked on research papers on smart contract programming languages!
      </p>
    </>
  );

  return (
    <div className={styles.screen}>
      <Container>
        <Row>
          <Col sm={{ span: 10, offset: 1 }}>
            <div className={styles.container}>
              <Card className={styles.card}>
                <div className={styles.header}>
                  {title}
                  <hr/>
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

export default Us;
