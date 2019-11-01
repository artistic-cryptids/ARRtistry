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
      <div>
        <b className='p-4 m-4'>ARRtistry</b>
        <Nav defaultActiveKey="/" className="flex-column">
          <Link to="/">Home</Link>
          <Link to="/artifacts">Artifacts</Link>
          <Link to="/new">New</Link>
          <Link to="/governance">Governance</Link>
          <Link to="/clientArtifacts">Client Artifacts</Link>
        </Nav>
      </div>
    );
  }

  render (): React.ReactNode {
    return (
      <Sidebar
        sidebar={this.renderNavMenu()}
        docked={true}
        transitions={false}
        shadow={true}
        styles={{ sidebar: { background: 'white' } }}
      >
        {this.props.children}
      </Sidebar>
    );
  }
}

export default LeftSidebar;
