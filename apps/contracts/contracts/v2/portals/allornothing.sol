//SPDX-License-Identifier:MIT
pragma solidity ^0.8.0;

import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "../helperContracts/safemath.sol";
import "../helperContracts/ierc20_permit.sol";
import "../helperContracts/ierc20_weth.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
// import "@uniswap/v3-core/contracts/libraries/FullMath.sol";

contract PassThrough {
    /// @notice this is the address of proposer who deploys a contract
    address public proposer;
    /// @notice this will be a mapping of the address of a proposer to a boolean value of true or false
    mapping(address => bool) public isProposer;
    ///@notice array of platformAdmins address, there can be multiple platform admins
    address[] public platformAdmins;
    /// @notice this will be a mapping of the addresses of a platformAdmins to a boolean value of true or false
    mapping(address => bool) public isplatformAdmin;
    /// @notice this will be the address to receive campaign funds, it can be similar to proposer address
    address public receipent;
    /// @notice this will be the address to receive platform Fee
    address public platformAddress;
    /// @notice this will the percentage from totalFunds which goes to the platform address as Fee
    uint256 public platformFee;
    /// @notice this will be an array of address who funding to this campaign
    address[] public funders; 
    /// @notice this will be a mapping of the addresses of a funder to a boolean value of true or false
    mapping(address => bool) public isFunder;
    /// @notice this will be a mapping of the addresses of the funders to the amount they have contributed
    mapping(address => uint256) public funderAmount;
    /// @notice this will be the total funds yet contributed to this campaign by funders
    uint256 public totalFunds;
    /// @notice this will be the total Rewards which goes to recipent after deducting platform fees
    uint256 public totalRewards;
    /// @notice bool to check status of campaign
    bool public isActive;
    /// @notice To-Do
    bool internal locked;
    /// @notice initializing the erc20 interface for usdc token
    IERC20Permit private _usdc;
    /// @notice initializing the erc20 interface for usdc bridged usdc token
    IERC20Permit private _usdcBridged;
    /// @notice initializing the interface for weth
    IWETH private _weth;
    /// @notice initializing swaprouter interface
    ISwapRouter public immutable swapRouter;
    /// @notice initializing uniswaprouter interface
    IUniswapV2Router02 public immutable swap2Router;
    /// @notice this is an usdc token address which will be assigned while deploying the contract.
    address public USDC;
    /// @notice this is an usdc token address which will be assigned while deploying the contract.
    address public USDC_E;
    /// @notice this is an Eth address which will be assigned while deploying the contract.
    address public WETH;
    mapping(address => uint) public revokeVotes;
    uint256 public totalPlatformAdmins;
    /// @notice error indicating insufficient funds while funding to the contract.
    error NotEnoughFunds();
    /// @notice error indicating the funding to the contract has ended
    error FundingToContractEnded();

    /// @notice initializing the use of safemath
    using SafeMath for uint256;
    /// @notice this event for just testing, need to remove
    event Values(
        address receipent,
        uint256 totalFunds,
        uint256 totalRewards
    );

    /// @notice constructor where we pass all the required parameters before deploying the contract
    constructor(
        address _proposer,
        address[] memory _platformAdmins,
        address _token,
        address _bridgedToken,
        address _wethCoin,
        uint256 _platformFee
    ) {

        proposer = _proposer;
        isProposer[_proposer] = true;
        totalPlatformAdmins = _platformAdmins.length;
        for(uint256 i=0; i<_platformAdmins.length; i++) {
            platformAdmins.push(_platformAdmins[i]);
            isplatformAdmin[_platformAdmins[i]] = true;
        }
        receipent = _proposer;
        platformAddress = 0x1f00DD750aD3A6463F174eD7d63ebE1a7a930d0c;
        platformFee = _platformFee;
        isActive = true;
        _usdc = IERC20Permit(_token);
        _usdcBridged = IERC20Permit(_bridgedToken);
        _weth = IWETH(_wethCoin);
        USDC = _token;
        USDC_E = _bridgedToken;
        WETH = _wethCoin;
        swapRouter = ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);
        swap2Router = IUniswapV2Router02(0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45);
    }

    /// @notice re-entrancy modifier
    modifier noReentrant() {
        require(!locked, "No cheat, No Re-entrancy");
        locked = true;
        _;
        locked = false;
    }
    /// @notice modifer where only proposer or platformAdmin can call the functions.
    modifier onlyProposerOrAdmin {
        require(isProposer[msg.sender] == true || isplatformAdmin[msg.sender] == true, "You are not a proposer or platformAdmin.");
        _;
    }
    // function sqrtPriceX96ToUint(uint160 sqrtPriceX96, uint8 decimalsToken0)
    // internal
    // pure
    // returns (uint256)
    // {
    // uint256 numerator1 = uint256(sqrtPriceX96) * uint256(sqrtPriceX96);
    // uint256 numerator2 = 10**decimalsToken0;
    // return FullMath.mulDiv(numerator1, numerator2, 1 << 192);
    // }   


    /// @notice function to donate the usdc tokens into the campaign
    function addUSDCFunds(address _sender, uint256 _amountUsdc, uint256 _deadline, uint8 v, bytes32 r, bytes32 s) public noReentrant  {
        require(_amountUsdc > 0, "funds should be greater than 0");
        if (!isActive) revert FundingToContractEnded();
        _usdc.permit(_sender, address(this), _amountUsdc, _deadline, v, r, s);
        TransferHelper.safeTransferFrom(USDC, msg.sender, address(this), _amountUsdc);
        
        uint256 _donation = _amountUsdc;
        funders.push(msg.sender);
        isFunder[msg.sender] = true;
        totalFunds = totalFunds.add(_donation);
        totalRewards = totalRewards.add((_donation.mul(100 - platformFee)).div(100));
        _usdc.transfer(receipent, (_donation.mul(100 - platformFee)).div(100));
        _usdc.transfer(platformAddress, (_donation.mul(platformFee)).div(100));

        emit Values(receipent, totalFunds, totalRewards);
    }

    /// @notice function to donate eth into the campaign
    function addEthFunds() public noReentrant payable  {
        if (msg.value == 0) revert NotEnoughFunds();
        if (!isActive) revert FundingToContractEnded();
        uint256 eth_donation =  msg.value;
        _weth.deposit{value:msg.value}();
        _weth.approve(address(swapRouter), eth_donation);
        ISwapRouter.ExactInputSingleParams memory params =
            ISwapRouter.ExactInputSingleParams({
                tokenIn: WETH,
                tokenOut: USDC,
                fee: 3000,
                recipient: address(this),
                deadline: block.timestamp,
                amountIn: eth_donation,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
        });
        uint256 _donation = swapRouter.exactInputSingle(params);
        funders.push(msg.sender);
        isFunder[msg.sender] = true;
        totalFunds = totalFunds.add(_donation);
        totalRewards = totalRewards.add((_donation.mul(100 - platformFee)).div(100));
        _usdc.transfer(receipent, (_donation.mul(100 - platformFee)).div(100));
        _usdc.transfer(platformAddress, (_donation.mul(platformFee)).div(100));



    }


    /// function to donate bridged tokens into campaign and swap to the usdc then sends to the campaign
    function addBridgedUSDCFunds(uint256 _amountUsdc) public noReentrant {
        require(_amountUsdc > 0, "funds should be greater than 0");
        require(_usdcBridged.allowance(msg.sender, address(this)) >= _amountUsdc, "Not enough USDC approved");
        
        if (!isActive) revert FundingToContractEnded();
        // _usdcBridged.permit(sender, spender, _amountUsdc, _deadline, v, r, s);
        // TransferHelper.safeApprove(USDC_E,msg.sender,_amountUsdc);
        // TransferHelper.safeApprove(USDC_E,receipent,_amountUsdc);
        // TransferHelper.safeApprove(USDC_E,platformAddress,_amountUsdc);
        TransferHelper.safeTransferFrom(USDC_E, msg.sender, address(this), _amountUsdc);
        TransferHelper.safeApprove(USDC_E, address(swapRouter), _amountUsdc);

        IUniswapV3Pool pool = IUniswapV3Pool(0x2aB22ac86b25BD448A4D9dC041Bd2384655299c4);

        // ISwapRouter.ExactInputSingleParams memory params =
        //     ISwapRouter.ExactInputSingleParams({
        //         tokenIn: USDC_E,
        //         tokenOut: USDC,
        //         fee: pool.fee(),
        //         recipient: address(this),
        //         deadline: block.timestamp,
        //         amountIn: _amountUsdc,
        //         amountOutMinimum: 0,
        //         sqrtPriceLimitX96: sqrtPriceX96
        // });

        // uint256 _donation = swapRouter.exactInputSingle(params);
        ISwapRouter.ExactInputParams memory params =
            ISwapRouter.ExactInputParams({
                path: abi.encodePacked(USDC_E, pool.fee(), USDC),
                recipient: address(this),
                deadline: block.timestamp,
                amountIn: _amountUsdc,
                amountOutMinimum: 8000000
        });

        // Executes the swap.
        uint256 _donation  = swapRouter.exactInput(params);
        // address[] memory path = new address[](2);
        // path[0] = USDC_E;
        // path[1] = USDC;
        // address[2] memory paths = [address(USDC_E),address(USDC)];
        // uint256 _donation = swap2Router.swapExactTokensForTokens(_amountUsdc, 0, path, address(this), block.timestamp)[0];
        funders.push(msg.sender);
        isFunder[msg.sender] = true;
        totalFunds = totalFunds.add(_donation);
        totalRewards = totalRewards.add((_donation.mul(100 - platformFee)).div(100));
        _usdc.transfer(receipent, (_donation.mul(100 - platformFee)).div(100));
        _usdc.transfer(platformAddress, (_donation.mul(platformFee)).div(100));
        emit Values(receipent, totalFunds, totalRewards);
    }

    /// @notice external function to receive eth funds
    receive() external payable {
        addEthFunds();
    }

    ///@notice function to get all the funders who donated to this campaign
    function retrieveAllFunders() public view  returns(address[] memory){
        return funders;
    }

    /// @notice function to end campaign manually and only proposer or admin can do this
    function endCampaign() public onlyProposerOrAdmin {
        if(!isActive) revert("campaign is not active or already ended");
        isActive = false;
    }

    function voteToRevokePlatformAdmin(address _admin) public {
        require(isplatformAdmin[msg.sender], "you are not an platform admin to vote for revoke");
        revokeVotes[_admin] +=1;
        if(revokeVotes[_admin] >= (2 * totalPlatformAdmins) / 3) {
            finalRevoke(_admin);
        }
    }

    function finalRevoke(address _admin) private {
        isplatformAdmin[_admin] = false;
    }
}