import { useArtistContext, Artist } from '../../providers/ArtistProvider';
import React from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { useFormControlContext } from '../../providers/FormProvider';

const ArtistSelection: React.FC = () => {
  const { artists } = useArtistContext();
  const { setField } = useFormControlContext();

  const artistOptions = artists.map((artist: Artist, id: number) => {
    return <option key={id} value={artist.id}>{artist.name}</option>;
  });

  const onArtistChange = (event: React.FormEvent<HTMLSelectElement & any>): void => {
    setField('artistId', event.currentTarget.value.toString());
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
