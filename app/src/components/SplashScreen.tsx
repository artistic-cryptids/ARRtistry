import * as React from 'react';

import Container from 'react-bootstrap/Container';
import * as styles from './SplashScreen.module.scss';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Background from './SplashScreen.jpg';
import Card from 'react-bootstrap/Card';

interface SplashScreenProps {
  hide?: boolean;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ hide, children }) => {
  const [fade, setFade] = React.useState<boolean>(false);
  React.useEffect(() => {
    setTimeout(() => {
      setFade(true);
    }, 1000);
  }, []);

  const subtitle = (
    <h3>
      A <strong>Decentralised Art Registry</strong> with Automated{' '}
      <strong>Royalty Distribution</strong>
    </h3>
  );
  const style: React.CSSProperties = {
    backgroundImage: `url(${Background})`,
    opacity: fade && hide ? 0 : 1,
    visibility: fade && hide ? 'hidden' : 'visible',
  };
  return (
    <div className={styles.splashScreen} style={style}>
      <div className={styles.splashOverlay}>
        <Container>
          <Row>
            <Col sm={{ span: 8, offset: 2 }}>
              <div className={styles.splashContainer}>
                <Card className={styles.splashCard}>
                  <div className={styles.splashHeader}>
                    <h1>ARRtistry</h1>
                    {subtitle}
                    <p>
                      {children}
                    </p>
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

export default SplashScreen;
