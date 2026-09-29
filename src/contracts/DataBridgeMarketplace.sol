// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title DataBridgeMarketplace
 * @dev Variant 2: Data DAO / Pool model. Buyers pay USDC, sellers claim accumulated earnings.
 */
contract DataBridgeMarketplace is Ownable {
    IERC20 public immutable usdc;
    address public treasury;
    uint256 public constant PLATFORM_FEE_PERCENT = 20;

    // Maps a user's wallet address to their unclaimed USDC earnings
    mapping(address => uint256) public claimableBalances;
    
    // Maps a data source ID (e.g. "twitter", "netflix") to the price per read
    mapping(string => uint256) public dataPrices;

    event DataPurchased(address indexed buyer, address indexed seller, string sourceId, uint256 amount);
    event EarningsClaimed(address indexed seller, uint256 amount);
    event TreasuryUpdated(address newTreasury);

    constructor(address _usdcAddress, address _treasury) Ownable(msg.sender) {
        usdc = IERC20(_usdcAddress);
        treasury = _treasury;
    }

    /**
     * @dev Called by Buyers to purchase data access from a specific User.
     * The buyer must approve the contract to spend USDC first.
     */
    function buyData(address seller, string calldata sourceId) external {
        uint256 price = dataPrices[sourceId];
        require(price > 0, "Data source not configured or disabled");

        // 1. Transfer USDC from Buyer to this contract
        require(usdc.transferFrom(msg.sender, address(this), price), "USDC transfer failed");

        // 2. Calculate Fee Split
        uint256 fee = (price * PLATFORM_FEE_PERCENT) / 100;
        uint256 sellerShare = price - fee;

        // 3. Immediately route the 20% fee to the Treasury (Your wallet)
        require(usdc.transfer(treasury, fee), "Fee transfer failed");

        // 4. Lock the remaining 80% in the contract for the Seller to claim later
        claimableBalances[seller] += sellerShare;

        emit DataPurchased(msg.sender, seller, sourceId, price);
    }

    /**
     * @dev Called by Sellers (Users) to withdraw their accumulated 80% earnings.
     * This is the "Claim" button on the Dashboard.
     */
    function claimEarnings() external {
        uint256 amount = claimableBalances[msg.sender];
        require(amount > 0, "No earnings to claim");

        claimableBalances[msg.sender] = 0;
        require(usdc.transfer(msg.sender, amount), "Claim transfer failed");

        emit EarningsClaimed(msg.sender, amount);
    }

    // Admin functions
    function setPrice(string calldata sourceId, uint256 price) external onlyOwner {
        dataPrices[sourceId] = price;
    }

    function setTreasury(address _treasury) external onlyOwner {
        treasury = _treasury;
        emit TreasuryUpdated(_treasury);
    }
}
