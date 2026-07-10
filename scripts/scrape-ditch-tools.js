import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = path.join(__dirname, '../data/ditch-raw-tools.json');

async function main() {
  console.log('🚀 Starting scraper for ditchthattextbook.com/ai-tools...');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 1000 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  
  const page = await context.newPage();
  
  try {
    // Navigate to the site
    console.log('Navigating to https://ditchthattextbook.com/ai-tools/...');
    await page.goto('https://ditchthattextbook.com/ai-tools/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // Wait for the content to be loaded
    await page.waitForSelector('h3', { timeout: 10000 });
    console.log('Page loaded. Extracting tools...');
    
    // Evaluate inside browser context
    const tools = await page.evaluate(() => {
      const extracted = [];
      
      // Select all content boxes that contain tool elements.
      // WordPress Thrive Architect wraps these blocks in .tve-cb (Content Boxes)
      const boxes = Array.from(document.querySelectorAll('.tve-cb'));
      
      for (const box of boxes) {
        // A box is a tool if it contains an h3 with an ID starting with 't-'
        const h3 = box.querySelector('h3');
        if (!h3) continue;
        
        const idAttr = h3.getAttribute('id') || '';
        if (!idAttr.startsWith('t-')) continue;
        
        const name = h3.textContent.trim();
        
        // Find image/screenshot/logo
        const img = box.querySelector('img');
        const imageUrl = img ? img.src || img.getAttribute('data-src') || '' : '';
        
        // Get all text content
        const pTags = Array.from(box.querySelectorAll('p, ul, li'));
        let description = '';
        let pricing = '';
        let howItWorks = '';
        
        // Loop over text elements to extract segments
        pTags.forEach(p => {
          const text = p.textContent.trim();
          if (!text) return;
          
          if (text.toLowerCase().startsWith('pricing and terms:') || text.toLowerCase().startsWith('pricing:')) {
            pricing = text;
          } else if (text.toLowerCase().startsWith('how it works:')) {
            howItWorks = text;
          } else if (
            !text.toLowerCase().startsWith('check it out:') &&
            !text.toLowerCase().startsWith('learn more:') &&
            !text.toLowerCase().startsWith('pricing and terms:') &&
            !text.toLowerCase().startsWith('pricing:') &&
            !text.toLowerCase().startsWith('how it works:') &&
            !text.toLowerCase().includes('brisk teaching is spot-on') && // comment noise
            text.length > 15
          ) {
            // Append description
            if (description) description += ' ';
            description += text;
          }
        });
        
        // Find links
        const aTags = Array.from(box.querySelectorAll('a'));
        let cleanUrl = '';
        
        for (const a of aTags) {
          const href = a.href || '';
          const hrefText = a.textContent.trim();
          
          // Exclude internal/social links
          if (
            href.includes('ditchthattextbook.com') ||
            href.includes('youtube.com') ||
            href.includes('facebook.com') ||
            href.includes('twitter.com') ||
            href.includes('pinterest.com') ||
            href.includes('gravatar.com')
          ) {
            continue;
          }
          
          // If the link text itself looks like a domain name, prefer it
          if (
            hrefText.includes('.') && 
            !hrefText.includes(' ') && 
            (hrefText.toLowerCase().includes('.com') || hrefText.toLowerCase().includes('.org') || hrefText.toLowerCase().includes('.ai') || hrefText.toLowerCase().includes('.io') || hrefText.toLowerCase().includes('.net') || hrefText.toLowerCase().includes('.app'))
          ) {
            cleanUrl = hrefText;
            // Prepend protocol if missing
            if (!cleanUrl.startsWith('http')) {
              cleanUrl = 'https://' + cleanUrl;
            }
            break;
          }
          
          // Fallback to the href if it's a real outbound url
          if (href.startsWith('http') && !href.includes('birdsend.net') && !href.includes('google.com/url')) {
            cleanUrl = href;
          }
        }
        
        // If we still don't have a clean URL, try to extract it from birdsend or similar redirect links if possible, or keep the redirect link
        if (!cleanUrl) {
          const redirectLink = aTags.find(a => a.href && (a.href.includes('birdsend.net') || a.href.includes('google.com/url')));
          if (redirectLink) {
            // Use the text as fallback domain
            const text = redirectLink.textContent.trim();
            if (text.includes('.') && !text.includes(' ')) {
              cleanUrl = 'https://' + text;
            } else {
              cleanUrl = redirectLink.href;
            }
          }
        }
        
        extracted.push({
          name,
          rawId: idAttr,
          url: cleanUrl,
          description: description.trim(),
          pricing: pricing.trim(),
          howItWorks: howItWorks.trim(),
          imageUrl
        });
      }
      
      return extracted;
    });
    
    console.log(`Successfully extracted ${tools.length} tools.`);
    
    // Save output
    const dataDir = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(tools, null, 2), 'utf-8');
    console.log(`Saved raw tools to ${OUTPUT_PATH}`);
    
  } catch (err) {
    console.error('❌ Error during scraping:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

main().catch(err => {
  console.error('Critical error:', err);
  process.exit(1);
});
