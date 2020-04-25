import * as React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import TransactionLoadingModal from './common/TransactionLoadingModal';
import { EventData } from 'web3-eth-contract';
import { useNameServiceContext } from '../providers/NameServiceProvider';
import { useContractContext } from '../providers/ContractProvider';
import { useWeb3Context } from '../providers/Web3Provider';
import { useRegisterSaleCompleteContext } from '../providers/RegisterSaleCompleteProvider';
import * as AgnosticArtworkRetriever from '../helper/agnostic';

import { toast } from 'react-toastify';
import { useKeyContext } from '../providers/KeyProvider';

interface TransferArtifactProps {
  tokenId: number;
  metaUri: string;
}

interface TransferArtifactFormFields {
  recipientName: string;
  price: string;
  location: string;
  date: string;
}

interface TransferArtifactState {
  fields: TransferArtifactFormFields;
  showTransferForm: boolean;
  submitted: boolean;
}

type InputChangeEvent = React.FormEvent<any> &
  {
    target: {
      id: keyof TransferArtifactFormFields;
      value: TransferArtifactFormFields[keyof TransferArtifactFormFields];
    };
  }

const GENERIC_FEEDBACK = <Form.Control.Feedback>Looks good!</Form.Control.Feedback>;

// eslint-disable-next-line
const LOCATIONS = ['United Kingdom', 'Canada', 'Afghanistan', 'Albania', 'Algeria', 'American Samoa', 'Andorra', 'Angola', 'Anguilla', 'Antarctica', 'Antigua and/or Barbuda', 'Argentina', 'Armenia', 'Aruba', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bermuda', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Bouvet Island', 'Brazil', 'British Indian Ocean Territory', 'Brunei Darussalam', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Cape Verde', 'Cayman Islands', 'Central African Republic', 'Chad', 'Chile', 'China', 'Christmas Island', 'Cocos (Keeling) Islands', 'Colombia', 'Comoros', 'Congo', 'Cook Islands', 'Costa Rica', 'Croatia (Hrvatska)', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'East Timor', 'Ecudaor', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Falkland Islands (Malvinas)', 'Faroe Islands', 'Fiji', 'Finland', 'France', 'France, Metropolitan', 'French Guiana', 'French Polynesia', 'French Southern Territories', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Gibraltar', 'Greece', 'Greenland', 'Grenada', 'Guadeloupe', 'Guam', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Heard and Mc Donald Islands', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran (Islamic Republic of)', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Ivory Coast', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', "Korea, Democratic People's Republic of", 'Korea, Republic of', 'Kosovo', 'Kuwait', 'Kyrgyzstan', "Lao People's Democratic Republic", 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libyan Arab Jamahiriya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macau', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Martinique', 'Mauritania', 'Mauritius', 'Mayotte', 'Mexico', 'Micronesia, Federated States of', 'Moldova, Republic of', 'Monaco', 'Mongolia', 'Montserrat', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'Netherlands Antilles', 'New Caledonia', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Niue', 'Norfork Island', 'Northern Mariana Islands', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Pitcairn', 'Poland', 'Portugal', 'Puerto Rico', 'Qatar', 'Reunion', 'Romania', 'Russian Federation', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Slovak Republic', 'Solomon Islands', 'Somalia', 'South Africa', 'South Georgia South Sandwich Islands', 'South Sudan', 'Spain', 'Sri Lanka', 'St. Helena', 'St. Pierre and Miquelon', 'Sudan', 'Suriname', 'Svalbarn and Jan Mayen Islands', 'Swaziland', 'Sweden', 'Switzerland', 'Syrian Arab Republic', 'Taiwan', 'Tajikistan', 'Tanzania, United Republic of', 'Thailand', 'Togo', 'Tokelau', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Turks and Caicos Islands', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United States', 'United States minor outlying islands', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City State', 'Venezuela', 'Vietnam', 'Virigan Islands (British)', 'Virgin Islands (U.S.)', 'Wallis and Futuna Islands', 'Western Sahara', 'Yemen', 'Yugoslavia', 'Zaire', 'Zambia', 'Zimbabwe']
// eslint-disable-next-line
const ARR_LOCATIONS = ['Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic', 'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary', 'Iceland', 'Ireland', 'Italy', 'Latvia', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Malta', 'Netherlands', 'Norway', 'Poland', 'Portugal', 'Romania', 'Slovak Republic', 'Slovenia', 'Spain', 'Sweden', 'United Kingdom'];

const TransferArtifact: React.FC<TransferArtifactProps> = ({ tokenId, metaUri }) => {
  const [fields, setFields] = React.useState<TransferArtifactFormFields>({
    recipientName: '',
    price: '',
    location: LOCATIONS[0],
    date: '',
  });
  const [showTransferForm, setShowTransferForm] = React.useState<boolean>(false);
  const [submitted, setSubmitted] = React.useState<boolean>(false);

  const { addressFromName } = useNameServiceContext();
  const { ArtifactRegistry, Consignment } = useContractContext();
  const { accounts } = useWeb3Context();
  const { key } = useKeyContext();
  const { showRegisterSaleCompleteForm } = useRegisterSaleCompleteContext();

  const addProvenance = (price: string, buyers: string[],
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

  const transferArtwork = async (_: React.FormEvent): Promise<void> => {
    let owner = '';
    setSubmitted(true);

    const isHexAddress = fields.recipientName.includes('0x');

    const recipientAddress = isHexAddress ? fields.recipientName : await addressFromName(fields.recipientName);
    const address = await ArtifactRegistry.methods.ownerOf(tokenId).call();
    owner = address;
    console.log('Getting owner:', owner);
    const provenanceToast = toast('Adding Provenance Record', { autoClose: false });
    const provenanceHash = await addProvenance(
      fields.price,
      [recipientAddress],
      owner,
      fields.location,
      fields.date,
    );
    toast.update(provenanceToast, {
      render: `Provenance added @${provenanceHash}`,
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
    const transferPromise = contract.methods.transfer(
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
          toast.update(transferToast, { render: `Transfer accepted #${hash}`, type: toast.TYPE.INFO });
        })
      .once('receipt',
        (_: any) => {
          toast.update(transferToast, { render: 'Transfer successful', type: toast.TYPE.SUCCESS, autoClose: 5000 });
        })
      .on('confirmation', (confNumber: any, receipt: any) => { console.log(confNumber, receipt); })
      .on('error', (error: any) => {
        console.log(error);
        toast.update(transferToast, { render: 'Transfer failed', type: toast.TYPE.ERROR, autoClose: 5000 });
        setSubmitted(false);
      });

    console.log('takesARR', takesArr);
    transferPromise.then((receipt: any) => {
      showRegisterSaleCompleteForm(takesArr, receipt, salePrice);
    }).catch(console.log);
  };

  const inputChangeHandler: React.FormEventHandler<any> = (event) => {
    // Can't handle the Bootstrap form types
    const target = event.target as any;
    const key = target.id as keyof TransferArtifactFormFields;
    const val = target.value;

    const stateUpdate = {
      fields: fields as Pick<TransferArtifactFormFields, keyof TransferArtifactFormFields>,
    };
    stateUpdate.fields[key] = val;
    setFields(stateUpdate.fields);
  };

  const handleShow = (): void => {
    setShowTransferForm(true);
  };

  const handleCancel = (): void => {
    setFields({
      recipientName: '',
      price: '',
      location: LOCATIONS[0],
      date: '',
    });
    setShowTransferForm(false);
  };

  const locationOptions = (): JSX.Element[] => {
    return LOCATIONS.map((location, index) =>
      <option key={index}>{location}</option>,
    );
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Register Sale
      </Button>
      <Modal show={showTransferForm} onHide={handleCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Register Sale of Artifact</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group as={Col} controlId="recipientName">
            <Form.Label>Recipient Identifier</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="example.arrtistry.test"
              onChange={inputChangeHandler}/>
            {GENERIC_FEEDBACK}
          </Form.Group>
          <Form.Group as={Col} controlId="price">
            <Form.Label>Price (Euros)</Form.Label>
            <Form.Control
              required
              type="text"
              onChange={inputChangeHandler}/>
            {GENERIC_FEEDBACK}
          </Form.Group>
          <Form.Group as={Col} controlId="location">
            <Form.Label>Sale Location</Form.Label>
            <Form.Label className="mb-2 text-muted">If you do not see your sale location listed below it
              might be the case the artist is not eligible for ARR</Form.Label>
            <Form.Control
              required
              as="select"
              onChange={inputChangeHandler}>
              {locationOptions()}
            </Form.Control>
          </Form.Group>
          <Form.Group as={Col} controlId="date">
            <Form.Label>Date (YYYY-MM-DD)</Form.Label>
            <Form.Control
              required
              type="text"
              onChange={inputChangeHandler}/>
            {GENERIC_FEEDBACK}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={transferArtwork}>
            Register Sale
          </Button>
        </Modal.Footer>
      </Modal>
      <TransactionLoadingModal
        submitted={submitted}
        title="Registering sale..."
      />
    </>
  );
};

export default TransferArtifact;
