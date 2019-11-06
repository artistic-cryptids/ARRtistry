import { useArtistContext, Artist } from '../../providers/ArtistProvider';
import { SetValueContext, InputChangeEvent } from './RegisterForm';
import React from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';

const ArtistSelection: React.FC = () => {
  const { artists } = useArtistContext();
  const setValue = React.useContext(SetValueContext);

  const artistOptions = artists.map((artist: Artist, id: number) => {
    return <option key={id}>{artist.name}</option>;
  });

  const onArtistChange = (event: InputChangeEvent): void => {
    const value = event.target.value;

    let artist;
    for (const a of artists) {
      if (a.name === value) {
        artist = a;
        break;
      }
    }

    if (!artist) {
      return;
    }

    setValue('artistId', artist.id.toString());
  };

  return (
    <Form.Row>
      <Form.Group as={Col}>
        <Form.Label>Artist Name</Form.Label>
        <Form.Control
          as="select"
          onChange={onArtistChange}
        >
          {artistOptions}
        </Form.Control>
      </Form.Group>
    </Form.Row>
  );
};

export default ArtistSelection;
