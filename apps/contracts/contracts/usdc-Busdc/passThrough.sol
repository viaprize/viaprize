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
    address public proposer;
    mapping(address => bool) public isProposer;
    address[] public platformAdmins;
    mapping(address => bool) public isplatformAdmin;
    address public receipent;
    uint256 public platformFee;
    address public platformAddress;
    address[] public funders; 
    mapping(address => bool) public isFunder;
    mapping(address => uint256) public funderAmount;
    uint256 public totalFunds;
    uint256 public totalRewards;
    bool public isActive;
    bool internal locked;
    IERC20Permit private _usdc;
    IERC20Permit private _usdcBridged;
    IWETH private _weth;

    ISwapRouter public immutable swapRouter;

    IUniswapV2Router02 public immutable swap2Router;

    address public constant USDC = 0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85;

    address public constant USDC_E = 0x7F5c764cBc14f9669B88837ca1490cCa17c31607;

    address  public constant WETH = 0x4200000000000000000000000000000000000006;



    error NotEnoughFunds();
    error FundingToContractEnded();

    using SafeMath for uint256;

    event Values(
        address receipent,
        uint256 totalFunds,
        uint256 totalRewards
    );

    constructor(
        address _proposer,
        address[] memory _platformAdmins,
        address _token,
        address _bridgedToken,
        uint256 _platformFee
    ) {

        proposer = _proposer;

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
        _weth = IWETH(WETH);
        swapRouter = ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);
        swap2Router = IUniswapV2Router02(0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45);

    }

    modifier noReentrant() {
        require(!locked, "No cheat, No Re-entrancy");
        locked = true;
        _;
        locked = false;
    }

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


    receive() external payable {
        addEthFunds();
    }

    function retrieveAllFunders() public view  returns(address[] memory){
        return funders;
    }

    function endCampaign() public onlyProposerOrAdmin {
        if(!isActive) revert("campaign is not active or already ended");
        isActive = false;
    }
}