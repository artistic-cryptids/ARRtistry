const { getOwner } = require('./helper/Accounts');
const ArtifactRegistry = artifacts.require('ArtifactRegistry');
const artifacts = require('./data/artifacts.json');

module.exports = async (deployer, network, accounts) => {
  const registry = await ArtifactRegistry.deployed();

  for artifact in artifacts {
    var currentOwner = getOwner(network, accounts);
    await registry.mint(currentOwner, {
      artist: artifact.artist,
      metaUri: artifact.metaUri,
    });

    const token = await registry.getCurrentTokenId();

    for comission in artifact.commissions {
      await registry.pieceCommissioned(token, comission.description, comission.date);
    }

    for exhibition in artifact.exhibitions {
      await registry.pieceExhibited(token, exhibition.description, exhibition.date);
    }

    for sale in artifact.sales {
      await registry.transfer(
        currentOwner,
        sale.to,
        token,
        sale.metaUri,
        sale.price,
        sale.country,
        sale.date,
        sale.arr,
        { from: currentOwner },
      );
      currentOwner = sale.to;
    }
  }
};
