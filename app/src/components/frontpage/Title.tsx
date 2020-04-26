import * as React from 'react';

import Container from 'react-bootstrap/Container';
import * as styles from './Title.module.scss';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Background from './Title.jpg';
import Card from 'react-bootstrap/Card';

const Title: React.FC = () => {
  const subtitle = (
    <h3>
      A <strong>Decentralised Art Registry</strong> with Automated{' '}
      <strong>Royalty Distribution</strong>
    </h3>
  );
  const style: React.CSSProperties = {
    backgroundImage: `url(${Background})`,
    opacity: 1,
    visibility: 'visible',
  };
  
  return (
    <div className={styles.titleScreen} style={style}>
      <div className={styles.titleOverlay}>
        <Container>
          <Row>
            <Col sm={{ span: 8, offset: 2 }}>
              <div className={styles.titleContainer}>
                <Card className={styles.titleCard}>
                  <div className={styles.titleHeader}>
                    <h1>ARRtistry</h1>
                    {subtitle}
                  </div>
                </Card>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Title;
