import * as React from 'react';
import Title from './Title';
import Overview from './Overview';
import Us from './Us';
import Collaborators from './Collaborators';
import Provenance from './Provenance';
import Arr from './Arr';
import External from './External';
import Recognition from './Recognition';
import Contact from './Contact';
import { Link } from 'react-router-dom';

// @ts-ignore
import ReactPageScroller from "react-page-scroller";

const FrontPage: React.FC = () => {
  return (
    <>
      <ReactPageScroller>
        <Title/>
        <Overview/>
        <Us/>
        <Collaborators/>
        <Provenance/>
        <Arr/>
        <External/>
        <Recognition/>
        <Contact/>
      </ReactPageScroller>
      <Link to="/">
        ARRtistry
      </Link>
    </>
  )
};

export default FrontPage;
