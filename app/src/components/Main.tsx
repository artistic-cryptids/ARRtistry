import * as React from 'react';
import { Container, Navbar, Nav, Dropdown, NavItem, Card } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import { User, useSessionContext } from '../providers/SessionProvider';
import * as styles from './Header.module.scss';
import NavLink from 'react-bootstrap/NavLink';
import LeftSidebar from './LeftSidebar';
import Jazzicon from './common/Jazzicon';

import 'react-toastify/scss/main.scss';
import ENSName from './common/ENSName';

const BreadCrumb: React.FC<{crumbs: string[]}> = ({ crumbs }) => {
  return <div className={styles.breadcrumb}>
    {crumbs.map((value: string, index: number) => {
      return <React.Fragment key={index}>
        <a href="/#" className={styles.link}>{value}</a>
        {index === (crumbs.length - 1) ? null : <span className={styles.separator}></span>}
      </React.Fragment>;
    })}
  </div>;
};

const UserImage: React.FC<{user: User; diameter: number; className?: string}> = ({ user, diameter, className }) => {
  if (user.img) {
    const imgClassName = className ? `rounded-circle ${className}` : 'rounded-circle';
    return <img src={user.img} className={imgClassName} alt='avatar' style={{ width: diameter, height: 'auto' }}/>;
  }

  return <Jazzicon address={user.address[0]} diameter={diameter} className={className} />;
};

const UserCard: React.FC<{user: User}> = ({ user }) => {
  const primary = user.nickname || <ENSName address={user.address[0]} />;
  const secondary = user.role;

  return <Card className={styles.testimonialCard}>
    <div className={styles.blueGradient + ' ' + styles.cardUp}>
    </div>
    <div className={'mx-auto white ' + styles.avatar}>
      <UserImage user={user} diameter={90}/>
    </div>
    <Card.Body>
      <h4 className="font-weight-bold mb-4">{primary} {secondary && <small>{secondary}</small>}</h4>
      { user.nickname && <blockquote className="blockquote text-left">
        <footer className="blockquote-footer">
          <ENSName address={user.address[0]} />
        </footer>
      </blockquote>}
      <h4 className="font-weight-bold mb-4">Balance</h4>
      <blockquote className="blockquote text-left">
        <footer className="blockquote-footer">{user.eth} ETH</footer>
        <footer className="blockquote-footer">{user.eurs} EURS</footer>
      </blockquote>
    </Card.Body>
  </Card>;
};

const UserDropdown: React.FC = () => {
  const { user } = useSessionContext();

  return <Dropdown as={NavItem} alignRight>
    <Dropdown.Toggle as={NavLink} id="nav-dropdown">
      <UserImage user={user} diameter={48} className="d-inline-block align-middle"/>
    </Dropdown.Toggle>
    <Dropdown.Menu className={styles.avatarDropdown}>
      <UserCard user={user}/>
    </Dropdown.Menu>
  </Dropdown>;
};

const Header: React.FC<{page: string; parents: string[]}> = ({ page, parents }) => {
  return (
    <Navbar collapseOnSelect expand="md" className="d-none d-md-flex">
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
    <>
      <LeftSidebar>
        <Header page={page} parents={parents}/>
        <Container fluid >
          {children}
        </Container>
      </LeftSidebar>
      <ToastContainer />
    </>
  );
};

export default Main;
