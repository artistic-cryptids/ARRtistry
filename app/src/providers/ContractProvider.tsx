import * as React from 'react';
import Loading from '../components/common/Loading';
import { useNameServiceContext } from './NameServiceProvider';
import { useWeb3Context } from './Web3Provider';

import Governance from '../contracts/Governance.json';
import ArtifactApplication from '../contracts/ArtifactApplication.json';
import ArtifactRegistry from '../contracts/ArtifactRegistry.json';
import Artists from '../contracts/Artists.json';

import { ContractListType } from '../helper/contracts';

interface ContractInterface {
  contracts: ContractListType;
}

const ContractContext = React.createContext<ContractInterface>({} as any);

export const ContractProvider: React.FC = ({ children }) => {
  const [contracts, setContracts] = React.useState<ContractListType | undefined>(undefined);
  const { addressFromName } = useNameServiceContext();
  const { web3 } = useWeb3Context();

  React.useEffect(() => {
    async function getContracts (): Promise<void> {
      const governanceAddr = await addressFromName('governance.artistry.test');
      const applicationAddr = await addressFromName('application.artistry.test');
      const registryAddr = await addressFromName('registry.artistry.test');
      const artistsAddr = await addressFromName('artists.artistry.test');

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

      console.log('Setting contracts');
      setContracts(contracts);
    };
    getContracts();
  }, [addressFromName, web3.eth.Contract]);

  if (!contracts) {
    return <Loading/>;
  }

  console.log('Contracts provided');

  return (
    <ContractContext.Provider value={{ contracts: contracts }}>
      { children }
    </ContractContext.Provider>
  );
};

export const useContractContext: () => ContractInterface = () => React.useContext<ContractInterface>(ContractContext);
