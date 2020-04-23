import * as React from 'react';
import * as _ from 'lodash';
import ArrItem, { ArrItemType } from './ArrItem';
import { ProgressCard, StatisticCard } from './StatisticCard';
import CardColumns from 'react-bootstrap/CardColumns';
import { useContractContext } from '../providers/ContractProvider';
import Row from 'react-bootstrap/Row';

interface Reflected<T> {
  status: string;
  value?: T;
  reason?: any;
}

function reflect<T> (promise: Promise<T>): Promise<Reflected<T>> {
  return promise.then(
    (v) => {
      return { status: 'fulfilled', value: v };
    },
    (error) => {
      return { status: 'rejected', reason: error };
    },
  );
}

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
  const [arrTotal, setArrTotal] = React.useState<number>(0);
  const [paidArr, setPaidArr] = React.useState<number>(0);
  const [total, setTotal] = React.useState<number>(0);

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

  React.useEffect(() => {
    const fufilledArrs = Promise.all(promisedArr.map(reflect))
      .then((reflects) => reflects.filter(p => p.status === 'fulfilled'))
      .then((fufilled) => fufilled.map(p => p.value as ArrItemType));

    fufilledArrs
      .then((arrs: ArrItemType[]) => _.sumBy(arrs, (arr) => arr.price))
      .catch(console.error)
      .then((sum) => setTotal(sum || 0))
      .catch(console.error);

    fufilledArrs
      .then((arrs: ArrItemType[]) => _.sumBy(arrs, (arr) => arr.due || 0))
      .catch(console.error)
      .then((sum) => setArrTotal(sum || 0))
      .catch(console.error);

    fufilledArrs
      .then((arrs: ArrItemType[]) => _.filter(arrs, (arr) => arr.paid))
      .then((arrs: ArrItemType[]) => _.sumBy(arrs, (arr) => arr.due || 0))
      .then((sum) => setPaidArr(sum))
      .catch(console.error);
  }, [promisedArr]);

  const listItems = promisedArr.map((arr: Promise<ArrItemType>, id: number) =>
    <LoadingArrItem
      id={id}
      key={id}
      wrappedARR={arr}
    />,
  );

  const statisticGroup = (
    <Row>
      <StatisticCard title="Total Sales" value={total} prefix="&euro;" icon="swatchbook" />
      <StatisticCard title="Due ARR" value={arrTotal - paidArr} icon="euro-sign" theme="danger"/>
      <StatisticCard title="Paid ARR" value={paidArr} icon="euro-sign" theme="success"/>
      <ProgressCard title="Paid Ratio" progress={paidArr / arrTotal || 0} icon="clipboard-list" theme="warning"/>
    </Row>
  );

  return (
    <>
      {statisticGroup}
      <CardColumns>{listItems}</CardColumns>
    </>
  );
};

export default ArrList;
