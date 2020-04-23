import * as React from 'react';
import * as _ from 'lodash';

import SplashScreen from '../components/SplashScreen';
import { useNameServiceContext } from './NameServiceProvider';
import { useWeb3Context } from './Web3Provider';

import Governance from '../contracts/Governance.json';
import ArtifactApplication from '../contracts/ArtifactApplication.json';
import ArtifactRegistry from '../contracts/ArtifactRegistry.json';
import Artists from '../contracts/Artists.json';
import Consignment from '../contracts/Consignment.json';
import ARRRegistry from '../contracts/ARRRegistry.json';
import RoyaltyDistributor from '../contracts/RoyaltyDistributor.json';
import ERC20Eurs from '../contracts/ERC20Eurs.json';

import { ContractListType } from '../helper/contracts';

const DOMAIN_ROOT = 'artistry.test';

const ContractContext = React.createContext<ContractListType>({} as any);

export const ContractProvider: React.FC = ({ children }) => {
  const [loaded, setLoaded] = React.useState<boolean>(false);
  const [contracts, setContracts] = React.useState<ContractListType>();
  const { addressFromName } = useNameServiceContext();
  const { web3 } = useWeb3Context();

  React.useEffect(() => {
    if (loaded) {
      return;
    }

    const getContract = (ensName: string, abi: any): Promise<any> => {
      return addressFromName(ensName)
        .then((addr) => { console.log(`Translated ${ensName} to ${addr}`); return addr; })
        .then((addr) => new web3.eth.Contract(abi, addr))
        .catch(console.error);
    };

    Promise.all([
      getContract(`governance.${DOMAIN_ROOT}`, Governance.abi),
      getContract(`application.${DOMAIN_ROOT}`, ArtifactApplication.abi),
      getContract(`registry.${DOMAIN_ROOT}`, ArtifactRegistry.abi),
      getContract(`artists.${DOMAIN_ROOT}`, Artists.abi),
      getContract(`consignment.${DOMAIN_ROOT}`, Consignment.abi),
      getContract(`arr.${DOMAIN_ROOT}`, ARRRegistry.abi),
      getContract(`royalty.${DOMAIN_ROOT}`, RoyaltyDistributor.abi),
      getContract(`eurs.${DOMAIN_ROOT}`, ERC20Eurs.abi),
    ])
      .then((contracts) => {
        setContracts({
          Governance: contracts[0],
          ArtifactApplication: contracts[1],
          ArtifactRegistry: contracts[2],
          Artists: contracts[3],
          Consignment: contracts[4],
          ArrRegistry: contracts[5],
          RoyaltyDistributor: contracts[6],
          Eurs: contracts[7],
        });
        setLoaded(true);
      })
      .catch(console.warn);
  }, [addressFromName, web3.eth.Contract, loaded]);

  if (!loaded || !contracts || !_.every(contracts)) {
    const reason = !loaded
      ? 'Connecting to latest ARRtistry smart contracts...'
      : 'Cannot connect to ARRtistry smart contracts. Are you on Rinkeby?';
    return <SplashScreen failed={loaded} >
      {reason}
    </SplashScreen>;
  }

  return (
    <ContractContext.Provider value={contracts}>
      { children }
    </ContractContext.Provider>
  );
};

export const useContractContext: () => ContractListType = () => React.useContext<ContractListType>(ContractContext);
