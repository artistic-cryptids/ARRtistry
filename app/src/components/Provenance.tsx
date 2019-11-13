import * as React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ListGroup from 'react-bootstrap/ListGroup';

interface ProvenanceProps {
  metaUri: string;
}

interface ArtworkInfo {
  saleProvenance: Array<SaleRecord>;
}

interface SaleRecord {
  price: number;
  location: string;
  buyers: Array<string>;
  seller: string;
}

interface ProvenanceState {
  showProvenance: boolean;
  saleProvenance: Array<SaleRecord>;
}

class Provenance extends React.Component<ProvenanceProps, ProvenanceState> {
  constructor (props: ProvenanceProps) {
    super(props);
    this.state = {
      showProvenance: false,
      saleProvenance: [],
    };
  }

  componentDidMount (): void {
    fetch(this.props.metaUri)
      .then((response) => {
        return response.json();
      })
      .then((artworkInfo: ArtworkInfo) => {
        this.setState({
          saleProvenance: artworkInfo.saleProvenance,
        });
      })
      .catch((err: any) => { console.log(err); });
  }

  handleShow = (): void => {
    this.setState({
      showProvenance: true,
    });
  }

  handleClose = (): void => {
    this.setState({
      showProvenance: false,
    });
  }

  render (): React.ReactNode {
    const provenance = this.state.saleProvenance.map((saleRecord: SaleRecord, index: number) =>
      <ListGroup.Item key={index}>
        <p>Date Sold: {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <p>Buyer: {saleRecord.buyers}</p>
        <p>Seller: {saleRecord.seller}</p>
        <p>Sale Location: {saleRecord.location}</p>
        <p>Sale Price: &euro;{saleRecord.price / 100}</p>
      </ListGroup.Item>,
    );

    return (
      <>
        <Button variant="primary" onClick={this.handleShow}>
          Provenance
        </Button>
        <Modal show={this.state.showProvenance} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Provenance</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ListGroup>
              {provenance}
            </ListGroup>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

export default Provenance;
