import * as React from 'react';
import { AbiItem } from 'web3-utils';

import Loading from '../components/common/Loading';
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

const ContractContext = React.createContext<ContractListType>({} as any);

export const ContractProvider: React.FC = ({ children }) => {
  const [contracts, setContracts] = React.useState<ContractListType>();
  const { addressFromName } = useNameServiceContext();
  const { web3 } = useWeb3Context();

  React.useEffect(() => {
    async function getContracts (): Promise<void> {
      const governanceAddr = await addressFromName('governance.artistry.test');
      const applicationAddr = await addressFromName('application.artistry.test');
      const registryAddr = await addressFromName('registry.artistry.test');
      const artistsAddr = await addressFromName('artists.artistry.test');
      const consignmentAddr = await addressFromName('consignment.artistry.test');
      const arrAddr = await addressFromName('arr.artistry.test');
      const royaltyAddr = await addressFromName('royalty.artistry.test');
      const eursAddr = await addressFromName('eurs.artistry.test');

      const governance = new web3.eth.Contract(Governance.abi, governanceAddr);
      const artifactApplication = new web3.eth.Contract(ArtifactApplication.abi, applicationAddr);
      const artifactRegistry = new web3.eth.Contract(ArtifactRegistry.abi, registryAddr);
      const artists = new web3.eth.Contract(Artists.abi, artistsAddr);
      const consignment = new web3.eth.Contract(Consignment.abi, consignmentAddr);
      const arr = new web3.eth.Contract(ARRRegistry.abi, arrAddr);
      const royalty = new web3.eth.Contract(RoyaltyDistributor.abi, royaltyAddr);
      const eurs = new web3.eth.Contract(ERC20Eurs.abi as AbiItem[], eursAddr);

      console.log('Contracts provided:', {
        governance: governanceAddr,
        application: applicationAddr,
        registry: registryAddr,
        artists: artistsAddr,
        consignment: consignmentAddr,
        arr: arrAddr,
        eurs: eursAddr,
        royalty: royaltyAddr,
      });

      const contracts = {
        Governance: governance,
        ArtifactApplication: artifactApplication,
        ArtifactRegistry: artifactRegistry,
        Artists: artists,
        Consignment: consignment,
        ArrRegistry: arr,
        Eurs: eurs,
        RoyaltyDistributor: royalty,
      };

      setContracts(contracts);
    };
    getContracts();
  }, [addressFromName, web3.eth.Contract]);

  if (!contracts) {
    return <Loading/>;
  }

  return (
    <ContractContext.Provider value={contracts}>
      { children }
    </ContractContext.Provider>
  );
};

export const useContractContext: () => ContractListType = () => React.useContext<ContractListType>(ContractContext);
