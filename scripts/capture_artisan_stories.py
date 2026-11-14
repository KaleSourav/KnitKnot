import asyncio
import json
import urllib.request
import subprocess
import time
import base64
import os
import websockets

OUT_DIR = '/Users/souravkale/.gemini/antigravity/brain/4bc769d9-a42b-4e87-99f4-3ac3951aff3e'

async def capture_screenshots():
    chrome_proc = subprocess.Popen([
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        '--headless',
        '--disable-gpu',
        '--remote-debugging-port=9222',
        '--user-data-dir=/tmp/cdp-chrome-artisans',
        'http://localhost:3000/'
    ])
    
    await asyncio.sleep(2)
    
    try:
        res = urllib.request.urlopen('http://localhost:9222/json').read()
        tabs = json.loads(res.decode('utf-8'))
        page_tab = [t for t in tabs if t.get('type') == 'page'][0]
        ws_url = page_tab['webSocketDebuggerUrl']
        
        async with websockets.connect(ws_url, max_size=20*1024*1024) as ws:
            msg_id = 0
            async def send(method, params=None):
                nonlocal msg_id
                msg_id += 1
                payload = {'id': msg_id, 'method': method}
                if params: payload['params'] = params
                await ws.send(json.dumps(payload))
                while True:
                    resp = json.loads(await ws.recv())
                    if resp.get('id') == msg_id:
                        return resp.get('result', {})

            await send('Page.enable')
            await send('DOM.enable')
            
            # --- 1. DESKTOP VIEW (1280x950) ---
            await send('Emulation.setDeviceMetricsOverride', {
                'width': 1280,
                'height': 950,
                'deviceScaleFactor': 1,
                'mobile': False
            })
            
            # Wait 1s for hydration
            await asyncio.sleep(1)
            
            # Scroll to section-story
            await send('Runtime.evaluate', {
                'expression': 'document.getElementById("section-story").scrollIntoView();'
            })
            await asyncio.sleep(1)
            
            # Helper to capture screenshot
            async def take(filename):
                shot = await send('Page.captureScreenshot', {'format': 'png'})
                data = base64.b64decode(shot['data'])
                p = os.path.join(OUT_DIR, filename)
                with open(p, 'wb') as f:
                    f.write(data)
                print(f'Captured {filename} ({len(data)} bytes)')

            # Capture Chapter 1
            await take('artisan_desktop_chapter1.png')
            
            # Scroll to Chapter 2
            await send('Runtime.evaluate', {
                'expression': 'window.scrollBy({ top: 800, behavior: "instant" });'
            })
            await asyncio.sleep(0.8)
            await take('artisan_desktop_chapter2.png')
            
            # Scroll to Chapter 3
            await send('Runtime.evaluate', {
                'expression': 'window.scrollBy({ top: 850, behavior: "instant" });'
            })
            await asyncio.sleep(0.8)
            await take('artisan_desktop_chapter3.png')
            
            # Scroll to Chapter 4
            await send('Runtime.evaluate', {
                'expression': 'window.scrollBy({ top: 850, behavior: "instant" });'
            })
            await asyncio.sleep(0.8)
            await take('artisan_desktop_chapter4.png')
            
            # Scroll to 200+ Impact Card
            await send('Runtime.evaluate', {
                'expression': 'window.scrollBy({ top: 850, behavior: "instant" });'
            })
            await asyncio.sleep(0.8)
            await take('artisan_desktop_impact.png')
            
            # --- 2. MOBILE VIEW (390x844) ---
            await send('Emulation.setDeviceMetricsOverride', {
                'width': 390,
                'height': 844,
                'deviceScaleFactor': 2,
                'mobile': True
            })
            await asyncio.sleep(0.5)
            
            # Scroll to section-story header on mobile
            await send('Runtime.evaluate', {
                'expression': 'document.getElementById("section-story").scrollIntoView();'
            })
            await asyncio.sleep(0.8)
            await take('artisan_mobile_ch1.png')
            
            # Scroll down to Photo 2
            await send('Runtime.evaluate', {
                'expression': 'window.scrollBy({ top: 750, behavior: "instant" });'
            })
            await asyncio.sleep(0.8)
            await take('artisan_mobile_ch2.png')
            
            # Scroll down to Photo 3
            await send('Runtime.evaluate', {
                'expression': 'window.scrollBy({ top: 750, behavior: "instant" });'
            })
            await asyncio.sleep(0.8)
            await take('artisan_mobile_ch3.png')
            
            # Scroll down to Photo 4
            await send('Runtime.evaluate', {
                'expression': 'window.scrollBy({ top: 750, behavior: "instant" });'
            })
            await asyncio.sleep(0.8)
            await take('artisan_mobile_ch4.png')
            
            # Scroll down to 200+ card on mobile
            await send('Runtime.evaluate', {
                'expression': 'window.scrollBy({ top: 750, behavior: "instant" });'
            })
            await asyncio.sleep(0.8)
            await take('artisan_mobile_impact.png')
            
    finally:
        chrome_proc.terminate()
        print('All screenshots captured successfully!')

if __name__ == '__main__':
    asyncio.run(capture_screenshots())
