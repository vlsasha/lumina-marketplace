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

## 6. Web3 UX & Transaction Reliability Architecture (Hybrid Indexer)
* **The Problem:** Standard Web3 apps rely on the user's browser waiting for blockchain confirmation (`receipt`). If the user closes the tab early or the network lags, the database is never updated, resulting in lost purchases.
* **Optimistic UI:** When a user signs a transaction, the frontend immediately records a `pending` state in the database and shows a success message. The user can safely navigate away instantly.
* **Lazy Cron (Background Verification):** Since Vercel Hobby limits traditional Cron Jobs, we implemented a "Lazy Cron". Whenever a user visits the Dashboard, a silent background API route (`/api/cron/verify-purchases`) fires. It scans the database for `pending` transactions and queries the Vana RPC directly. If the transaction was successfully mined, it flips the status to `completed`.
* **Security (Backend Enforcement):** The frontend UI and download API strictly require a `completed` status. This prevents malicious actors from spoofing the API with fake transaction hashes to steal data. Our backend acts as the single source of truth.
