import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './components/App';
import * as serviceWorker from './serviceWorker';

import Governance from './contracts/Governance.json';
import ArtifactApplication from './contracts/ArtifactApplication.json';
import ArtifactRegistry from './contracts/ArtifactRegistry.json';
import Artists from './contracts/Artists.json';

import './theme.scss';
import Web3 from 'web3';

// eslint-disable-next-line
const contract = require('@truffle/contract');

const doDapp = async (): Promise<void> => {
  console.log('beabadoobeeeee');

  const web3 = new Web3('ws://127.0.0.1:8545');
  // const web3 = new Web3(Web3.givenProvider || 'ws://127.0.0.1:8545');
  const provider = web3.currentProvider;
  const governanceNonDeployed = contract(Governance);
  const artifactApplicationNonDeployed = contract(ArtifactApplication);
  const artifactRegistryNonDeployed = contract(ArtifactRegistry);
  const artistsNonDeployed = contract(Artists);
  governanceNonDeployed.setProvider(provider);
  artifactApplicationNonDeployed.setProvider(provider);
  artifactRegistryNonDeployed.setProvider(provider);
  artistsNonDeployed.setProvider(provider);
  const gov = await governanceNonDeployed.deployed();
  const artiApp = await artifactApplicationNonDeployed.deployed();
  const artiReg = await artifactRegistryNonDeployed.deployed();
  const artists = await artistsNonDeployed.deployed();

  const contracts = {
    Governance: gov,
    ArtifactApplication: artiApp,
    ArtifactRegistry: artiReg,
    Artists: artists,
  };
  const accounts = await web3.eth.getAccounts();

  ReactDOM.render(
    <App web3={ web3 } contracts={ contracts } accounts={ accounts }/>,
    document.getElementById('root'),
  );
};

doDapp();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
