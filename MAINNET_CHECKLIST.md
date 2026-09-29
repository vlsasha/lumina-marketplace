# Lumina Mainnet Deployment Checklist

This document tracks critical steps that must be completed before or during the official launch on the Vana Mainnet. It also includes notes from our security architecture discussions.

## 1. Smart Contract Deployment
- [ ] Compile the final version of `LuminaMarketplace.sol` (ensuring `Pausable`, `ReentrancyGuard`, and `transferOwnership` are intact).
- [ ] Deploy the contract to Vana Mainnet (`rpc.vana.org`).
- [ ] Verify the contract source code on VanaScan so users can read it.

## 2. Security & Gnosis Safe (Multi-Sig)
- [ ] Go to [Safe (Gnosis)](https://app.safe.global/) and create a 3/5 Multi-Sig wallet on the Vana Network.
- [ ] Add the founder's wallets as signers.
- [ ] Call `transferOwnership(<Safe_Address>)` on the deployed Lumina contract.

## 3. Automated Monitoring & Telegram Bot (@vlsasha)
- [ ] Register an account on [Tenderly.co](https://tenderly.co/).
- [ ] Add the deployed Lumina contract address to Tenderly monitoring.
- [ ] Set up Alerts for:
  - Anomalous `claimEarnings` spikes (e.g., > 10 claims per minute).
  - High-value `buyData` transactions.
  - Failed transactions (to monitor if users are facing bugs).
- [ ] Create a Telegram Bot via BotFather.
- [ ] Connect Tenderly Webhooks to the Telegram Bot so it sends real-time push notifications to `@vlsasha`.
- [ ] Setup Auto-Pause rules (if available/required) to call `pause()` on suspicious activity.

## 4. Frontend Infrastructure & DDoS Protection (Cloudflare)
- [ ] Connect the main domain (e.g., `Lumina.vana`) to Cloudflare.
- [ ] Enable Cloudflare's "Under Attack Mode" (DDoS Protection) as a fallback.
- [ ] Ensure all API routes are rate-limited via Cloudflare to prevent spam bots from overloading the server.
- [ ] Deploy the Next.js frontend to Vercel with Cloudflare acting as the protective shield in front of it.

---

## 5. Security Architecture Notes (From our chat)
* **Why we don't have a "password" on the contract:** In Web3, the cryptographic Private Key (12 words) of the `owner` acts as the ultimate, unhackable password via the `onlyOwner` modifier.
* **How hacks happen & how we fixed it:** Hackers exploit logic flaws (like climbing through an open window). We "welded the windows shut" by implementing OpenZeppelin's `ReentrancyGuard` on all financial functions.
* **Why we need Cloudflare:** While the smart contract is protected by cryptography, the frontend website (React UI) can be targeted by DDoS attacks to make it freeze. Cloudflare acts as our digital bouncer to block malicious bots and fake traffic before they reach our users.
