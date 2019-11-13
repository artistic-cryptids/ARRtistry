import * as React from 'react';
import { Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStamp,
  faFingerprint,
  faColumns,
  faIdCardAlt,
  faClone,
  faEuroSign,
  faPalette,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import * as styles from './LeftSidebar.module.scss';

interface LeftSidebarProps {
  children: React.ReactNode;
}

class LeftSidebar extends React.Component<LeftSidebarProps, {}> {
  private renderNavItem (name: string, icon: IconDefinition, path: string): React.ReactNode {
    return (
      <Nav.Item className={styles.navItem}>
        <Nav.Link to={path} as={Link} bsPrefix={'nav-link ' + styles.navLink}>
          <FontAwesomeIcon icon={icon} /> {name}
        </Nav.Link>
      </Nav.Item>
    );
  }

  private renderNavMenu (): React.ReactNode {
    return (
      <Col md={2} className={'d-none d-md-block ' + styles.sidebar}>
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
          {this.renderNavItem('Home', faColumns, '/')}
          <h4 className={styles.section}>Artifacts</h4>
          {this.renderNavItem('New', faFingerprint, '/artifact/new')}
          {this.renderNavItem('Owned', faClone, '/artifact')}
          {this.renderNavItem('Sold', faEuroSign, '/artifact/sold')}
          <h4 className={styles.section}>Management</h4>
          {this.renderNavItem('Artifact Requests', faStamp, '/manage/proposal')}
          {this.renderNavItem('ARR', faEuroSign, '/manage/arr')}
          {this.renderNavItem('Clients', faIdCardAlt, '/client/all/artifact')}
          <h4 className={styles.section}>Artists</h4>
          {this.renderNavItem('New', faPalette, '/artist/new')}
        </Nav>
      </Col>
    );
  }

  render (): React.ReactNode {
    return (
      <Container fluid>
        <Row>
          {this.renderNavMenu()}
          <Col md={{ span: 10, offset: 2 }} className="pl-4 pt-4">
            {this.props.children}
          </Col>
        </Row>
      </Container>
    );
  }
}

export default LeftSidebar;
