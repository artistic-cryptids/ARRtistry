import * as React from 'react';
import { Container, Navbar, Nav, Dropdown, NavItem, Card } from 'react-bootstrap';
import { User, useSessionContext } from '../providers/SessionProvider';
import * as styles from './Header.module.scss';
import NavLink from 'react-bootstrap/NavLink';
import LeftSidebar from './LeftSidebar';

const BreadCrumb: React.FC<{crumbs: string[]}> = ({ crumbs }) => {
  return <div className={styles.breadcrumb}>
    {crumbs.map((value: string, index: number) => {
      return <React.Fragment key={index}>
        <a href="#!" className={styles.link}>{value}</a>
        {index === (crumbs.length - 1) ? null : <span className={styles.separator}></span>}
      </React.Fragment>;
    })}
  </div>;
};

const UserCard: React.FC<{user: User}> = ({ user }) => {
  return <Card className={styles.testimonialCard}>
    <div className={styles.blueGradient + ' ' + styles.cardUp}>
    </div>
    <div className={'mx-auto white ' + styles.avatar}>
      <img src={user.img} className="rounded-circle img-fluid" alt='avatar'/>
    </div>
    <Card.Body>
      <h4 className="font-weight-bold mb-4">{user.name} <small>{user.role}</small></h4>
      <blockquote className="blockquote text-right">
        <footer className="blockquote-footer">{user.address}</footer>
      </blockquote>
    </Card.Body>
  </Card>;
};

const UserDropdown: React.FC = () => {
  const { user } = useSessionContext();

  return <Dropdown as={NavItem} alignRight>
    <Dropdown.Toggle as={NavLink} id="nav-dropdown">
      <img src={user.img} className="rounded-circle z-depth-0" style={{ 'width': '3rem' }} alt='avatar'/>
    </Dropdown.Toggle>
    <Dropdown.Menu className={styles.avatarDropdown}>
      <UserCard user={user}/>
    </Dropdown.Menu>
  </Dropdown>;
};

const Header: React.FC<{page: string; parents: string[]}> = ({ page, parents }) => {
  return (
    <Navbar collapseOnSelect expand="lg">
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className={'mr-auto ' + styles.header}>
          <div className={styles.subheader}>
            <h3 className={styles.title}>{page}</h3>
          </div>
          <BreadCrumb crumbs={parents.concat([page])}/>
        </Nav>
        <Nav>
          <UserDropdown/>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

const Main: React.FC<{page: string; parents: string[]}> = ({ page, parents, children }) => {
  return (
    <LeftSidebar>
      <Header page={page} parents={parents}/>
      <Container>
        {children}
      </Container>
    </LeftSidebar>
  );
};

export default Main;
