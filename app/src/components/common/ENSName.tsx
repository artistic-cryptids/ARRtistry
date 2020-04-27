import * as React from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { useNameServiceContext } from '../../providers/NameServiceProvider';
import { addressSlicer } from '../../helper/eth';

interface ENSNameProps {
  address: string;
  className?: string;
}

const ENSName: React.FC<ENSNameProps> = ({ address, className }) => {
  const [name, setName] = React.useState<string>('');

  const { nameFromAddress } = useNameServiceContext();

  React.useEffect(() => {
    nameFromAddress(address)
      .then((name: string) => {
        setName(name);
      })
      .catch((err: any) => console.log(err));
  }, [address, nameFromAddress]);

  const inner = (
    <a
      className={className}
      href={`https://rinkeby.etherscan.io/address/${address}`}
    >
      {name === '' ? addressSlicer(address) : name}
    </a>
  );

  return (
    <OverlayTrigger placement='top-start' overlay={<Tooltip id="address">{address}</Tooltip>}>
      {inner}
    </OverlayTrigger>
  );
};

export default ENSName;
