import React, { useEffect, useRef } from 'react';
import jazzicon from 'jazzicon';

interface JazziconProps {
  address: string;
  className?: string;
  diameter?: number;
}

function jsNumberForAddress (address: string): number {
  const addr = address.slice(2, 10);
  const seed = parseInt(addr, 16);
  return seed;
}

// Jazzicon library returns a HTMLDivElement, so needs wrapping
const Jazzicon: React.FC<JazziconProps> = ({ address, className, diameter = 46 }) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) { return; }

    const { children } = container.current;
    for (let i = 0; i < children.length; i++) {
      container.current.removeChild(children[i]);
    }

    const image = jazzicon(diameter, jsNumberForAddress(address));
    container.current.appendChild(image);
  }, [address, diameter]);

  return (
    <div
      className={className}
      ref={container}
    />
  );
};

export default Jazzicon;
