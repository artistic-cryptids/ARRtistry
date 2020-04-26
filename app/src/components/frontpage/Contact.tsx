import * as React from 'react';
import * as styles from './Info.module.scss';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

const Provenance: React.FC = () => {
  const title = (
    <h2>
      <strong>Get in Touch!</strong>
    </h2>
  );

  const content = (
    <>
      <p>
        We can't wait to do more
      </p>

      <p>
        If you have any queries or questions
      </p>

      <p>
        Or just want to get in touch
      </p>

      <p>
        Please do!
      </p>

      <p>
        daniel@hails.info
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

export default Provenance;
