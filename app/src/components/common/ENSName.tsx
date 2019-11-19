import * as React from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { ContractProps } from '../../helper/eth';
import { useNameServiceContext } from '../../providers/NameServiceProvider';

interface ENSNameProps extends ContractProps {
  address: string;
}

const ENSName: React.FC<ENSNameProps> = ({ address, contracts, accounts }) => {
  const [name, setName] = React.useState<string>('');

  const { nameFromAddress } = useNameServiceContext();

  React.useEffect(() => {
    nameFromAddress(address)
      .then((name: string) => {
        setName(name);
      })
      .catch((err: any) => console.log(err));
  }, [address]);

  return (
    <>
      {name === ''
        ? address
        :  <OverlayTrigger placement='left' overlay={<Tooltip id="address">{address}</Tooltip>}>
            <p>{name}</p>
          </OverlayTrigger>}
    </>
  );
};

export default ENSName;
