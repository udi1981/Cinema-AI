<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/7c174cf5-03c0-4e3e-b795-7c78e4c153cd

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Accessing from your phone

The app supports mobile layouts out of the box. If you want to use it on your
phone without fighting with your local network or firewall, run it through a
free Cloudflare Quick Tunnel:

```
npm run tunnel
```

This starts the Vite dev server and `cloudflared` together. After a few
seconds Cloudflare will print a public HTTPS URL that looks like
`https://<random-words>.trycloudflare.com` — open that URL on your phone and
the app will work from anywhere (including on cellular data).

**One-time setup — install the `cloudflared` CLI:**

- **macOS:** `brew install cloudflared`
- **Windows:** `winget install --id Cloudflare.cloudflared`
- **Linux / other:** download from
  https://github.com/cloudflare/cloudflared/releases

No Cloudflare account is required for Quick Tunnels.

**Notes:**

- Your computer must stay on and running `npm run tunnel` while you use the
  app on your phone — this is a tunnel to your local machine, not a deployment.
- Press `Ctrl+C` to stop both the dev server and the tunnel together.
- Your `GEMINI_API_KEY` stays in `.env.local` on your machine. Cloudflare only
  forwards HTTPS traffic to `localhost:3000`; it never sees your key.
- The generated URL is public. Anyone who gets the URL can use the app (and
  your Gemini quota) until you stop the tunnel, so don't share it publicly.
