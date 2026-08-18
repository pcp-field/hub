# Course reminders — what works now, and what needs a server

This file documents the one part of the reminder system that cannot live on
GitHub Pages. Read the "Status today" table first — it is the honest summary of
what actually delivers a notification on each platform.

---

## Status today

| Delivery path | Needs a server? | Works on | Verified |
|---|---|---|---|
| **In-app alerts** — dashboard counters, Needs Attention list, status pills | No | Everything | Yes — 98 automated tests |
| **Notifications while the app is open** (or recently backgrounded) | No | Chrome, Edge, Firefox, Safari, Android, iOS 16.4+ after Add to Home Screen | Yes — full date matrix, dedup, renewal, deletion |
| **Periodic Background Sync** — service worker wakes itself while the app is closed | No | Chromium only (Android Chrome, Edge, desktop Chrome), and only once the app is **installed** | **Code is in place; not verified end to end.** See the caveat below |
| **Web Push** — server pushes to a closed app, including iPhone | **Yes** | Everywhere, including iOS 16.4+ installed to Home Screen | Not active — no server exists yet |

### Caveat on Periodic Background Sync

`periodicsync` is registered in `sw.js` and requested by the page once the user
enables notifications. It is genuinely server-free, but it comes with real
limits that should be stated plainly rather than sold as a daily alarm:

- **Chromium only.** Firefox and Safari do not implement it. It does not exist
  on iPhone in any form.
- **Installed apps only.** The site must be added to the home screen / installed.
- **The browser decides when it runs**, based on how often the app is used and
  the state of the network and battery. The minimum interval requested here is
  12 hours; the browser may run it less often, or not at all for an app the user
  rarely opens.
- It could not be exercised in the automated test run: a headless browser cannot
  install a PWA or simulate the engagement heuristics Chrome uses to schedule
  the event. The code path is written and syntax-checked, but treat it as
  best-effort until confirmed on a real installed Android device.

**Because of all this, the only reminder path that can be promised on an iPhone
today is: notifications appear when the app is opened.** The UI in the app says
exactly that, and does not claim otherwise.

---

## What real Web Push requires

Three pieces, only one of which is missing:

1. **A service worker with a `push` handler** — already done (`sw.js`).
2. **A client that subscribes and sends its subscription somewhere** — already
   written, dormant. It activates the moment `window.PCP_PUSH_CONFIG` is set.
3. **A server that stores subscriptions and sends the pushes on a schedule** —
   this does not exist and cannot run on GitHub Pages, which serves static files
   only.

### Turning the client on

Add this to `index.html` **before** the `pcp-course-notify-engine` script:

```html
<script>
  window.PCP_PUSH_CONFIG = {
    publicKey: "PASTE-YOUR-VAPID-PUBLIC-KEY",
    subscribeUrl: "https://your-worker.example.com/subscribe"
  };
</script>
```

Only the **public** VAPID key goes here. It is designed to be published.

> **Never put the VAPID private key, a Firebase server key, or any admin secret
> in `index.html` or `sw.js`.** Everything in this repository is world-readable
> at `https://pcp-field.github.io/hub/`. A leaked private key lets anyone send
> notifications to every subscriber.

### Choosing a backend

**Option A — Cloudflare Workers + Cron Triggers (recommended).** Free tier
covers this workload comfortably, it is a single small file, and cron scheduling
is built in. Roughly:

- `POST /subscribe` — store the subscription JSON in Workers KV.
- A cron trigger (say `0 6 * * *`) — walk the stored subscriptions, work out
  which courses cross a threshold today, and send a Web Push with the same JSON
  shape `sw.js` already expects:

```json
{
  "title": "Course Renewal Reminder",
  "body": "Ahmed Al Bakri – H2S\nExpires in 7 days\nExpiry: 20 Sep 2026",
  "tag": "pcp-course-<courseId>-7",
  "courseId": "<courseId>",
  "employeeId": "<employeeId>"
}
```

The VAPID private key goes in a Worker secret (`wrangler secret put
VAPID_PRIVATE_KEY`), never in the repository.

**Option B — Firebase Cloud Functions.** The project already has a Firebase
project (`well-location-saver`) used by the Well Location page, so this keeps
everything in one console. Two things to know before choosing it: scheduled
functions require the **Blaze (pay-as-you-go) plan**, and course data currently
lives in each device's `localStorage`, not in Firestore — so the server would
have nothing to read from.

### The prerequisite behind both options

A push server has to know when a course expires. Right now only the phone or
laptop that entered the course knows that; courses are stored per-device in
`localStorage`. **Courses and employees must move to Firestore before any server
can send reminders.** That migration is the real first step — the push server is
straightforward once the data is somewhere a server can read.

That same migration is also what would make the Courses page work across
devices, which is a separate open item from the earlier persistence audit.

---

## Files

| File | Role |
|---|---|
| `index.html` | Reminder engine, in-app alerts, settings UI, permission flow, dormant push subscription |
| `sw.js` | Notification click routing, `periodicsync` sweep, `push` handler. Must sit next to `index.html`; a service worker cannot be inlined |
| `manifest.webmanifest` | Makes the app installable — required for Periodic Background Sync, and for notifications of any kind on iPhone |

All three must be uploaded together. Uploading `index.html` alone leaves the
service worker missing, and notifications fall back to page-owned ones that stop
working as soon as the tab closes.
