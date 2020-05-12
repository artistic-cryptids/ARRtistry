import * as React from 'react';
import { toast } from 'react-toastify';
import { promisify } from 'util';
import { EventData } from 'web3-eth-contract';
import moment from 'moment';
import * as AgnosticArtworkRetriever from '../helper/agnostic';

import { useContractContext } from './ContractProvider';
import { useNameServiceContext } from './NameServiceProvider';
import { useWeb3Context } from './Web3Provider';
import { useKeyContext } from './KeyProvider';

import { TransferArtifactFormFields, LOCATIONS } from '../components/TransferArtifact';

import { Transaction, ARRState,
  TransactionStarted, TransactionConfirmation,
  TransactionSuccess, TransactionFailure, TransactionPartial } from '../components/tx';

// eslint-disable-next-line
const ARR_LOCATIONS = ['Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic', 'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary', 'Iceland', 'Ireland', 'Italy', 'Latvia', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Malta', 'Netherlands', 'Norway', 'Poland', 'Portugal', 'Romania', 'Slovak Republic', 'Slovenia', 'Spain', 'Sweden', 'United Kingdom'];

export enum TransferState {
  FormClosed,
  FormOpen,
  AwaitingConfirmation,
  TransactionStarted,
  TransactionPartial,
  TransactionSuccess,
  TransactionFailure
}

interface TransferFunctionProps {
  metaUri: string;
  tokenId: number;
  fields: TransferArtifactFormFields;
}

interface TransferFunction extends Function {
  (props: TransferFunctionProps): void;
}

export interface TransactionProvider {
  handleFieldOpen: VoidFunction;
  handleCancel: () => TransferArtifactFormFields;
  transferArtwork: TransferFunction;
  transferState: TransferState;
};

const DEFAULT_REGISTER_SALE_COMPLETE = {
  handleFieldOpen: console.warn,
  handleCancel: () => ({} as any),
  transferArtwork: console.warn,
  transferState: TransferState.FormClosed,
};

const TransactionProviderContext = React.createContext<TransactionProvider>(DEFAULT_REGISTER_SALE_COMPLETE);

export const TransactionProvider: React.FC = ({ children }) => {
  const { ArtifactRegistry, Consignment, Eurs, RoyaltyDistributor } = useContractContext();
  const { web3, accounts } = useWeb3Context();
  const { addressFromName } = useNameServiceContext();
  const { key } = useKeyContext();

  const [transferState, setTransferState] = React.useState<TransferState>(TransferState.FormClosed);
  const [transaction, setTransaction] = React.useState<Transaction>();
  const [arrState, setArrState] = React.useState<ARRState>();
  const [tokenId, setTokenId] = React.useState<number>();

  const addProvenance = (metaUri: string, price: string, buyers: string[],
    seller: string, location: string, date: string): Promise<string> => {
    return AgnosticArtworkRetriever.getArtworkMetadata(metaUri)
      .then((jsonData: any) => {
        jsonData.previousSalePrice = price;
        jsonData.saleProvenance.push({
          price: (parseFloat(price) * 100).toString(),
          location: location,
          buyers: buyers,
          seller: seller,
          date: date,
        });

        return AgnosticArtworkRetriever.saveMetadata(jsonData, key);
      });
  };

  const payArr = (arrToast: React.ReactText, arrId: number, arrDue: number): Promise<void> => {
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

  const transferArtwork: TransferFunction = async ({ tokenId, metaUri, fields }): Promise<void> => {
    if (!fields.recipientName) {
      return;
    }

    let owner = '';
    setTokenId(tokenId);
    setTransferState(TransferState.AwaitingConfirmation);

    const isHexAddress = fields.recipientName.includes('0x');

    const recipientAddress = isHexAddress ? fields.recipientName : await addressFromName(fields.recipientName);
    const address = await ArtifactRegistry.methods.ownerOf(tokenId).call();
    owner = address;
    console.log('Getting owner:', owner);
    const provenanceToast = toast('Adding Provenance Record', { autoClose: false });
    const provenanceHash = await addProvenance(
      metaUri,
      fields.price,
      [recipientAddress],
      owner,
      fields.location,
      fields.date,
    );
    toast.update(provenanceToast, {
      render: `Provenance added @ ${provenanceHash}`,
      type: toast.TYPE.SUCCESS,
      autoClose: 5000,
    });

    const approved = await ArtifactRegistry.methods.getApproved(tokenId)
      .call({
        from: accounts[0],
      });

    const eventOptions = { fromBlock: 0 };
    const events: EventData[] = await ArtifactRegistry.getPastEvents('RecordSale', eventOptions);
    const relevantEvents: EventData[] = events.filter(event => event.returnValues.tokenId === tokenId.toString());

    // only take ARR in country that takes it, and if no sales with this token have occurred
    // no sales → user is the one who registered it → they're the artist, or a gallery representing them
    const takesArr = ARR_LOCATIONS.includes(fields.location) &&
      relevantEvents.length > 0 && parseFloat(fields.price) >= 1000;

    const contract = approved === Consignment._address ? Consignment : ArtifactRegistry;
    const salePrice = parseFloat(fields.price) * 100; // Sale price in cents.

    const transferToast = toast('Starting transfer', { autoClose: false });
    return contract.methods.transfer(
      owner,
      recipientAddress,
      tokenId,
      provenanceHash,
      salePrice.toString(),
      fields.location,
      fields.date,
      takesArr,
    ).send(
      {
        from: accounts[0],
        gasLimit: 6000000,
      },
    )
      .once('transactionHash',
        (hash: any) => {
          setTransaction(() => ({
            to: recipientAddress,
            from: owner,
            transactionHash: hash,
            startTime: moment(),
            cost: 0.00045,
          }));
          setTransferState(TransferState.TransactionStarted);
          toast.update(transferToast, { render: `Transfer accepted #${hash}`, type: toast.TYPE.INFO });
        })
      .once('receipt',
        (receipt: any) => {
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
                console.log('Setting State DELETE');
                setArrState({
                  toast: arrToast,
                  arrId,
                  arrDue });
                setTransferState(TransferState.TransactionPartial);
              })
              .catch(console.error);
          } else {
            setTransferState(TransferState.TransactionSuccess);
          }

          toast.update(transferToast, { render: 'Transfer successful', type: toast.TYPE.SUCCESS, autoClose: 5000 });
        })
      .on('confirmation', (confNumber: any, receipt: any) => { console.log(confNumber, receipt); })
      .on('error', (error: any) => {
        console.log(error);
        toast.update(transferToast, { render: 'Transfer failed', type: toast.TYPE.ERROR, autoClose: 5000 });
        setTransferState(TransferState.TransactionFailure);
      });
  };

  const handleFieldOpen = (): void => {
    setTransferState(TransferState.FormOpen);
  };

  const handleCancel = (): TransferArtifactFormFields => {
    setTransferState(TransferState.FormClosed);
    return {
      recipientName: '',
      price: '',
      location: LOCATIONS[0],
      date: '',
    };
  };

  return (
    <TransactionProviderContext.Provider value={{
      handleFieldOpen: handleFieldOpen,
      handleCancel: handleCancel,
      transferArtwork: transferArtwork,
      transferState: transferState,
    }}>
      <TransactionConfirmation
        visible={transferState === TransferState.AwaitingConfirmation}
        handleClose={handleCancel}
      />
      { transaction && <TransactionStarted
        visible={transferState === TransferState.TransactionStarted}
        handleClose={handleCancel}
        transaction={transaction}
      />}
      { transaction && <TransactionFailure
        visible={transferState === TransferState.TransactionFailure}
        handleClose={handleCancel}
        transaction={transaction}
      />}
      { arrState && <TransactionPartial
        visible={transferState === TransferState.TransactionPartial}
        handleClose={handleCancel}
        arr={arrState}
        payArr={() => {
          payArr(arrState.toast, arrState.arrId, arrState.arrDue).then(() =>
            setTransferState(TransferState.TransactionSuccess),
          )
            .catch(console.error);
        }
        }
      />}
      <TransactionSuccess
        visible={transferState === TransferState.TransactionSuccess}
        handleClose={handleCancel}
        tokenId={tokenId}
      />
      { children }
    </TransactionProviderContext.Provider>
  );
};

export const useTransactionProviderContext: () => TransactionProvider = () =>
  React.useContext<TransactionProvider>(TransactionProviderContext);
