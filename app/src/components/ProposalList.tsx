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
    const updateProposals = async (): Promise<void> => {
      const idsAsObjects = await Governance.methods.getProposals().call();
      const ids: string[] = [];
      idsAsObjects.map((val: any) => ids.push(val.toString()));
      setIds(ids);
    };

    updateProposals();

    const proposeSubscription = Governance.events.Propose()
      .on('data', (_: any) => {
        updateProposals();
      });

    const approveSubscription = Governance.events.Approve()
      .on('data', (_: any) => {
        updateProposals();
      });

    const rejectSubscription = Governance.events.Reject()
      .on('data', (_: any) => {
        updateProposals();
      });

    return () => {
      // Unsubscribe when this component is unmounted
      proposeSubscription.unsubscribe();
      approveSubscription.unsubscribe();
      rejectSubscription.unsubscribe();
    };
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
