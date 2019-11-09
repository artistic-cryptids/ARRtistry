pragma solidity 0.5.12;
pragma experimental ABIEncoderV2;

import { SafeMath } from "@openzeppelin/contracts/math/SafeMath.sol";

import { IGovernance } from "./interfaces/IGovernance.sol";
import { IArtifactRegistry } from "./interfaces/IArtifactRegistry.sol";
import { ARRCalculator } from "./ARRCalculator.sol";

/**
 * @title ArtifactApplication
 * @dev Convenient interface for applying to the Artifact registry.
 */
contract ArtifactApplication {
  using SafeMath for uint;

  IGovernance public governance;
  IArtifactRegistry public registry;

  constructor(IGovernance _governance, IArtifactRegistry _registry) public {
    governance = _governance;
    registry = _registry;
  }

  function applyFor(address proposer, address _artist, string memory _metaUri) public returns (uint) {
    IArtifactRegistry.Artifact memory artifact = IArtifactRegistry.Artifact(_artist, _metaUri);

    bytes memory data = abi.encodeWithSelector(registry.mint.selector, proposer, artifact);
    return governance.propose(address(registry), data);
  }

  function getProposal(uint proposalId) public view returns (address, address, string memory) {
    IGovernance.Proposal memory proposal = governance.getProposal(proposalId);
    require(proposal.status == IGovernance.Status.Pending, "ArtifactApplication::getProposal: proposal is not pending");

    bytes memory data = proposal.data;
    bytes memory artifactData = new bytes(data.length - 4);

    // Slice off first 4 selector bytes
    for (uint i = 0; i < data.length - 5; i++) {
      artifactData[i] = data[i + 4];
    }

    (address who, IArtifactRegistry.Artifact memory artifact) = abi.decode(artifactData, (address, IArtifactRegistry.Artifact));

    return (who, artifact.artist, artifact.metaUri);
  }

  function getARR(uint arrId) public view returns (address, address, uint256, uint, uint, string memory) {
    IGovernance.ARR memory arr = governance.getARR(arrId);

    return (arr.from, arr.to, arr.tokenId, arr.price, ARRCalculator.calculateARR(arr.price), arr.location);
  }
}
