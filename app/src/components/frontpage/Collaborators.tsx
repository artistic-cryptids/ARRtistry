import * as React from 'react';
import * as styles from './Info.module.scss';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

import Dacs from './dacs.png';
import Imperial from './imperial.png';

const Collaborators: React.FC = () => {
  const title = (
    <h2>
      <strong>Who we worked with</strong>
    </h2>
  );

  const content = (
    <>
      <p>
        We didn't build this alone! We worked with real industry professionals,
        both in the Art Market and the Cryptocurrency industry.
      </p>

      <p>
        <ul>
          <li>The Design and Artist Copyright Society</li>
          <li>Imperial College London Center for Cryptocurrency</li>
          <li>Sandblocks Consulting</li>
          <li>The Flowers Gallery</li>
          <li>Nichola Theakston</li>
        </ul>
      </p>

      <p>
        Without the help from above, we wouldn't of been able to build what we did
      </p>
    </>
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
            <Row>
              <img src={Dacs} alt="DACS"/>
            </Row>
            <Row>
              <img src={Imperial} alt="Imperial"/>
            </Row>
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

export default Collaborators;
