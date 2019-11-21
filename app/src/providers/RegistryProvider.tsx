import * as React from 'react';
import * as Contracts from '../helper/contracts';
import ArtifactRegistry from '../contracts/ArtifactRegistry.json';
import { useWeb3Context } from './Web3Provider';
import { getABIAndAddress } from '../helper/eth';

export const RegistryContext = React.createContext<Contracts.ArtifactRegistry>(undefined);

export const RegistryProvider: React.FC = ({ children }) => {
  const [registry, setRegistry] = React.useState<Contracts.ArtifactRegistry>();
  const { web3, networkId } = useWeb3Context();

  React.useEffect(() => {
    const { abi, address } = getABIAndAddress(
      networkId,
      ArtifactRegistry as any,
      '0x0000000000000000000000000000000000000000',
    );
    const registry = new web3.eth.Contract(abi, address);
    setRegistry(registry);
  }, [networkId, web3]);

  return (
    <RegistryContext.Provider value={registry}>
      { children }
    </RegistryContext.Provider>
  );
};

export const useRegistryContext: () => Contracts.ArtifactRegistry =
  () => React.useContext<Contracts.ArtifactRegistry>(RegistryContext);
