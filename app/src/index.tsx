import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './components/App';

import Governance from './contracts/Governance.json';
import ArtifactApplication from './contracts/ArtifactApplication.json';
import ArtifactRegistry from './contracts/ArtifactRegistry.json';
import Artists from './contracts/Artists.json';

import './theme.scss';

// eslint-disable-next-line
const Web3 = require('web3');
// eslint-disable-next-line
const contract = require('@truffle/contract');

const doDapp = async (): Promise<void> => {
  const web3 = new Web3(Web3.givenProvider || 'ws://127.0.0.1:8545');
  const provider = web3.currentProvider;
  const governanceNonDeployed = contract(Governance);
  const artifactApplicationNonDeployed = contract(ArtifactApplication);
  const artifactRegistryNonDeployed = contract(ArtifactRegistry);
  const artistsNonDeployed = contract(Artists);
  governanceNonDeployed.setProvider(provider);
  artifactApplicationNonDeployed.setProvider(provider);
  artifactRegistryNonDeployed.setProvider(provider);
  artistsNonDeployed.setProvider(provider);
  const governance = await governanceNonDeployed.deployed();
  const artifactApplication = await artifactApplicationNonDeployed.deployed();
  const artifactRegistry = await artifactRegistryNonDeployed.deployed();
  const artists = await artistsNonDeployed.deployed();

  const contracts = {
    Governance: governance,
    ArtifactApplication: artifactApplication,
    ArtifactRegistry: artifactRegistry,
    Artists: artists,
  };
  const accounts = await web3.eth.getAccounts();
  console.log(accounts[0]);

  ReactDOM.render(
    <App web3={ web3 } contracts={ contracts } accounts={ accounts }/>,
    document.getElementById('root'),
  );
};

doDapp();
