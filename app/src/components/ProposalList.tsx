import * as React from 'react';
import ProposalItem from './ProposalItem';
import CardColumns from 'react-bootstrap/CardColumns';
import { useContractContext } from '../providers/ContractProvider';

interface ProposalListState {
  ids: string[];
}

const ProposalList: React.FC = () => {
  const [ids, setIds] = React.useState<string[]>([]);

  const { Governance } = useContractContext();

  React.useEffect(() => {
    const loadProposals = async (): Promise<void> => {
      const idsAsObjects = await Governance.methods.getProposals().call();
      const ids: string[] = [];
      idsAsObjects.map((val: any) => ids.push(val.toString()));
      setIds(ids);
    };
    console.log('1');
    loadProposals();
  }, [Governance]);

  const listItems = ids.map((id: any) =>
    <ProposalItem
      id={id}
      key={id}
    />,
  );

  return (
    <CardColumns>{listItems}</CardColumns>
  );
};

export default ProposalList;
