// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title LuminaMarketplace with Proof of Contribution (PoC)
 * @dev Decentralized API Marketplace for user-owned data on the Vana Network.
 * Integrates Proof of Contribution: Validators score datasets for authenticity and quality
 * before users can earn rewards from data buyers.
 */

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract LuminaMarketplace {
    address public owner;
    IERC20 public paymentToken;
    address public treasury;
    uint256 public protocolFeeBasisPoints = 2000; // 20%

    // --- Proof of Contribution (PoC) Storage ---
    mapping(address => bool) public isValidator; // Authorized AI Oracles / Nodes
    mapping(address => uint256) public providerPoCScores; // Cumulative quality score for a user
    mapping(bytes32 => bool) public processedDatasets; // Prevent double-scoring the same dataset hash
    
    // Financial Storage
    mapping(address => uint256) public providerBalances; // Unclaimed USDC.e

    // Events
    event Paused(address indexed account);
    event Unpaused(address indexed account);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event ValidatorAdded(address indexed validator);
    event ValidatorRemoved(address indexed validator);
    event ProofOfContributionSubmitted(address indexed provider, bytes32 datasetHash, uint256 score);
    event DataPurchased(address indexed buyer, uint256 totalAmount, uint256 totalDataProviders);
    event EarningsClaimed(address indexed provider, uint256 amount);

    // Reentrancy guard
    bool private _locked;
    modifier nonReentrant() {
        require(!_locked, "ReentrancyGuard: reentrant call");
        _locked = true;
        _;
        _locked = false;
    }

    // Circuit Breaker (Pausable)
    bool public paused;
    modifier whenNotPaused() {
        require(!paused, "Pausable: paused");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call");
        _;
    }

    modifier onlyValidator() {
        require(isValidator[msg.sender] || msg.sender == owner, "Only authorized validator can call");
        _;
    }

    constructor(address _paymentToken, address _treasury) {
        owner = msg.sender;
        paymentToken = IERC20(_paymentToken);
        treasury = _treasury;
        paused = false;
        
        // Owner is a validator by default for MVP
        isValidator[msg.sender] = true;
    }

    // --- Security Admin Functions ---
    /**
     * @dev Called by owner (or automated bot) to pause the contract in an emergency.
     */
    function pause() external onlyOwner {
        paused = true;
        emit Paused(msg.sender);
    }

    /**
     * @dev Called by owner to unpause the contract.
     */
    function unpause() external onlyOwner {
        paused = false;
        emit Unpaused(msg.sender);
    }

    // ==========================================
    // PROOF OF CONTRIBUTION LOGIC
    // ==========================================

    function setValidator(address validator, bool status) external onlyOwner {
        isValidator[validator] = status;
        if (status) {
            emit ValidatorAdded(validator);
        } else {
            emit ValidatorRemoved(validator);
        }
    }

    /**
     * @dev Called by a Validator Node after AI processes the user's dataset.
     * @param provider The user who uploaded the data
     * @param datasetHash The hash of the dataset to prevent duplicates
     * @param score The quality/authenticity score (e.g. 1-100)
     */
    function submitProofOfContribution(address provider, bytes32 datasetHash, uint256 score) external onlyValidator whenNotPaused {
        require(!processedDatasets[datasetHash], "Dataset already scored");
        require(score > 0, "Score must be positive");
        require(score <= 100, "Score exceeds maximum");

        processedDatasets[datasetHash] = true;
        providerPoCScores[provider] += score; // Increase user's overall reputation/score

        emit ProofOfContributionSubmitted(provider, datasetHash, score);
    }


    // ==========================================
    // MARKETPLACE LOGIC
    // ==========================================

    /**
     * @dev Buy data from multiple providers. 
     * Now requires providers to have a PoC Score > 0 (meaning their data is validated).
     */
    function buyData(address[] calldata providers, uint256[] calldata amounts) external nonReentrant whenNotPaused {
        require(providers.length == amounts.length, "Arrays length mismatch");
        require(providers.length <= 100, "Batch too large");

        uint256 totalPayment = 0;
        uint256 totalProtocolFee = 0;

        for (uint256 i = 0; i < providers.length; i++) {
            // PoC Check: Buyer can only purchase data from providers who have validated data
            require(providerPoCScores[providers[i]] > 0, "Provider has no validated PoC score");

            uint256 payment = amounts[i];
            totalPayment += payment;

            uint256 fee = (payment * protocolFeeBasisPoints) / 10000;
            uint256 providerShare = payment - fee;

            totalProtocolFee += fee;
            providerBalances[providers[i]] += providerShare;
        }

        require(paymentToken.transferFrom(msg.sender, address(this), totalPayment), "Transfer failed");

        // Send protocol fees directly to treasury
        if (totalProtocolFee > 0) {
            require(paymentToken.transfer(treasury, totalProtocolFee), "Fee transfer failed");
        }

        emit DataPurchased(msg.sender, totalPayment, providers.length);
    }

    function claimEarnings() external nonReentrant whenNotPaused {
        uint256 balance = providerBalances[msg.sender];
        require(balance > 0, "No earnings to claim");

        providerBalances[msg.sender] = 0;
        require(paymentToken.transfer(msg.sender, balance), "Transfer failed");

        emit EarningsClaimed(msg.sender, balance);
    }

    // ==========================================
    // ADMIN FUNCTIONS
    // ==========================================

    function setProtocolFee(uint256 _basisPoints) external onlyOwner {
        require(_basisPoints <= 5000, "Fee too high"); // Max 50%
        protocolFeeBasisPoints = _basisPoints;
    }

    function setTreasury(address _treasury) external onlyOwner {
        require(_treasury != address(0), "Invalid address");
        treasury = _treasury;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "New owner is the zero address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}
