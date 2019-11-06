import React from 'react';
import { Container, Navbar, Nav, Dropdown, NavItem, Card } from 'react-bootstrap';

import * as styles from './Header.module.scss';
import NavLink from 'react-bootstrap/NavLink';

const BreadCrumb: React.FC<{crumbs: string[]}> = ({ crumbs }) => {
  return <div className={styles.breadcrumb}>
    {crumbs.map((value: string, index: number) => {
      return <>
        <a href="#!" className={styles.link}>{value}</a>
        {index === (crumbs.length - 1) ? null : <span className={styles.separator}></span>}
      </>;
    })}
  </div>;
};

interface User {
  img: string;
  name: string;
  role: string;
}

const UserCard: React.FC<{user: User}> = ({ user }) => {
  return <Card className={styles.testimonialCard}>
    <div className={styles.blueGradient + ' ' + styles.cardUp}>
    </div>
    <div className={'mx-auto white ' + styles.avatar}>
      <img src={user.img} className="rounded-circle img-fluid" alt='avatar'/>
    </div>
    <Card.Body>
      <h4 className="font-weight-bold mb-4">{user.name} <small>{user.role}</small></h4>
      <hr/>
    </Card.Body>
  </Card>;
};

const UserDropdown: React.FC<{user: User}> = ({ user }) => {
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
          <UserDropdown user={{
            name: 'Anna Doe',
            img: 'https://mdbootstrap.com/img/Photos/Avatars/img%20%2820%29.jpg',
            role: 'DACS',
          }}/>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

const Main: React.FC<{page: string; parents: string[]}> = ({ page, parents, children }) => {
  return (
    <>
      <Header page={page} parents={parents}/>
      <Container>
        {children}
      </Container>
    </>
  );
};

export default Main;
