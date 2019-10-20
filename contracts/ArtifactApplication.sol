pragma solidity 0.5.8;
pragma experimental ABIEncoderV2;

import { SafeMath } from "@openzeppelin/contracts/math/SafeMath.sol";

import { IGovernance } from "./interfaces/IGovernance.sol";
import { IArtifactRegistry } from "./interfaces/IArtifactRegistry.sol";


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

  function applyFor(
    address who,
    address _artist,
    string memory _title,
    string memory _medium,
    string memory _edition,
    string memory _created,
    string memory _metaUri
  ) public returns (uint) {
    IArtifactRegistry.Artifact memory artifact = IArtifactRegistry.Artifact(
        _artist,
        _title,
        _medium,
        _edition,
        _created,
        _metaUri
    );

    bytes memory data = abi.encodeWithSelector(registry.mint.selector, who, artifact);
    return governance.propose(address(registry), data);
  }
}
