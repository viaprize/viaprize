/// @notice  SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../logicContracts/logicFunctions.sol";
library LogicLibrary {
    function deployLogicFunctions(address _owner, uint8 _proposerFee, uint8 _platformFee, address _usdcAddress) external returns(address) {
        LogicContract logicContract = new LogicContract(_owner, _proposerFee, _platformFee, _usdcAddress);
        return address(logicContract);
    }
}