# Offline & PWA Behavior

## Overview

Anathema is a Progressive Web App (PWA) with offline support for Pass & Play.

## What Works Offline

After loading the app **once while online**:

- **App shell** – HTML, JS, CSS bundles
- **Pass & Play** – full game flow: deck selection, rounds, scoring, sounds
- **Navigation** – mode selection, /play, /play/pass-and-play
- **Decks** – bundled into the app; no network fetch needed

## What Requires Internet

- **Local Multiplayer** – create room, join room, realtime sync
- All Supabase API calls

## UX When Offline

- A compact banner appears: "You're offline. Pass & Play is still available."
- On Local Multiplayer intro: "Local Multiplayer needs internet to sync both devices. You're offline—try Pass & Play instead."
- Create/Join room buttons are disabled when offline.

## Cache Strategy

| Resource        | Strategy   | Notes                          |
|----------------|------------|--------------------------------|
| App shell      | Precache   | index.html, JS, CSS            |
| Static assets  | Precache   | icons, manifest, fonts         |
| Supabase API   | NetworkOnly| Never cached                   |
| Decks          | Bundled    | In JS bundle, no separate fetch|

## Testing Offline

1. Open the app in a browser while online.
2. Wait for the service worker to register (check DevTools → Application → Service Workers).
3. In DevTools → Network, enable "Offline".
4. Refresh the page. The app should load from cache.
5. Go to Pass & Play and play a round. It should work without network.

## Flutter WebView Compatibility

The app is designed to work inside a Flutter WebView:

- Offline caching works; no reliance on browser install UI.
- Service worker and precache behave normally.
- Pass & Play remains usable with flaky connectivity.
- Use a WebView that supports service workers (e.g. `webview_flutter` with proper config).

## PWA Icons

The default setup uses `placeholder.svg`. For better installability on all devices, add:

- `public/icon-192.png` (192×192)
- `public/icon-512.png` (512×512)

Then update `vite.config.ts` manifest icons to reference these files.
