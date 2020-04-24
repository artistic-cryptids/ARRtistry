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
import { useSessionContext, User } from '../providers/SessionProvider';

const NavItem: React.FC<{name: string; icon: IconDefinition; path: string}> = ({ name, icon, path }) => {
  return (
    <Nav.Item className={styles.navItem}>
      <Nav.Link to={path} as={Link} bsPrefix={'nav-link ' + styles.navLink}>
        <FontAwesomeIcon icon={icon} /> {name}
      </Nav.Link>
    </Nav.Item>
  );
};

const NavMenu: React.FC<{user: User}> = ({ user }) => {
  const manager = user.role === 'GOVERNING' || user.role === 'DEAL';
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
        <NavItem name='Home' icon={faColumns} path='/'/>
        <h4 className={styles.section}>Artifacts</h4>
        <NavItem name='New' icon={faFingerprint} path='/artifact/new'/>
        <NavItem name='Owned' icon={faClone} path='/artifact'/>
        <NavItem name='Sold' icon={faEuroSign} path='/artifact/sold'/>
        {manager && <h4 className={styles.section}>Management</h4>}
        {user.role === 'GOVERNING' && <NavItem name='Artifact Requests' icon={faStamp} path='/manage/proposal'/>}
        {user.role === 'GOVERNING' && <NavItem name='ARR' icon={faEuroSign} path='/manage/arr'/>}
        {user.role === 'DEAL' && <NavItem name='Clients' icon={faIdCardAlt} path='/client/all/artifact'/>}
        <h4 className={styles.section}>Artists</h4>
        <NavItem name='New' icon={faPalette} path='/artist/new'/>
      </Nav>
    </Col>
  );
};

const LeftSidebar: React.FC = ({ children }) => {
  const { user } = useSessionContext();
  return (
    <Container fluid>
      <Row>
        <NavMenu user={user}/>
        <Col md={{ span: 10, offset: 2 }} className="pl-4 pt-4">
          { children }
        </Col>
      </Row>
    </Container>
  );
};

export default LeftSidebar;
