import React from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { useFormControlContext } from '../../providers/FormProvider';
import { useContractContext } from '../../providers/ContractProvider';

const ArtistSelection: React.FC = () => {
  const [artists, setArtists] = React.useState<any[]>([]);

  const { Artists } = useContractContext();
  const { setFields } = useFormControlContext();

  React.useEffect(() => {
    const updateArtists = async (): Promise<void> => {
      const total = await Artists.methods.getArtistsTotal().call();
      const artists = [];

      for (let i = 1; i <= total; i++) {
        const hash: string = await Artists.methods.getArtist(i).call();
        const hashResponse = await fetch(hash);
        const artist = await hashResponse.json();
        artists.push(artist);
      }

      setArtists(artists);
    };
    updateArtists();
  }, [Artists]);

  const artistOptions = artists.map((artist: any, id: number) => {
    return <option key={id} value={artist.id}>{artist.name}</option>;
  });

  const onArtistChange = (event: React.FormEvent<HTMLSelectElement & any>): void => {
    setFields({
      'artistId': event.currentTarget.value.toString(),
      'artistWallet': artists[event.currentTarget.value - 1].wallet,
    });
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
