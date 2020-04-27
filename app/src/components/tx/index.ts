import moment from 'moment';

export { default as TransactionConfirmation } from './TransactionConfirmation';
export { default as TransactionStarted } from './TransactionStarted';
export { default as TransactionSuccess } from './TransactionSuccess';
export { default as TransactionPartial } from './TransactionPartial';
export { default as TransactionFailure } from './TransactionFailure';

/* <TransactionStarted visible={true} transaction={transaction}/> */
/* <TransactionPartial visible={true} arrDue={300} payArr={() => {}}/> */
/* <TransactionFailure visible={true} transaction={transaction}/> */
/* <TransactionSuccess visible={true} tokenId={1}/> */

export interface TransactionModal {
  visible: boolean;
  handleClose?: VoidFunction;
}

export interface Transaction {
  to: string;
  from: string;
  transactionHash: string;
  cost: number;
  startTime: moment.Moment;
  delay?: moment.Duration;
}

export interface ARRState {
  toast: any;
  arrId: number;
  arrDue: number;
}
