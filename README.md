# Playwright Route { times: 1 } Bug Investigation

## Issue Description

When using `page.route()` with `{ times: 1 }` option and `route.abort()`, subsequent matching requests **may randomly fail** instead of passing through to the fallback handler.

## Setup

```bash
npm install
npm test                  # 10 repetitions from playwright config
npx playwright show-report
```

### Problem Pattern

In [repro.spec.ts](https://github.com/jesabot-cmyk/testPlaywrightIssue), a route is registered with `{ times: 1 }`.

```typescript
await page.route('**/data', route => route.abort('timedout'), { times: 1 });

const first = await fetchOrHung('/data');
const second = await fetchOrHung('/data');
```

Expected behavior:

results: [ 'aborted', '200' ]

Observed flaky behavior on few steps:

results: [ 'aborted', 'hung' ]

## Reliable Workaround (used in application)

Instead of `{ times: 1 }`, use manual flag-based counting:

```typescript
let alreadyAborted = false;
await page.route('**/data', async route => {
  if (alreadyAborted) {
    return route.continue();
  }
  alreadyAborted = true;
  return route.abort('timedout');
});
```
