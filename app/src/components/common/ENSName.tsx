import * as React from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { useNameServiceContext } from '../../providers/NameServiceProvider';

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

  return (
    <>
      {name === ''
        ? address
        : <OverlayTrigger placement='top-start' overlay={<Tooltip id="address">{address}</Tooltip>}>
          <span className={className}>{name}</span>
        </OverlayTrigger>}
    </>
  );
};

export default ENSName;
