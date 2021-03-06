import * as React from 'react';

import Container from 'react-bootstrap/Container';
import * as styles from './SplashScreen.module.scss';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Background from './SplashScreen.jpg';
import Card from 'react-bootstrap/Card';
import Loading from './common/Loading';

interface SplashScreenProps {
  failed?: boolean;
  hide?: true;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ failed, hide, children }) => {
  const [fade, setFade] = React.useState<boolean>(false);
  React.useEffect(() => {
    if (hide) {
      const fadeTimeout = setTimeout(() => {
        setFade(true);
      }, 1000);
      return () => clearTimeout(fadeTimeout);
    }
  }, [hide]);

  const subtitle = (
    <h3>
      A <strong>Decentralised Art Registry</strong> with Automated{' '}
      <strong>Royalty Distribution</strong>
    </h3>
  );
  const style: React.CSSProperties = {
    backgroundImage: `url(${Background})`,
    opacity: fade ? 0 : 1,
    visibility: fade ? 'hidden' : 'visible',
  };
  return (
    <div className={styles.splashScreen} style={style}>
      <div className={styles.splashOverlay}>
        <Container>
          <Row>
            <Col xs={12} lg={{ span: 8, offset: 2 }}>
              <div className={styles.splashContainer}>
                <Card className={styles.splashCard}>
                  <div className={styles.splashHeader}>
                    <h1>ARRtistry</h1>
                    {subtitle}
                    {!failed && <Loading />}
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
