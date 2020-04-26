import * as React from 'react';
import * as styles from './Info.module.scss';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

const Provenance: React.FC = () => {
  const title = (
    <h2>
      <strong>ERC721 Token Standard</strong>
    </h2>
  );

  const content = (
    <>
      <p>
        Each piece of art is stored in the ethereum blockchain as an ERC721 token.
      </p>

      <p>
        We have methodically followed this standard when implementing our token.
      </p>

      <p>
        Because of this, we don't have to use our platform to work with our tokens!
      </p>

      <p>
        Check out opensea for an example!
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
