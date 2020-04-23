import * as React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import { useWeb3Context } from './Web3Provider';
import { useContractContext } from './ContractProvider';
import { toast } from 'react-toastify';

export interface ArrControl {
  payArr: (arrToast: React.ReactText, arrId: number, arrDue: number) => void;
};

const DEFAULT_ARR_CONTROL = {
  payArr: console.warn,
};

const ArrContext = React.createContext<ArrControl>(DEFAULT_ARR_CONTROL);

export const ArrProvider: React.FC = ({ children }) => {
  const [showArr, setShowArr] = React.useState<boolean>(false);
  const [arrToast, setArrToast] = React.useState<any>(null);
  const [arrId, setArrId] = React.useState<number>(0);
  const [arrDue, setArrDue] = React.useState<number>(0);

  const { web3, accounts } = useWeb3Context();
  const { Eurs, RoyaltyDistributor } = useContractContext();

  const payArr = (arrToast: React.ReactText, arrId: number, arrDue: number): void => {
    setArrToast(arrToast);
    setArrDue(arrDue);
    setArrId(arrId);
    setShowArr(true);
  };

  const takeArr = (): void => {
    console.log(arrDue, arrId, web3.eth.abi.encodeParameter('uint', arrId));
    return Eurs.methods.approveAndCall(
      RoyaltyDistributor.options.address,
      arrDue,
      web3.eth.abi.encodeParameter('uint', arrId),
    )
      .send({ from: accounts[0] })
      .once('transactionHash',
        (hash: any) => {
          toast.update(arrToast, { render: `ARR accepted #${hash}`, type: toast.TYPE.INFO });
          setShowArr(false);
        })
      .once('receipt',
        (_: any) => { toast.update(arrToast, { render: 'ARR recieved', type: toast.TYPE.INFO }); })
      .on('confirmation',
        (confNumber: any, receipt: any) => { console.log(confNumber, receipt); })
      .on('error', (error: any) => {
        console.log(error);
        toast.update(arrToast, { render: 'ARR failed', type: toast.TYPE.ERROR, autoClose: 5000 });
      })
      .then((receipt: any) => {
        toast.update(arrToast, { render: 'ARR Transfer successful', type: toast.TYPE.SUCCESS, autoClose: 5000 });
        console.log('Mined: ', receipt);
      });
  };

  const handleCancel = (): void => {
    setShowArr(false);
  };

  return (
    <ArrContext.Provider value={{ payArr: payArr }}>
      <Modal show={showArr} onHide={handleCancel}>
        <Modal.Body>
          You are required to pay €{arrDue / 100} of ARR.
          You have the option to pay it now using a EURS stable coin.
          If you do not pay now, you will still be required to pay later.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={takeArr}>
            Pay Arr Now
          </Button>
        </Modal.Footer>
      </Modal>
      { children }
    </ArrContext.Provider>
  );
};

export const useArrContext: () => ArrControl = () => React.useContext<ArrControl>(ArrContext);
