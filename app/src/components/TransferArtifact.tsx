import * as React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

import { TransferState, useTransactionProviderContext } from '../providers/TransactionProvider';

interface TransferArtifactProps {
  tokenId: number;
  metaUri: string;
}

export interface TransferArtifactFormFields {
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
export const LOCATIONS = ['United Kingdom', 'Canada', 'Afghanistan', 'Albania', 'Algeria', 'American Samoa', 'Andorra', 'Angola', 'Anguilla', 'Antarctica', 'Antigua and/or Barbuda', 'Argentina', 'Armenia', 'Aruba', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bermuda', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Bouvet Island', 'Brazil', 'British Indian Ocean Territory', 'Brunei Darussalam', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Cape Verde', 'Cayman Islands', 'Central African Republic', 'Chad', 'Chile', 'China', 'Christmas Island', 'Cocos (Keeling) Islands', 'Colombia', 'Comoros', 'Congo', 'Cook Islands', 'Costa Rica', 'Croatia (Hrvatska)', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'East Timor', 'Ecudaor', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Falkland Islands (Malvinas)', 'Faroe Islands', 'Fiji', 'Finland', 'France', 'France, Metropolitan', 'French Guiana', 'French Polynesia', 'French Southern Territories', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Gibraltar', 'Greece', 'Greenland', 'Grenada', 'Guadeloupe', 'Guam', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Heard and Mc Donald Islands', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran (Islamic Republic of)', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Ivory Coast', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', "Korea, Democratic People's Republic of", 'Korea, Republic of', 'Kosovo', 'Kuwait', 'Kyrgyzstan', "Lao People's Democratic Republic", 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libyan Arab Jamahiriya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macau', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Martinique', 'Mauritania', 'Mauritius', 'Mayotte', 'Mexico', 'Micronesia, Federated States of', 'Moldova, Republic of', 'Monaco', 'Mongolia', 'Montserrat', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'Netherlands Antilles', 'New Caledonia', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Niue', 'Norfork Island', 'Northern Mariana Islands', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Pitcairn', 'Poland', 'Portugal', 'Puerto Rico', 'Qatar', 'Reunion', 'Romania', 'Russian Federation', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Slovak Republic', 'Solomon Islands', 'Somalia', 'South Africa', 'South Georgia South Sandwich Islands', 'South Sudan', 'Spain', 'Sri Lanka', 'St. Helena', 'St. Pierre and Miquelon', 'Sudan', 'Suriname', 'Svalbarn and Jan Mayen Islands', 'Swaziland', 'Sweden', 'Switzerland', 'Syrian Arab Republic', 'Taiwan', 'Tajikistan', 'Tanzania, United Republic of', 'Thailand', 'Togo', 'Tokelau', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Turks and Caicos Islands', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United States', 'United States minor outlying islands', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City State', 'Venezuela', 'Vietnam', 'Virigan Islands (British)', 'Virgin Islands (U.S.)', 'Wallis and Futuna Islands', 'Western Sahara', 'Yemen', 'Yugoslavia', 'Zaire', 'Zambia', 'Zimbabwe']

const TransferArtifact: React.FC<TransferArtifactProps> = ({ tokenId, metaUri }) => {
  const [fields, setFields] = React.useState<TransferArtifactFormFields>({
    recipientName: '',
    price: '',
    location: LOCATIONS[0],
    date: '',
  });
  const { handleFieldOpen, handleCancel, transferArtwork, transferState } = useTransactionProviderContext();

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

  const locationOptions = (): JSX.Element[] => {
    return LOCATIONS.map((location, index) =>
      <option key={index}>{location}</option>,
    );
  };
  const today = new Date();
  const todaysDate = today.toISOString().substring(0, 10);

  return (
    <>
      <Button variant="primary" onClick={handleFieldOpen}>
        Register Sale
      </Button>
      <Modal show={transferState === TransferState.FormOpen} onHide={handleCancel}>
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
              defaultValue={todaysDate}
              onChange={inputChangeHandler}/>
            {GENERIC_FEEDBACK}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => transferArtwork({ tokenId, metaUri, fields })}>
            Register Sale
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TransferArtifact;
