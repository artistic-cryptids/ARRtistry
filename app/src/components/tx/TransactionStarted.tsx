import * as React from 'react';

import Fade from 'react-bootstrap/Fade';
import Modal from 'react-bootstrap/Modal';

import Button from 'react-bootstrap/Button';
import CenterSpinner from '../common/CenterSpinner';
import ENSName from '../common/ENSName';
import { TransactionModal, Transaction } from './index';
import { FlexSeparator } from './FlexSeparator';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';

const BLOCK_TIME = moment.duration(500, 'seconds');

interface TransactionStartedProps extends TransactionModal {
  transaction: Transaction;
}

const TransactionStarted: React.FC<TransactionStartedProps> = ({
  visible,
  handleClose,
  transaction: {
    to,
    from,
    transactionHash,
    cost,
    startTime,
    delay = BLOCK_TIME,
  },
}) => {
  const [finishTime, setFinishTime] = React.useState(moment().add(delay));
  const [seconds, setSeconds] = React.useState(0);

  React.useEffect(() => {
    setFinishTime(moment(startTime).add(delay));
  }, [startTime, delay]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(seconds => seconds + 1);
    }, 200);
    if (!visible) clearInterval(interval);
    return () => clearInterval(interval);
  }, [seconds, visible]);

  const progress = Math.min(90, 100 * seconds / (finishTime.diff(startTime, 'seconds')));

  return (
    <Fade in={visible}>
      <Modal
        show={visible}
        onHide={handleClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header className="w-100">
          <Modal.Title className="w-100">
            <FlexSeparator>
              <CenterSpinner/>
              <h4 className="mb-0">Your Artifact is on its way.</h4>
              <Button variant="link" onClick={handleClose}>
                <FontAwesomeIcon icon={faTimes} />
              </Button>
            </FlexSeparator>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-5">
          <div className="text-center">
            Perfect! <ENSName address={to} /> should have it shortly.
          </div>
          <div className="pt-3 pb-4">
            <div className="bg-success py-2" style={{ width: `${progress}%` }} />
            <FlexSeparator className="bg-primary px-3 py-4 text-light">
              <span>{Number(progress).toFixed()}%</span>
              <h5>Transfering...</h5>
              <span>
                Details
                <a
                  href={`https://rinkeby.etherscan.io/tx/${transactionHash}`}
                  className="text-light px-2"
                  aria-label="Close"
                >
                  <FontAwesomeIcon icon={faExternalLinkAlt} />
                </a>
              </span>
            </FlexSeparator>
            <FlexSeparator className="px-3 py-2 border">
              <strong>Your account</strong>
              <ENSName address={from} />
            </FlexSeparator>
            <FlexSeparator className="px-3 py-2 border">
              <strong>Transaction fee</strong>
              <div className="d-flex flex-column align-items-end">
                {cost} ETH
              </div>
            </FlexSeparator>
            <FlexSeparator className="px-3 py-2 border">
              <strong>Estimated time</strong>
              <div className="d-flex flex-column align-items-end">
                {finishTime.fromNow()}.
              </div>
            </FlexSeparator>
          </div>
        </Modal.Body>
      </Modal>
    </Fade>
  );
};

export default TransactionStarted;
