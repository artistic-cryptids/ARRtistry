import * as React from 'react';
import * as _ from 'lodash';
import ArrItem, { ArrItemType } from './ArrItem';
import CardColumns from 'react-bootstrap/CardColumns';
import { useContractContext } from '../providers/ContractProvider';

const LoadingArrItem: React.FC<{id: number; wrappedARR: Promise<ArrItemType>}> = ({ id, wrappedARR }) => {
  const [arr, setArr] = React.useState<ArrItemType>();

  React.useEffect(() => {
    wrappedARR
      .then((arr) => setArr(arr))
      .catch(console.log);
  }, [wrappedARR]);

  if (!arr) {
    return null;
  }
  return <ArrItem
    id={id}
    arr={arr}
  />;
};

const ArrList: React.FC = () => {
  const { ArrRegistry, RoyaltyDistributor } = useContractContext();
  const [promisedArr, setPromisedArr] = React.useState<Promise<ArrItemType>[]>([]);

  React.useEffect(() => {
    const addDueAmountToARRItem = (promisedArr: Promise<ArrItemType>): Promise<ArrItemType> => (
      promisedArr.then((arr: ArrItemType) => (
        RoyaltyDistributor.methods.calculateARR(arr.price).call()
          .then(parseInt)
          .then(
            (due: number) => {
              if (due === 0) {
                throw Error('Do not display 0 ARR');
              }
              return {
                from: arr.from,
                to: arr.to,
                tokenId: arr.tokenId,
                price: arr.price / 100,
                due: due / 100,
                location: arr.location,
                paid: arr.paid,
              };
            },
          )
      ))
    );

    const loadARRMetadata = (id: number): Promise<ArrItemType> => {
      const meta: Promise<ArrItemType> = ArrRegistry.methods.retrieve(id).call();
      return addDueAmountToARRItem(meta);
    };

    ArrRegistry.methods.totalRecords().call()
      .then((total: string) => _.range(1, parseInt(total) + 1))
      .catch(console.error)
      .then((ids: number[]) => setPromisedArr(ids.map(loadARRMetadata)))
      .catch(console.error);
  }, [ArrRegistry, RoyaltyDistributor]);

  const listItems = promisedArr.map((arr: Promise<ArrItemType>, id: number) =>
    <LoadingArrItem
      id={id}
      key={id}
      wrappedARR={arr}
    />,
  );

  return (
    <CardColumns>{listItems}</CardColumns>
  );
};

export default ArrList;
