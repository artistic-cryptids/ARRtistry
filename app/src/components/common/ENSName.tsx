import * as React from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { ContractProps } from '../../helper/eth';
import { nameFromAddress } from '../../helper/ensResolver';

interface ENSNameProps extends ContractProps {
  address: string;
}

interface ENSNameState {
  name: string;
}

class ENSName extends React.Component<ENSNameProps, ENSNameState> {
  componentDidMount (): void {
    // Where we would normally check ENS for names
    /* let name;
    switch (this.props.address) {
    case '0xDf08F82De32B8d460adbE8D72043E3a7e25A3B39':
      name = 'dacs.arrtistry.test';
      break;
    case '0x6704Fbfcd5Ef766B287262fA2281C105d57246a6':
      name = 'simon.arrtistry.test';
      break;
    case '0x9E1Ef1eC212F5DFfB41d35d9E5c14054F26c6560':
      name = 'natasha.arrtistry.test';
      break;
    default:
      name = 'default.arrtistry.test';
    } */
    this.getName();
  }

  getName = async (): Promise<void> => {
    const name = await nameFromAddress(this.props.contracts.Ens, this.props.address);
    this.setState({ name: name });
  }

  render (): React.ReactNode {
    // If we haven't loaded the name just display the address
    if (!this.state || !this.state.name) {
      return this.props.address;
    }

    return (
      <OverlayTrigger placement='left' overlay={<Tooltip id="address">{this.props.address}</Tooltip>}>
        <p>{this.state.name}</p>
      </OverlayTrigger>
    );
  }
}

export default ENSName;
