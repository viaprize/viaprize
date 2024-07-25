// /// @notice  SPDX-License-Identifier: MIT
// pragma solidity ^0.8.0;

// import "./allOrNothingV2.sol";
// contract allOrNothingV2Factory {
//     event NewFundRaiserCreated(uint indexed _id ,address indexed _fundRaiserAddress);
//     function createFundRaiser(
//         uint _id,
//         address  _owner,
//         address[] memory _admins,
//         address _tokenUsdc,
//         address _bridgedTokenUsdc,
//         address _wethToken,
//         address _swapRouter,
//         address _usdcToUsdcePool,
//         address _usdcToEthPool,
//         address _ethPriceAggregator,
//         uint256 _goal,
//         uint256 _deadline,
//         bool _allowDonationAboveGoalAmount,
//         uint256 _platformFee
        
//     ) public returns (address) {
//         AllOrNothingV2 newFundRaiser = new AllOrNothingV2(_owner, _admins ,_tokenUsdc,_bridgedTokenUsdc,_wethToken,_swapRouter,_usdcToUsdcePool,_usdcToEthPool,_ethPriceAggregator, _goal, _deadline, _allowDonationAboveGoalAmount, _platformFee);
//         emit NewFundRaiserCreated(_id,address(newFundRaiser));
//         return address(newFundRaiser);
//     }
// }
