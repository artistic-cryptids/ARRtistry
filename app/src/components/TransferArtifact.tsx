import * as React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import ipfs from '../helper/ipfs';
import TransactionLoadingModal from './common/TransactionLoadingModal';
import { useNameServiceContext } from '../providers/NameServiceProvider';
import { useContractContext } from '../providers/ContractProvider';
import { useWeb3Context } from '../providers/Web3Provider';

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
const LOCATIONS = ['United States', 'Canada', 'Afghanistan', 'Albania', 'Algeria', 'American Samoa', 'Andorra', 'Angola', 'Anguilla', 'Antarctica', 'Antigua and/or Barbuda', 'Argentina', 'Armenia', 'Aruba', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bermuda', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Bouvet Island', 'Brazil', 'British Indian Ocean Territory', 'Brunei Darussalam', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Cape Verde', 'Cayman Islands', 'Central African Republic', 'Chad', 'Chile', 'China', 'Christmas Island', 'Cocos (Keeling) Islands', 'Colombia', 'Comoros', 'Congo', 'Cook Islands', 'Costa Rica', 'Croatia (Hrvatska)', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'East Timor', 'Ecudaor', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Falkland Islands (Malvinas)', 'Faroe Islands', 'Fiji', 'Finland', 'France', 'France, Metropolitan', 'French Guiana', 'French Polynesia', 'French Southern Territories', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Gibraltar', 'Greece', 'Greenland', 'Grenada', 'Guadeloupe', 'Guam', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Heard and Mc Donald Islands', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran (Islamic Republic of)', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Ivory Coast', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', "Korea, Democratic People's Republic of", 'Korea, Republic of', 'Kosovo', 'Kuwait', 'Kyrgyzstan', "Lao People's Democratic Republic", 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libyan Arab Jamahiriya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macau', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Martinique', 'Mauritania', 'Mauritius', 'Mayotte', 'Mexico', 'Micronesia, Federated States of', 'Moldova, Republic of', 'Monaco', 'Mongolia', 'Montserrat', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'Netherlands Antilles', 'New Caledonia', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Niue', 'Norfork Island', 'Northern Mariana Islands', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Pitcairn', 'Poland', 'Portugal', 'Puerto Rico', 'Qatar', 'Reunion', 'Romania', 'Russian Federation', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Slovak Republic', 'Solomon Islands', 'Somalia', 'South Africa', 'South Georgia South Sandwich Islands', 'South Sudan', 'Spain', 'Sri Lanka', 'St. Helena', 'St. Pierre and Miquelon', 'Sudan', 'Suriname', 'Svalbarn and Jan Mayen Islands', 'Swaziland', 'Sweden', 'Switzerland', 'Syrian Arab Republic', 'Taiwan', 'Tajikistan', 'Tanzania, United Republic of', 'Thailand', 'Togo', 'Tokelau', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Turks and Caicos Islands', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States minor outlying islands', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City State', 'Venezuela', 'Vietnam', 'Virigan Islands (British)', 'Virgin Islands (U.S.)', 'Wallis and Futuna Islands', 'Western Sahara', 'Yemen', 'Yugoslavia', 'Zaire', 'Zambia', 'Zimbabwe']
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
  const { ArtifactRegistry } = useContractContext();
  const { accounts } = useWeb3Context();

  const saveMetaData = (jsonData: string): Promise<string> => {
    const jsonDataBuffer = Buffer.from(JSON.stringify(jsonData));
    const files = Array(jsonDataBuffer);

    return ipfs.add([...files], { progress: (prog: any) => console.log(`received: ${prog}`) })
      .then((response: any) => 'https://ipfs.io/ipfs/' + response[0].hash);
  };

  const addProvenance = (price: string, buyers: string[],
    seller: string, location: string, date: string): Promise<string> => {
    return fetch(metaUri)
      .then((response: any) => response.json())
      .then((jsonData: any) => {
        jsonData.previousSalePrice = price;
        jsonData.saleProvenance.push({
          price: (parseFloat(price) * 100).toString(),
          location: location,
          buyers: buyers,
          seller: seller,
          date: date,
        });

        return saveMetaData(jsonData);
      });
  };

  const transferArtwork = async (_: React.FormEvent): Promise<void> => {
    let owner = '';
    setSubmitted(true);

    const recipientAddress = await addressFromName(fields.recipientName);
    const address = await ArtifactRegistry.methods.ownerOf(tokenId).call();
    owner = address;
    const provenanceHash = await addProvenance(
      fields.price,
      [recipientAddress],
      owner,
      fields.location,
      fields.date,
    );

    const takesArr = ARR_LOCATIONS.includes(fields.location);

    ArtifactRegistry.methods.transfer(
      owner,
      recipientAddress,
      tokenId,
      provenanceHash,
      (parseFloat(fields.price) * 100).toString(),
      fields.location,
      fields.date,
      takesArr,
    ).send(
      {
        from: accounts[0],
        gasLimit: 6000000,
      },
    ).then(() => {
      setSubmitted(false);
    }).catch((err: any) => {
      // rejection, usually
      console.log(err);
      setSubmitted(false);
    });
  };

  const inputChangeHandler = (event: InputChangeEvent): void => {
    const key = event.target.id;
    const val = event.target.value;
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
            <Form.Label>Recipient Name</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="example.artistry.test"
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
