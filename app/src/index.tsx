import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './components/App';
import Web3 from 'web3';
import Governance from './contracts/Governance.json';
import ArtifactApplication from './contracts/ArtifactApplication.json';
import ArtifactRegistry from './contracts/ArtifactRegistry.json';
import Artists from './contracts/Artists.json';
import ENSRegistry from './contracts/ENSRegistry.json';
import ENSResolver from './contracts/ENSResolver.json';
import { getABIAndAddress } from './helper/eth';

import './theme.scss';

// eslint-disable-next-line
const contract = require('@truffle/contract');
// eslint-disable-next-line
const Fortmatic = require('fortmatic');
// eslint-disable-next-line
const namehash = require('eth-ens-namehash');

async function retrieveWeb3 (): Promise<Web3 | undefined> {
  const { ethereum } = window as any;
  if (ethereum) {
    try {
      const web3 = new Web3(ethereum);
      const selectedAccount = await ethereum.enable();
      if (!selectedAccount) {
        console.warn('User opted out');
      } else {
        console.log('user gave access!');
      }
      return web3;
    } catch (error) {
      console.error(error);
    }
  }
};

async function fortmaticWeb3 (): Promise<Web3 | undefined> {
  const fm = new Fortmatic('pk_test_F667BF6D086F45B9');
  return new Web3(fm.getProvider());
};

const addressFromName = (name: string, networkId: number, web3: any): Promise<string> => {
  const { abi, address } = getABIAndAddress(
    networkId,
    ENSRegistry as any,
    '0xe7410170f87102df0055eb195163a03b7f2bff4a',
  );

  const ens = new web3.eth.Contract(abi, address);

  const hash = namehash.hash(name);
  return ens.methods.resolver(hash).call()
    .then((resolverAddr: string) => {
      return {
        abi: (ENSResolver as any).abi,
        addr: resolverAddr,
      };
    })
    .then(({ abi, addr }: any) => new web3.eth.Contract(abi, addr))
    .then((resolver: any) => resolver.methods.addr(hash).call())
    .catch((err: any) => {
      console.log(err);
      return '';
    });
};

const doDapp = async (): Promise<void> => {
  console.log("Attempting to use injected web3");
  let web3 = await retrieveWeb3();

  if (!web3) {
    console.log("Attempting to use fortmatic web3");
    web3 = await fortmaticWeb3();
  }

  if (!web3) {
    console.log("Attempts to grab web3 have failed");
    return;
  }

  const networkId = await web3.eth.net.getId();
  const provider = web3.currentProvider;

  const governanceAddr = await addressFromName('governance.artistry.test', networkId, web3);
  const applicationAddr = await addressFromName('application.artistry.test', networkId, web3);
  const registryAddr = await addressFromName('registry.artistry.test', networkId, web3);
  const artistsAddr = await addressFromName('artists.artistry.test', networkId, web3);

  const governance = new web3.eth.Contract(Governance.abi, governanceAddr);
  const artifactApplication = new web3.eth.Contract(ArtifactApplication.abi, applicationAddr);
  const artifactRegistry = new web3.eth.Contract(ArtifactRegistry.abi, registryAddr);
  const artists = new web3.eth.Contract(Artists.abi, artistsAddr);

  const contracts = {
    Governance: governance,
    ArtifactApplication: artifactApplication,
    ArtifactRegistry: artifactRegistry,
    Artists: artists,
  };
  const accounts = await web3.eth.getAccounts();
  console.log(accounts[0]);

  ReactDOM.render(
    <App web3={web3} networkId={networkId} contracts={contracts} accounts={accounts}/>,
    document.getElementById('root'),
  );
};

doDapp();
