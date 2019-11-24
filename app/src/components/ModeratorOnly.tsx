import * as React from 'react';
import Container from 'react-bootstrap/Container';
import { useContractContext } from '../providers/ContractProvider';
import { useWeb3Context } from '../providers/Web3Provider';

const Governance: React.FC = ({ children }) => {
  const [isGovernor, setIsGovernor] = React.useState<boolean>(false);
  const { Governance } = useContractContext();
  const { accounts } = useWeb3Context();

  React.useEffect(() => {
    Governance.methods.isGovernor(accounts[0])
      .call()
      .then((isGovernor: any) => setIsGovernor(isGovernor))
      .catch(console.log);
  }, [Governance, accounts]);

  if (isGovernor) {
    return (
      <Container>
        { children }
      </Container>
    );
  }

  return (
    <Container>
      <h1>You are not an approved moderator</h1>
    </Container>
  );
};

export default Governance;
