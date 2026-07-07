import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TOOLS_PATH = path.join(__dirname, '../data/tools.json');
const OUTPUT_PATH = path.join(__dirname, '../data/all-extracted-urls.json');

function cleanUrl(urlString) {
  let url = urlString.trim();
  url = url.split('?')[0];
  
  // Clean double protocols
  url = url.replace(/^https?:\/\/+https?:\/\/+/i, 'https://');
  url = url.replace(/^https?:\/\/+http:\/\/+/i, 'http://');
  url = url.replace(/^https?:\/\/+http\/+/i, 'http://');
  url = url.replace(/^https?:\/\/+https\/+/i, 'https://');
  
  // Fix missing colons or extra slashes
  url = url.replace(/^(https?)\/\/+/i, '$1://');
  
  if (url.startsWith('https') && !url.startsWith('https://')) {
    url = 'https://' + url.substring(5).replace(/^\/+/g, '');
  } else if (url.startsWith('http') && !url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'http://' + url.substring(4).replace(/^\/+/g, '');
  }
  
  // Prepend protocol if missing entirely
  if (!url.startsWith('http')) {
    url = `https://${url}`;
  }
  
  // Clean trailing slashes/symbols
  url = url.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]$/, '');
  
  return url;
}

async function main() {
  if (!fs.existsSync(TOOLS_PATH)) {
    console.error(`Erro: Arquivo ${TOOLS_PATH} não encontrado.`);
    process.exit(1);
  }

  const tools = JSON.parse(fs.readFileSync(TOOLS_PATH, 'utf-8'));
  
  // Filter tools with aggregated URLs
  const toolsToProcess = tools.filter(t => 
    t.url.includes('toptools4learning.com') || 
    t.url.includes('aieducator.tools')
  );
  
  console.log(`Encontradas ${toolsToProcess.length} ferramentas com URLs de agregadores para extração.`);

  if (toolsToProcess.length === 0) {
    console.log('Nenhuma ferramenta precisa de extração.');
    return;
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });

  const mappings = {};
  let successCount = 0;

  for (let i = 0; i < toolsToProcess.length; i++) {
    const tool = toolsToProcess[i];
    console.log(`[${i + 1}/${toolsToProcess.length}] Processando ${tool.name}...`);
    
    const page = await context.newPage();
    page.setDefaultTimeout(15000);

    try {
      await page.goto(tool.url, { waitUntil: 'domcontentloaded', timeout: 15000 });
      
      // Wait for React components to mount
      await page.waitForTimeout(3500);
      
      let extractedUrl = null;
      
      if (tool.url.includes('toptools4learning.com')) {
        // Strategy for toptools4learning: match "Website: [url]" or "Website [url]" at the start of a line
        const text = await page.evaluate(() => document.body.innerText);
        const match = text.match(/^\s*Website:?\s*([^\s\n\r]+)/mi);
        if (match) {
          extractedUrl = match[1];
        }
      } else if (tool.url.includes('aieducator.tools')) {
        // Strategy for aieducator.tools: find link with utm_source=aieducatortools
        extractedUrl = await page.evaluate(() => {
          const links = Array.from(document.querySelectorAll('a'));
          // 1. Look for direct outbound link containing utm_source
          for (const a of links) {
            if (a.href && a.href.includes('utm_source=aieducatortools')) {
              return a.href;
            }
          }
          // 2. Fallback: parent containing "by "
          for (const a of links) {
            const parent = a.parentElement;
            if (parent && parent.textContent.trim().startsWith('by ')) {
              return a.href;
            }
          }
          return null;
        });
      }

      if (extractedUrl) {
        const cleaned = cleanUrl(extractedUrl);
        mappings[tool.id] = cleaned;
        successCount++;
        console.log(`   ✅ Sucesso: ${tool.name} -> ${cleaned}`);
      } else if (tool.id === 'sparkli') {
        // Fallback for Sparkli (unclaimed on aieducator.tools, lacks outbound link)
        const cleaned = cleanUrl('https://sparkli.ai');
        mappings[tool.id] = cleaned;
        successCount++;
        console.log(`   ✅ Sucesso (Fallback Sparkli): Sparkli -> ${cleaned}`);
      } else {
        console.warn(`   ⚠️  Aviso: Não foi possível extrair a URL para ${tool.name}`);
      }
    } catch (err) {
      console.error(`   ❌ Erro ao acessar a página de ${tool.name}: ${err.message}`);
    } finally {
      await page.close();
    }
  }

  await browser.close();

  // Save the mappings to disk
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(mappings, null, 2), 'utf-8');
  console.log(`\nMapeamento de extração salvo em: ${OUTPUT_PATH}`);
  console.log(`Extrações com sucesso: ${successCount}/${toolsToProcess.length}`);

  // Now apply the fixes directly to tools.json
  let updatedCount = 0;
  const updatedTools = tools.map(t => {
    const mappedUrl = mappings[t.id];
    if (mappedUrl && t.url !== mappedUrl) {
      t.url = mappedUrl;
      updatedCount++;
    }
    return t;
  });

  fs.writeFileSync(TOOLS_PATH, JSON.stringify(updatedTools, null, 2), 'utf-8');
  console.log(`tools.json atualizado com ${updatedCount} novas URLs oficiais.`);
}

main().catch(err => {
  console.error('Erro crítico na execução:', err);
  process.exit(1);
});
