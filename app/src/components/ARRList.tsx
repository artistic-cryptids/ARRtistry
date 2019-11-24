import * as React from 'react';
import ARRItem from './ARRItem';
import CardColumns from 'react-bootstrap/CardColumns';
import { useContractContext } from '../providers/ContractProvider';

const ARRList: React.FC = () => {
  const [ids, setIds] = React.useState<string[]>();

  const { Governance } = useContractContext();

  React.useEffect(() => {
    const loadARRs = async (): Promise<void> => {
      const len = await Governance.methods.getARRLength().call();

      const ids = [];
      for (let i = 0; i < len; i++) {
        ids.push(i.toString());
      }

      setIds(ids);
    };
    loadARRs();
  }, [Governance]);

  if (!ids) {
    return null;
  }

  const listItems = ids.map((id: any) =>
    <ARRItem
      id={id}
      key={id}
    />,
  );

  return (
    <CardColumns>{listItems}</CardColumns>
  );
};

export default ARRList;
