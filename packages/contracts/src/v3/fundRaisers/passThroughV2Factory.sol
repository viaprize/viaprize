/// @notice  SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./passThroughV2.sol";
contract PassThroughV2Factory {
    event NewPortalCreated(uint indexed _id ,address indexed portalAddress);
    function createPortal(
        uint _id,
        address  _owner,
        address[] memory _admins,
        uint256 _platformFee,
        address _tokenUsdc,
        address _bridgedTokenUsdc,
        address _wethToken,
        address _swapRouter,
        address _usdcToUsdcePool,
        address _usdcToEthPool,
        address _ethPriceAggregator
        
    ) public returns (address) {
        PassThroughV2 newPortal = new PassThroughV2(_owner, _admins ,_platformFee,_tokenUsdc,_bridgedTokenUsdc,_wethToken,_swapRouter,_usdcToUsdcePool,_usdcToEthPool,_ethPriceAggregator);
        emit NewPortalCreated(_id,address(newPortal));
        return address(newPortal);
    }
}
