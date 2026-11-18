import { spawn } from 'child_process';
import fs from 'fs/promises';
import WebSocket from 'ws';

const port = 9977;
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
  '--headless',
  `--remote-debugging-port=${port}`,
  '--disable-gpu',
  '--no-sandbox',
  `--user-data-dir=/tmp/chrome_prof_${Date.now()}`,
]);

try {
  let target;
  for (let attempt = 0; attempt < 40; attempt++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/new?http://localhost:3000`, { method: 'PUT' });
      if (res && res.ok) {
        target = await res.json();
        break;
      }
    } catch {
      await new Promise(r => setTimeout(r, 250));
    }
  }

  if (!target) throw new Error('Could not connect to Chrome CDP');
  console.log('Opened target:', target.title, target.url);

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  let id = 1;
  const pending = new Map();
  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg.result);
      pending.delete(msg.id);
    }
  };

  const send = (method, params = {}) => new Promise((resolve) => {
    const reqId = id++;
    pending.set(reqId, resolve);
    ws.send(JSON.stringify({ id: reqId, method, params }));
  });

  await new Promise(r => ws.onopen = r);

  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 2,
    mobile: false,
  });

  await new Promise(r => setTimeout(r, 1500));

  // Navigate to bouquet builder by clicking navbar button
  await send('Runtime.evaluate', {
    expression: `
      const btn = Array.from(document.querySelectorAll('button, a')).find(el => el.textContent && el.textContent.includes('Make a Bouquet'));
      if (btn) btn.click();
      else window.location.hash = '#build-your-bouquet';
    `
  });
  await new Promise(r => setTimeout(r, 1800));

  // Screenshot 1: Empty boutique stage
  const ss1 = await send('Page.captureScreenshot', { format: 'png' });
  await fs.writeFile('public/step1_empty_boutique_v3.png', Buffer.from(ss1.data, 'base64'));
  console.log('Captured step 1: empty boutique');

  // Add 4 flowers by clicking the crates
  await send('Runtime.evaluate', {
    expression: `
      const crateDivs = Array.from(document.querySelectorAll('div.group.flex-shrink-0'));
      if (crateDivs[0]) crateDivs[0].click();
      if (crateDivs[1]) crateDivs[1].click();
      if (crateDivs[2]) crateDivs[2].click();
      if (crateDivs[3]) crateDivs[3].click();
    `
  });
  await new Promise(r => setTimeout(r, 1400));

  // Screenshot 2: Flowers added on open sheet
  const ss2 = await send('Page.captureScreenshot', { format: 'png' });
  await fs.writeFile('public/step2_flowers_sheet_v3.png', Buffer.from(ss2.data, 'base64'));
  console.log('Captured step 2: flowers added');

  // Select ribbon bow (e.g. Orange Satin)
  await send('Runtime.evaluate', {
    expression: `
      const bowBtns = Array.from(document.querySelectorAll('button')).filter(b => b.title && b.title.includes('Choose'));
      if (bowBtns[0]) bowBtns[0].click();
    `
  });
  await new Promise(r => setTimeout(r, 1400));

  // Screenshot 3: Wrapped bouquet on counter
  const ss3 = await send('Page.captureScreenshot', { format: 'png' });
  await fs.writeFile('public/step3_wrapped_counter_v3.png', Buffer.from(ss3.data, 'base64'));
  console.log('Captured step 3: wrapped');

  // Open note modal
  await send('Runtime.evaluate', {
    expression: `
      const noteBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Write Note'));
      if (noteBtn) noteBtn.click();
    `
  });
  await new Promise(r => setTimeout(r, 1200));

  // Screenshot 4: Note modal
  const ss4 = await send('Page.captureScreenshot', { format: 'png' });
  await fs.writeFile('public/step4_note_modal_v3.png', Buffer.from(ss4.data, 'base64'));
  console.log('Captured step 4: note modal');

  // Tuck note and open checkout
  await send('Runtime.evaluate', {
    expression: `
      const tuckBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Tuck it in'));
      if (tuckBtn) tuckBtn.click();
    `
  });
  await new Promise(r => setTimeout(r, 800));

  await send('Runtime.evaluate', {
    expression: `
      const sendBtns = Array.from(document.querySelectorAll('button')).filter(b => b.textContent && b.textContent.includes('SEND FLOWERS'));
      if (sendBtns[0]) sendBtns[0].click();
    `
  });
  await new Promise(r => setTimeout(r, 1200));

  // Screenshot 5: Checkout modal
  const ss5 = await send('Page.captureScreenshot', { format: 'png' });
  await fs.writeFile('public/step5_checkout_modal_v3.png', Buffer.from(ss5.data, 'base64'));
  console.log('Captured step 5: checkout modal');

  ws.close();
} catch (err) {
  console.error('Error during CDP:', err);
} finally {
  chrome.kill();
}
