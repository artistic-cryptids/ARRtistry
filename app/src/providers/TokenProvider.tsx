import * as React from 'react';
import * as _ from 'lodash';
import { useContractContext } from '../providers/ContractProvider';
import { BURN_ACCOUNT } from '../helper/eth';

interface TokenContextProps {
  validTokenIds: number[];
}

const DEFAULT_TOKEN_CONTEXT = {
  validTokenIds: [],
};

const TokenContext = React.createContext<TokenContextProps>(DEFAULT_TOKEN_CONTEXT);

export const TokenProvider: React.FC = ({ children }) => {
  const [validTokenIds, setValidTokenIds] = React.useState<number[]>([]);
  const { ArtifactRegistry } = useContractContext();

  React.useEffect(() => {
    if (ArtifactRegistry) {
      Promise.all(
        [ArtifactRegistry.methods.getCurrentTokenId()
          .call()
          .then((tokenId: any) => {
            console.log('number of tokens:' + tokenId);
            return parseInt(tokenId);
          })
          .catch((err: string) => console.error('TokenProvider::useEffect:', err)),
        ArtifactRegistry.methods.getTokenIdsOfOwner(BURN_ACCOUNT).call()
          .then((tokenIds: number[]) => {
            return tokenIds.map(x => +x);
          })
          .catch((err: string) => console.error('TokenProvider::useEffect:', err))],
      ).then((results) => {
        const totalTokens: number = results[0];
        const burntTokens: number[] = results[1];
        console.log('Burnt: ', burntTokens);
        const tokenList = _.range(1, totalTokens + 1);
        setValidTokenIds(tokenList.filter(id => !burntTokens.includes(id)));
      }).catch((err: string) => console.error('TokenProvider::useEffect:', err));
    }
  }, [ArtifactRegistry]);

  return (
    <TokenContext.Provider value={{ validTokenIds: validTokenIds }}>
      { children }
    </TokenContext.Provider>
  );
};

export const useTokenContext: () => TokenContextProps = () => React.useContext<TokenContextProps>(TokenContext);
