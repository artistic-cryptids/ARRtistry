import * as React from 'react';

export interface Artist {
  id: number;
  name: string;
  wallet: string;
  nationality: string;
  birthYear: string;
  deathYear: string;
}

export interface Artists {
  artists: Artist[];
}

export const ArtistContext = React.createContext<Artists>({} as any);

export const ArtistProvider: React.FC<{artistContract: any}> = ({ artistContract, children }) => {
  const [artists, setArtists] = React.useState<Artist[]>([]);

  React.useEffect(() => {
    const updateArtists = async (): Promise<void> => {
      const total = await artistContract.getArtistsTotal();
      const artists = [];

      for (let i = 1; i <= total; i++) {
        const id = i;
        const hash: string = await artistContract.getArtist(id);
        const hashResponse = await fetch(hash);
        const artist = await hashResponse.json();
        artists.push(artist);
      }

      setArtists(artists);
    };

    updateArtists();
  }, [artistContract]);

  return (
    <ArtistContext.Provider value={{ artists: artists }}>
      { children }
    </ArtistContext.Provider>
  );
};

export const useArtistContext: () => Artists = () => React.useContext<Artists>(ArtistContext);
