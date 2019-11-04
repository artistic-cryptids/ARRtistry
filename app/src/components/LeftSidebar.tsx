import * as React from 'react';
import Sidebar from 'react-sidebar';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

interface LeftSidebarProps {
  children: React.ReactNode;
}

class LeftSidebar extends React.Component<LeftSidebarProps, {}> {
  private renderNavMenu (): React.ReactNode {
    return (
      <Nav defaultActiveKey="/" className="flex-column">
        <Link className="page-link" to="/">Home</Link>
        <Link className="page-link" to="/new">New</Link>
        <Link className="page-link" to="/artifacts">Artifacts</Link>
        <Link className="page-link" to="/governance">Governance</Link>
        <Link className="page-link" to="/clientArtifacts">Client Artifacts</Link>
      </Nav>
    );
  }

  render (): React.ReactNode {
    return (
      <Sidebar
        sidebar={this.renderNavMenu()}
        docked={true}
        transitions={false}
        shadow={false}
        styles={{ sidebar: { background: '#242424' } }}
      >
        {this.props.children}
      </Sidebar>
    );
  }
}

export default LeftSidebar;
