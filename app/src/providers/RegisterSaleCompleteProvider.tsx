import * as React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useContractContext } from '../providers/ContractProvider';
import { useArrContext } from '../providers/ArrProvider';
import { toast } from 'react-toastify';
import { promisify } from 'util';

export interface RegisterSaleComplete {
  showRegisterSaleCompleteForm: (takesArr: boolean, receipt: any, salePrice: number) => void;
};

const DEFAULT_REGISTER_SALE_COMPLETE = {
  showRegisterSaleCompleteForm: console.warn,
};

const RegisterSaleCompleteContext = React.createContext<RegisterSaleComplete>(DEFAULT_REGISTER_SALE_COMPLETE);

export const RegisterSaleCompleteProvider: React.FC = ({ children }) => {
  const { RoyaltyDistributor } = useContractContext();
  const { payArr } = useArrContext();

  const [showRegisterSaleSuccessfulForm, setShowRegisterSaleSuccessfulForm] = React.useState<boolean>(false);
  const [takesArr, setTakesArr] = React.useState<boolean>(false);
  const [salePrice, setSalePrice] = React.useState<number>(0);
  const [receipt, setReceipt] = React.useState<any>(null);

  const handleShow = (takesArr: boolean, receipt: any, salePrice: number): void => {
    setTakesArr(takesArr);
    setReceipt(receipt);
    setSalePrice(salePrice);
    setShowRegisterSaleSuccessfulForm(true);
  };

  const handleOk = (): void => {
    setShowRegisterSaleSuccessfulForm(false);
    if (takesArr) {
      const arrToast = toast('ARR Pending', { autoClose: false });
      const arrId = receipt.events.RecordARR.returnValues.arrId;
      const arrDue = promisify(async (callback) => {
        const arrDue: number = await RoyaltyDistributor.methods.calculateARR(salePrice).call();
        toast.update(arrToast, { render: `ARR due €${arrDue / 100}`, type: toast.TYPE.INFO });
        callback(null, arrDue);
      })() as Promise<number>;

      Promise.all([arrId, arrDue])
        .then(([arrId, arrDue]) => {
          console.log('Let\'s go');
          payArr(arrToast, arrId, arrDue);
        })
        .catch(console.error);
    }
  };

  return (
    <RegisterSaleCompleteContext.Provider value={{ showRegisterSaleCompleteForm: handleShow }}>
      <Modal
        show={showRegisterSaleSuccessfulForm}
        onHide={handleOk}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Registering Sale Successful</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          You have successfully registered a sale.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleOk}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
      { children }
    </RegisterSaleCompleteContext.Provider>
  );
};

export const useRegisterSaleCompleteContext: () => RegisterSaleComplete = () =>
  React.useContext<RegisterSaleComplete>(RegisterSaleCompleteContext);
