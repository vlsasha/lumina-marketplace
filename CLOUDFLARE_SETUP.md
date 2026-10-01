# Lumina Cloudflare Protection Guide (WAF & DDoS)

To protect the Lumina Marketplace from DDoS attacks and scraping bots, we integrate Cloudflare in front of our Vercel deployment.

## Step 1: Add Domain to Cloudflare
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) and click **Add a Site**.
2. Enter your custom domain (e.g., `lumina-market.com`).
3. Select the **Free Plan**.
4. Cloudflare will scan your DNS records. Make sure the CNAME record pointing to `cname.vercel-dns.com` is there.
5. Change your nameservers at your domain registrar to the ones Cloudflare provides.

## Step 2: Configure Vercel & Cloudflare SSL (CRITICAL)
Vercel already issues SSL certificates. If you use Cloudflare's "Flexible" SSL, your site will go into an infinite redirect loop.
1. In Cloudflare, go to **SSL/TLS -> Overview**.
2. Change the encryption mode to **Full (Strict)**.
3. In Vercel Dashboard, go to your project **Settings -> Domains**. Make sure the domain is added.

## Step 3: Web Application Firewall (WAF) Rules
We want to protect our intensive endpoints (`/api/vana/data` and `/api/connections`) from Sybil attacks.
1. Go to **Security -> WAF** in Cloudflare.
2. Click **Create rule**.
3. **Rule 1: Block Bad Bots**
   - Field: `Known Bots`
   - Operator: `equals`
   - Value: `Off` (We want to block traffic that behaves like bots but isn't verified).
   - Action: `Managed Challenge (CAPTCHA)`
4. **Rule 2: Protect API Endpoints**
   - Field: `URI Path`
   - Operator: `contains`
   - Value: `/api/`
   - **AND**
   - Field: `Threat Score`
   - Operator: `greater than`
   - Value: `10`
   - Action: `Block`

## Step 4: Caching & Performance
1. Go to **Speed -> Optimization**.
2. Enable **Brotli** compression.
3. Turn **OFF** `Auto Minify` for JavaScript and CSS (Next.js already minifies this perfectly, doing it twice breaks React apps).

*Note: We have also added a custom software-level Rate Limiter in `src/middleware.ts` to block IPs that send more than 30 requests per minute to our API.*
