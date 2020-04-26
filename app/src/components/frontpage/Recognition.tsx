import * as React from 'react';
import * as styles from './Info.module.scss';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

const Recognition: React.FC = () => {
  const title = (
    <h2>
      <strong>Recognition</strong>
    </h2>
  );

  const content = (
    <>
      <p>
        Don't just listen to us.
      </p>

      <p>
        Palantir have recognised ARRtistry's work and have awarded us the Palantir Group Project Prize 2019-2020
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
          <Col sm={{ span: 10, offset: 1 }}>
            <div className={styles.container}>
              <Card className={styles.card}>
                <div className={styles.header} style={style}>
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

export default Recognition;
