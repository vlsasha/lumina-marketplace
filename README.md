# DataBridge — API Marketplace for Vana Data

> **Access user-owned data through one unified API.** Built on [Vana](https://vana.org)'s decentralized protocol.

## 🚀 Features

- **10 Data Sources** — ChatGPT, GitHub, Instagram, LinkedIn, Spotify, YouTube, Amazon, Claude, iCloud Notes, Oura Ring
- **35+ Data Scopes** — Granular access to specific data types per source
- **User-Owned Data** — Users approve data access through Vana's consent flow
- **Server-Side Caching** — Minimize paid reads with intelligent caching
- **Dark Theme UI** — SpaceX-inspired dark design, fully mobile-responsive
- **Vana SDK Integration** — Direct integration with `@opendatalabs/vana-sdk`

## 📦 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Blockchain**: Vana Mainnet (Chain ID: 1480) / Moksha Testnet (Chain ID: 14800)
- **SDK**: `@opendatalabs/vana-sdk`

## 🛠 Setup

### Prerequisites

- Node.js 22+ (required by Vana SDK)
- npm or yarn

### Installation

```bash
git clone <repo-url>
cd databridge
npm install
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```env
VANA_APP_PRIVATE_KEY=0x_your_private_key    # From account.vana.org/developers
VANA_APP_URL=http://localhost:3000
VANA_ENV=production
VANA_NETWORK=moksha                          # or mainnet
VANA_MODE=sample                             # or live
```

### Create App Identity

1. Go to [account.vana.org/developers](https://account.vana.org/developers)
2. Create or register an app identity
3. Copy the private key to `VANA_APP_PRIVATE_KEY`
4. Fund the escrow (VANA on Moksha, USDC.e on Mainnet)

### Run

```bash
npm run dev        # Development server at http://localhost:3000
npm run build      # Production build
npm start          # Production server
```

## 📁 Project Structure

```
databridge/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── sources/route.ts        # GET all available sources
│   │   │   └── vana/
│   │   │       ├── request/route.ts    # POST create data request
│   │   │       ├── status/route.ts     # GET check request status
│   │   │       └── data/route.ts       # GET read approved data
│   │   ├── connect/return/page.tsx     # Vana approval return handler
│   │   ├── dashboard/page.tsx          # User dashboard
│   │   ├── docs/page.tsx               # API documentation
│   │   ├── sources/page.tsx            # Data sources listing
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx                    # Landing page
│   ├── components/
│   │   ├── ApiPreview.tsx
│   │   ├── CTASection.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── HeroSection.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── SourceCard.tsx
│   │   ├── SourcesGrid.tsx
│   │   └── StatsSection.tsx
│   └── lib/
│       ├── data-sources.ts             # All 10 data source configs
│       └── vana.ts                     # Vana SDK integration
├── public/
│   └── manifest.json
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── next.config.js
```

## 🔗 API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/vana/request` | Create a data connection request |
| `GET` | `/api/vana/status` | Check request approval status |
| `GET` | `/api/vana/data` | Read approved data (cached) |
| `GET` | `/api/sources` | List all available data sources |

## 🌐 Networks

| | Moksha (Testnet) | Mainnet |
|---|---|---|
| Chain ID | 14800 | 1480 |
| Explorer | [moksha.vanascan.io](https://moksha.vanascan.io) | [vanascan.io](https://vanascan.io) |
| Fee Asset | VANA | USDC.e |
| Faucet | [faucet.vana.com/moksha](https://faucet.vana.com/moksha) | — |

## 📄 License

MIT
