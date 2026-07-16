import { test, expect } from '@playwright/test';

test('route abort { times: 1 } - 2nd fetch should not be aborted or hung', async ({ page }) => {
  await page.goto('/');

  await page.route('**/data', (route) => route.abort('timedout'), { times: 1 });
  // Below a reliable workaround
  // let alreadyAborted = false;
  // await page.route('**/data', async route => {
  //   if (alreadyAborted) {
  //     return route.continue();
  //   }
  //   alreadyAborted = true;
  //   return route.abort('timedout');
  // });

  const results = await page.evaluate(async () => {
    async function fetchOrHung(url: string) {
      const timeout = new Promise<string>(resolve => setTimeout(() => resolve('hung'), 3000));
      const request = fetch(url).then(r => String(r.status)).catch(() => 'aborted');
      return Promise.race([request, timeout]);
    }
    const first = await fetchOrHung('/data');
    const second = await fetchOrHung('/data');
    return [first, second];
  });

  console.log('results:', results);
  // Expected: ['aborted', '200']
  // Bug - orphaned: ['aborted', 'hung']   ← { times: 1 } captured 2nd request but left it pending
  // Bug - over-abort: ['aborted', 'aborted'] ← { times: 1 } aborted both requests

  expect(results[0]).toBe('aborted');
  expect(results[1]).toBe('200');
});
