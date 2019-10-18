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

  function applyFor(address who, IArtifactRegistry.Artifact memory _artifact) public returns (uint) {
    bytes memory data = abi.encodeWithSelector(registry.mint.selector, who, _artifact);
    return governance.propose(address(registry), data);
  }
}
