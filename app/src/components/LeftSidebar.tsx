import * as React from 'react';
import Sidebar from 'react-sidebar';
import { Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStamp, faFingerprint, faColumns, faIdBadge, faClone } from '@fortawesome/free-solid-svg-icons'
import * as styles from './LeftSidebar.module.scss';


interface LeftSidebarProps {
  children: React.ReactNode;
}

class LeftSidebar extends React.Component<LeftSidebarProps, {}> {
  private renderNavMenu (): React.ReactNode {
    return (
      <Container className={"col-md-2 d-none d-md-block " + styles.sidebar}>
        <Row className={styles.brand}>
          <div className={styles.brandLogo}>
            <Link to="/">
              ARRtistry
            </Link>
          </div>
          <div className={styles.brandTools}>
            <Button className={styles.brandToggle}><span></span></Button>
          </div>
        </Row>
        <hr/>
        <Nav className={'flex-column ' + styles.sidebarSticky} as={Col}>
          <h4 className={styles.section}>Dashboards</h4>
          <Nav.Item className={styles.navItem}>
              <Nav.Link active={true} to="/" as={Link} bsPrefix={'nav-link ' + styles.navLink}>
                <FontAwesomeIcon icon={faColumns} /> Home
              </Nav.Link>
          </Nav.Item>
          <h4 className={styles.section}>Artifacts</h4>
          <Nav.Item className={styles.navItem}>
              <Nav.Link to="/new" as={Link} bsPrefix={'nav-link ' + styles.navLink}>
                <FontAwesomeIcon icon={faFingerprint} /> New
              </Nav.Link>
          </Nav.Item>
          <Nav.Item className={styles.navItem}>
              <Nav.Link to="/artifacts" as={Link} bsPrefix={'nav-link ' + styles.navLink}>
                <FontAwesomeIcon icon={faClone} /> Owned
              </Nav.Link>
          </Nav.Item>
          <h4 className={styles.section}>Management</h4>
          <Nav.Item className={styles.navItem}>
              <Nav.Link to="/governance" as={Link} bsPrefix={'nav-link ' + styles.navLink}>
                <FontAwesomeIcon icon={faStamp} /> Requests
              </Nav.Link>
          </Nav.Item>
          <Nav.Item className={styles.navItem}>
              <Nav.Link to="/clientArtifacts" as={Link} bsPrefix={'nav-link ' + styles.navLink}>
                <FontAwesomeIcon icon={faIdBadge} /> Clients
              </Nav.Link>
          </Nav.Item>
        </Nav>
      </Container>
    );
  }

  render (): React.ReactNode {
    return (
      <Container fluid>
        <Row>
          {this.renderNavMenu()}
          <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4">
            {this.props.children}
          </main>
        </Row>
      </Container>
    );
  }
}

export default LeftSidebar;
