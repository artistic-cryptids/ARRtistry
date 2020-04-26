import * as React from 'react';
import * as styles from './Info.module.scss';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

const Arr: React.FC = () => {
  const title = (
    <h2>
      <strong>Artist Resale Rights</strong>
    </h2>
  );

  const content = (
    <>
      <p>
        Did you know, when a piece of art is resold, the original artist could be owed
        resale commision? This is called artist resale rights.
      </p>

      <p>
        Every year, millions of ARR goes unpaid
      </p>

      <p>
        Our system not only helps governing authorities to track who owes ARR and how much,
        But also allows the seller of the art to pay that ARR immediate through a EURS stable coin.
      </p>

      <p>
        This way we help millions of artists collect millions of £££ that they rightfully deserve
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

export default Arr;
