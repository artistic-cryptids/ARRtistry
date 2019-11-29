import * as React from 'react';
import ArrItem from './ArrItem';
import CardColumns from 'react-bootstrap/CardColumns';
import { useContractContext } from '../providers/ContractProvider';

const ArrList: React.FC = () => {
  const [ids, setIds] = React.useState<string[]>();

  const { ArrRegistry } = useContractContext();

  React.useEffect(() => {
    const loadArrs = async (): Promise<void> => {
      const len = await ArrRegistry.methods.totalRecords().call();

      const ids = [];
      for (let i = 1; i <= len; i++) {
        ids.push(i.toString());
      }

      setIds(ids);
    };
    loadArrs();
  }, [ArrRegistry]);

  if (!ids) {
    return null;
  }

  const listItems = ids.map((id: any) =>
    <ArrItem
      id={id}
      key={id}
    />,
  );

  return (
    <CardColumns>{listItems}</CardColumns>
  );
};

export default ArrList;
