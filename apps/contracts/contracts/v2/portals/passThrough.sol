//SPDX-License-Identifier:MIT
pragma solidity ^0.8.0;

import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "../../helperContracts/safemath.sol";
import "../../helperContracts/ierc20_permit.sol";
import "../../helperContracts/ierc20_weth.sol";
import "../../helperContracts/ierc721.sol";
import "../../helperContracts/ierc1155.sol";
// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
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
    address public immutable platformAddress = 0x1f00DD750aD3A6463F174eD7d63ebE1a7a930d0c;
    /// @notice this will the percentage from totalFunds which goes to the platform address as Fee
    uint256 public  immutable platformFee;
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

    uint public minimumSlipageFeePercentage = 2; 
    /// @notice initializing the erc20 interface for usdc token
    IERC20Permit private _usdc;
    /// @notice initializing the erc20 interface for usdc bridged usdc token
    IERC20Permit private _usdcBridged;
    /// @notice initializing the interface for weth
    IWETH private _weth;
    /// @notice initializing swaprouter interface
    ISwapRouter public immutable swapRouter;

    /// @notice initializing brdiged usdc and usdc pool 
    IUniswapV3Pool public immutable bridgedUsdcPool;

    /// @notice initalizing eth and usdc pool
    IUniswapV3Pool public immutable ethUsdcPool;

    /// @notice initializing chainlink or oracle price aggregator
    AggregatorV3Interface public immutable ethPriceAggregator;
    

    /// @notice this is an usdc token address which will be assigned while deploying the contract.
    address public USDC;
    /// @notice this is an usdc token address which will be assigned while deploying the contract.
    address public USDC_E;
    /// @notice this is an Eth address which will be assigned while deploying the contract.
    address public WETH;
    /// @notice this mapping will be to track of votesToRevokePlatformAdmin for all the platformAdmins
    mapping(address => uint) public votesToRevokePlatformAdmin;
    /// @notice this mapping will be to track of votes to add platformAdmin for all the platformAdmins
    mapping(address => uint) public votesToAddPlatformAdmin;
    /// @notice to keep track of total platformAdmins
    uint256 public totalPlatformAdmins;
    /// @notice error indicating insufficient funds while funding to the contract.
    error NotEnoughFunds();
    /// @notice error indicating the funding to the contract has ended
    error FundingToContractEnded();

    /// @notice initializing the use of safemath
    using SafeMath for uint256;

    enum DonationType {
        GIFT,
        PAYMENT
    }
    enum TokenType {
        NFT,
        TOKEN
    }
    /// @notice Donation events triggered
    event Donation(address indexed donator ,address indexed token_or_nft, DonationType  indexed _donationType, TokenType _tokenType, uint256 amount);
    event Sender(address indexed _sender, uint256 indexed _amount);

    /// @notice constructor where we pass all the required parameters before deploying the contract
    /// @param _proposer who creates this campaign
    /// @param _platformAdmins array of address of platform admins
    /// @param _tokenUsdc contract address of usdc token , 0x0b2c639c533813f4aa9d7837caf62653d097ff85 for op
    /// @param _bridgedTokenUsdc contract address of usdc.e token , 0x7f5c764cbc14f9669b88837ca1490cca17c31607 for op
    /// @param _wethToken contract address of eth , 0x4200000000000000000000000000000000000006 for op
    /// @param _platformFee percentage of amount that goes to the platformAddess 
    /// @param _swapRouter interface for initiating swaps, op swaps router  0xE592427A0AEce92De3Edee1F18E0157C05861564
    /// @param _usdcToUsdcePool 0x2aB22ac86b25BD448A4D9dC041Bd2384655299c4 for optimism
    /// @param  _usdcToEthPool 0x1fb3cf6e48f1e7b10213e7b6d87d4c073c7fdb7b for optimism
    /// @param _ethPriceAggregator 0x13e3Ee699D1909E989722E753853AE30b17e08c5 for optimism
    constructor(
        address _proposer,
        address[] memory _platformAdmins,
        uint256 _platformFee,
        address _tokenUsdc,
        address _bridgedTokenUsdc,
        address _wethToken,
        address _swapRouter,
        address _usdcToUsdcePool,
        address _usdcToEthPool,
        address _ethPriceAggregator
    ) {

        proposer = _proposer;
        isProposer[_proposer] = true;
        totalPlatformAdmins = _platformAdmins.length;
        for(uint256 i=0; i<totalPlatformAdmins; i++) {
            platformAdmins.push(_platformAdmins[i]);
            isplatformAdmin[_platformAdmins[i]] = true;
        }
        receipent = _proposer;
        platformFee = _platformFee;
        isActive = true;
        _usdc = IERC20Permit(_tokenUsdc);
        _usdcBridged = IERC20Permit(_bridgedTokenUsdc);
        _weth = IWETH(_wethToken);
        USDC = _tokenUsdc;
        USDC_E = _bridgedTokenUsdc;
        WETH = _wethToken;
        swapRouter = ISwapRouter(_swapRouter);
        bridgedUsdcPool = IUniswapV3Pool(_usdcToUsdcePool);
        ethUsdcPool = IUniswapV3Pool(_usdcToEthPool);
        ethPriceAggregator = AggregatorV3Interface(_ethPriceAggregator);
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

    function recoverSigner(
        bytes32 _ethSignedMessageHash,
        bytes memory _signature
    ) public pure returns (address) {
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(_signature);

        return ecrecover(_ethSignedMessageHash, v, r, s);
    }

    function splitSignature(bytes memory sig)
        public
        pure
        returns (bytes32 r, bytes32 s, uint8 v)
    {
        require(sig.length == 65, "invalid signature length");

        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }
    }
    
    /// @notice function to donate the usdc tokens into the campaign
    function addUSDCFunds(address _sender, uint256 _amountUsdc, uint256 _deadline, uint256 _signature, bytes32 _ethSignedMessageHash ) public noReentrant  {
        require(_amountUsdc > 0, "funds should be greater than 0");
        if (!isActive) revert FundingToContractEnded();
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(_signature);
        _usdc.permit(_sender, address(this), _amountUsdc, _deadline, v, r, s);
        address sender = recoverSigner(_ethSignedMessageHash, _signature);
        TransferHelper.safeTransferFrom(USDC, sender, address(this), _amountUsdc);
        uint256 _donation = _amountUsdc;
        funders.push(msg.sender);
        isFunder[msg.sender] = true;
        totalFunds = totalFunds.add(_donation);
        totalRewards = totalRewards.add((_donation.mul(100 - platformFee)).div(100));
        _usdc.transfer(receipent, (_donation.mul(100 - platformFee)).div(100));
        _usdc.transfer(platformAddress, (_donation.mul(platformFee)).div(100));
        emit Donation(msg.sender,_nft,DonationType.GIFT,TokenType.NFT,_amount);
    }

    /// @notice function to donate eth into the campaign
    function addEthFunds(uint256 _amountOutMinimum) public noReentrant payable  {
        if (msg.value == 0) revert NotEnoughFunds();
        if (!isActive) revert FundingToContractEnded();
        uint256 eth_donation =  msg.value;
        _weth.deposit{value:msg.value}();
        _weth.approve(address(swapRouter), eth_donation);
        ISwapRouter.ExactInputParams memory params =
            ISwapRouter.ExactInputParams({
                path: abi.encodePacked(WETH, ethUsdcPool.fee(), USDC),
                recipient: address(this),
                deadline: block.timestamp,
                amountIn: eth_donation,
                amountOutMinimum: _amountOutMinimum
        });
        uint256 _donation = swapRouter.exactInput(params);
        funders.push(msg.sender);
        isFunder[msg.sender] = true;
        totalFunds = totalFunds.add(_donation);
        totalRewards = totalRewards.add((_donation.mul(100 - platformFee)).div(100));
        _usdc.transfer(receipent, (_donation.mul(100 - platformFee)).div(100));
        _usdc.transfer(platformAddress, (_donation.mul(platformFee)).div(100));
        emit Donation(msg.sender,WETH,DonationType.PAYMENT,TokenType.NFT,_donation);

    }

    function giftNfts(address _nft , uint256 _tokenId, uint256 _amount) public noReentrant {
        if (!isActive) revert FundingToContractEnded();
        IERC1155 nfts = IERC1155(_nft);
        nfts.safeTransferFrom(msg.sender,receipent, _tokenId, _amount,"");
        emit Donation(msg.sender,_nft,DonationType.GIFT,TokenType.NFT,_amount);
    }

    function giftNfts(address _nft , uint256 _tokenId) public noReentrant {
        if (!isActive) revert FundingToContractEnded();
        IERC721 nft = IERC721(_nft);
        nft.safeTransferFrom(msg.sender,receipent,_tokenId);
        emit Donation(msg.sender,_nft,DonationType.GIFT,TokenType.NFT,1);
    }


    function giftTokens(address _token, uint256 _amount) public noReentrant {
        if (!isActive) revert FundingToContractEnded();
        TransferHelper.safeTransferFrom(_token, msg.sender, receipent, _amount);
        emit Donation(msg.sender, _token, DonationType.GIFT, TokenType.TOKEN,_amount);

    }


    function  addTokenFunds(address _token , uint256 _amount , uint256 _minimumOutput,bytes memory paths) public noReentrant {
        require(_amount > 0, "funds should be greater than 0");
        if (!isActive) revert FundingToContractEnded();
        IERC20 token = IERC20(_token);
        require(token.allowance(msg.sender, address(this)) >= _amount, "Not enough Amount approved"); 
        TransferHelper.safeTransferFrom(_token, msg.sender, address(this), _amount);
        TransferHelper.safeApprove(_token, address(swapRouter), _amount);
        ISwapRouter.ExactInputParams memory params =
            ISwapRouter.ExactInputParams({
                path: paths,
                recipient: address(this),
                deadline: block.timestamp,
                amountIn: _amount,
                amountOutMinimum: _minimumOutput
        });
        uint256 _donation  = swapRouter.exactInput(params);

        funders.push(msg.sender);
        isFunder[msg.sender] = true;
        totalFunds = totalFunds.add(_donation);
        totalRewards = totalRewards.add((_donation.mul(100 - platformFee)).div(100));
        _usdc.transfer(receipent, (_donation.mul(100 - platformFee)).div(100));
        _usdc.transfer(platformAddress, (_donation.mul(platformFee)).div(100));
        emit Donation(msg.sender, _token, DonationType.PAYMENT, TokenType.TOKEN, _donation);        
    }



    /// function to donate bridged tokens into campaign and swap to the usdc then sends to the campaign
    function addBridgedUSDCFunds(uint256 _amountUsdc) public noReentrant {
        require(_amountUsdc > 0, "funds should be greater than 0");
        require(_usdcBridged.allowance(msg.sender, address(this)) >= _amountUsdc, "Not enough USDC approved"); 
        if (!isActive) revert FundingToContractEnded();
        TransferHelper.safeTransferFrom(USDC_E, msg.sender, address(this), _amountUsdc);
        TransferHelper.safeApprove(USDC_E, address(swapRouter), _amountUsdc);
        // IUniswapV3Pool pool = IUniswapV3Pool(0x2aB22ac86b25BD448A4D9dC041Bd2384655299c4);
        ISwapRouter.ExactInputParams memory params =
            ISwapRouter.ExactInputParams({
                path: abi.encodePacked(USDC_E, bridgedUsdcPool.fee(), USDC),
                recipient: address(this),
                deadline: block.timestamp,
                amountIn: _amountUsdc,
                amountOutMinimum: _amountUsdc.mul(100-minimumSlipageFeePercentage).div(100)
        });
        // Executes the swap.
        uint256 _donation  = swapRouter.exactInput(params);
        funders.push(msg.sender);
        isFunder[msg.sender] = true;
        totalFunds = totalFunds.add(_donation);
        totalRewards = totalRewards.add((_donation.mul(100 - platformFee)).div(100));
        _usdc.transfer(receipent, (_donation.mul(100 - platformFee)).div(100));
        _usdc.transfer(platformAddress, (_donation.mul(platformFee)).div(100));
        emit Donation(msg.sender, USDC_E, DonationType.PAYMENT, TokenType.TOKEN, _donation);
    }

    /// @notice external function to receive eth funds
    receive() external payable {
        uint ethValue = msg.value;
        uint decimals = ethPriceAggregator.decimals() - uint256(_usdc.decimals());
        (, int256 latestPrice , , ,)  = ethPriceAggregator.latestRoundData();
        uint price_in_correct_decimals = uint(latestPrice)/ (10 ** decimals);
        addEthFunds((ethValue / price_in_correct_decimals).mul(100-minimumSlipageFeePercentage).div(100));
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

    /// @notice function to revoke access for platform admin, it will be called in voteToRevokePlatformAdmin
    /// @param _admin address of platformAdmin to vote for revoke
    function finalRevokePlatformAdmin(address _admin) private {
        isplatformAdmin[_admin] = false;
        totalPlatformAdmins -= 1;
    }

    /// @notice function to add access for platform admin, it will be called in voteToAddPlatformAdmin
    /// @param _admin address of platformAdmin to vote for add
    function finalAddPlatformAdmin(address _admin) private {
        isplatformAdmin[_admin] = true;
        totalPlatformAdmins += 1;
    }

    /// @notice function to vote to add as a platformAdmin
    /// @param _admin is the address to vote for platform Admin
    function voteToAddPlatformAdmin(address _admin) public {
        require(isplatformAdmin[msg.sender], "you are not an platform admin to vote for revoke");
        require(!isplatformAdmin[_admin], "the address you want to vote is already a platform admin");
        votesToAddPlatformAdmin[_admin] +=1;
        if(votesToAddPlatformAdmin[_admin] >= (2 * totalPlatformAdmins) / 3) {
            finalAddPlatformAdmin(_admin);
        }
    }

    /// @notice function to vote to revoke as a platformAdmin
    /// @param _admin address of platformAdmin to vote for revoke
    function voteToRevokePlatformAdmin(address _admin) public {
        require(isplatformAdmin[msg.sender], "you are not an platform admin to vote for revoke");
        require(isplatformAdmin[_admin], "the address you want to vote is not a platform admin");
        votesToRevokePlatformAdmin[_admin] +=1;
        if(votesToRevokePlatformAdmin[_admin] >= (2 * totalPlatformAdmins) / 3) {
            finalRevokePlatformAdmin(_admin);
        }
    }


    /// @notice function to change slippage tolerance of other token donations
    /// @param _minimumSlipageFeePercentage of new minimumSlipageFeePercentage
    function changeMinimumSlipageFeePercentage(uint256 _minimumSlipageFeePercentage) public onlyProposerOrAdmin {
        minimumSlipageFeePercentage  = _minimumSlipageFeePercentage;
    } 
}