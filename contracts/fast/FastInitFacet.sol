// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import '../interfaces/IERC20.sol';        // Token.
import '../interfaces/IERC165.sol';       // Interface Support.
import '../interfaces/IERC173.sol';       // Ownership.
import '../interfaces/IDiamondCut.sol';   // Facet management.
import '../interfaces/IDiamondLoupe.sol'; // Facet introspection.
import '../interfaces/IHasGovernors.sol'; // Governorship management.
import '../interfaces/IHasMembers.sol';   // Membership management.
import '../lib/LibDiamond.sol';
import '../lib/LibAddressSet.sol';
import '../marketplace/MarketplaceTopFacet.sol';
import './lib/AFastFacet.sol';


/**
 * @notice NotAlthough this contract doesn't explicitelly inherit from IERC173, ERC165, IDiamondLoupe etc, all
 * methods are in fact implemented by the underlaying Diamond proxy. It is therefore safe to
 * perform casts directly on the current contract address into these interfaces.
 */ 
contract FastInitFacet is AFastFacet {
  using LibAddressSet for LibAddressSet.Data;

  // Initializers.

  struct InitializerParams {
    // Top-level stuff.
    address issuer;
    address marketplace;
    // Access stuff.
    address payable governor;
    // Token stuff.
    string name;
    string symbol;
    uint8 decimals;
    bool hasFixedSupply;
    bool isSemiPublic;
  }

  function initialize(InitializerParams calldata params)
      external
      onlyDeployer {
    // Make sure we haven't initialized yet.
    require(LibFast.data().version < LibFast.STORAGE_VERSION, 'Already initialized');

    // Register interfaces.
    LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();
    ds.supportedInterfaces[type(IERC20).interfaceId] = true;
    ds.supportedInterfaces[type(IERC165).interfaceId] = true;
    ds.supportedInterfaces[type(IERC173).interfaceId] = true;
    ds.supportedInterfaces[type(IDiamondCut).interfaceId] = true;
    ds.supportedInterfaces[type(IDiamondLoupe).interfaceId] = true;
    ds.supportedInterfaces[type(IHasGovernors).interfaceId] = true;
    ds.supportedInterfaces[type(IHasMembers).interfaceId] = true;

    // ------------------------------------- //

    // Initialize top-level storage.
    LibFast.Data storage topData = LibFast.data();
    topData.version = LibFast.STORAGE_VERSION;
    topData.issuer = params.issuer;
    topData.marketplace = params.marketplace;
    topData.hasFixedSupply = params.hasFixedSupply;
    topData.isSemiPublic = params.isSemiPublic;

    // ------------------------------------- //

    // Initialize access storage.
    LibFastAccess.Data storage accessData = LibFastAccess.data();
    accessData.version = LibFastAccess.STORAGE_VERSION;
    // Add the governor and emit.
    accessData.governorSet.add(params.governor, false);
    emit GovernorAdded(params.governor);

    // ------------------------------------- //

    // Initialize token storage.
    LibFastToken.Data storage tokenData = LibFastToken.data();
    tokenData.version = LibFastToken.STORAGE_VERSION;
    // Set up ERC20 related stuff.
    (tokenData.name, tokenData.symbol, tokenData.decimals) =
      (params.name,   params.symbol,   params.decimals);
    tokenData.totalSupply = 0;
    // Initialize other internal stuff.
    tokenData.transferCredits = 0;
  }
}
