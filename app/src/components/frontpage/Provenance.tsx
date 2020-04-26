import * as React from 'react';
import * as styles from './Info.module.scss';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

const Provenance: React.FC = () => {
  const title = (
    <h2>
      <strong>Art Provenance</strong>
    </h2>
  );

  const content = (
    <>
      <p>
        Art Provenance is one of the most important aspects of an art piece,
        it helps differentiate the real from the fake.
      </p>

      <p>
        Authentic provenance - the history of a piece -
        the trail of ownership that means you can prove authenticity.
      </p>

      <p>
        Before every sale,
        the provenance of a piece needs to be checked by every potential buyer,
        costing over 250 euro each time. Why? Because there is no one trusted central entity.
      </p>

      <p>
        On our system rich provenance is available immediate, and it's so easy to extend
        the provenance of a piece legally
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
