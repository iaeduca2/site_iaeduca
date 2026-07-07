import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TOOLS_PATH = path.join(__dirname, '../data/tools.json');
const OUTPUT_DIR = path.join(__dirname, '../public/images/tools');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function captureScreenshots() {
  // Read tools.json
  if (!fs.existsSync(TOOLS_PATH)) {
    console.error(`Erro: Arquivo ${TOOLS_PATH} não encontrado.`);
    process.exit(1);
  }

  const tools = JSON.parse(fs.readFileSync(TOOLS_PATH, 'utf-8'));
  
  // Find tools with default screenshot
  const toolsToProcess = tools.filter(tool => 
    !tool.screenshotUrl || 
    tool.screenshotUrl === '/images/tools/default.jpg' || 
    tool.screenshotUrl.endsWith('default.jpg')
  );

  console.log(`Encontradas ${toolsToProcess.length} ferramentas com imagem default.`);
  
  // Limit to first 100
  const batch = toolsToProcess.slice(0, 100);
  console.log(`Iniciando a captura das primeiras ${batch.length} ferramentas...\n`);

  if (batch.length === 0) {
    console.log('Nenhuma ferramenta para processar.');
    return;
  }

  // Launch Playwright Chromium
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });

  let processedCount = 0;
  let successCount = 0;

  for (const tool of batch) {
    processedCount++;
    console.log(`[${processedCount}/${batch.length}] Processando ${tool.name} (${tool.url})...`);

    const page = await context.newPage();
    
    // Set a default page timeout
    page.setDefaultTimeout(15000); // 15 seconds

    try {
      // Navigate to URL
      const targetUrl = tool.url.startsWith('http') ? tool.url : `https://${tool.url}`;
      await page.goto(targetUrl, { waitUntil: 'load', timeout: 15000 });
      
      // Wait a bit for dynamic content / animations to settle
      await page.waitForTimeout(2000);

      // Capture screenshot in-memory as Buffer
      const screenshotBuffer = await page.screenshot();

      // Path for final WebP image
      const webpFileName = `${tool.id}.webp`;
      const webpPath = path.join(OUTPUT_DIR, webpFileName);

      // Process image with sharp: resize to 640x400 (16:10) and output to WebP under 25KB
      await sharp(screenshotBuffer)
        .resize(640, 400, {
          fit: 'cover',
          position: 'top'
        })
        .webp({ quality: 65 })
        .toFile(webpPath);

      // Update tool model
      tool.screenshotUrl = `/images/tools/${webpFileName}`;
      successCount++;
      
      const fileSizeKb = (fs.statSync(webpPath).size / 1024).toFixed(2);
      console.log(`   ✅ Captura salva com sucesso: /images/tools/${webpFileName} (${fileSizeKb} KB)`);

    } catch (err) {
      console.error(`   ❌ Erro ao capturar ${tool.name}: ${err.message}`);
      // As per decision: log error, keep default.jpg, and proceed to next.
    } finally {
      await page.close();
    }
  }

  await browser.close();

  // Save updated tools.json
  fs.writeFileSync(TOOLS_PATH, JSON.stringify(tools, null, 2), 'utf-8');

  console.log(`\n==========================================`);
  console.log(`Processamento concluído.`);
  console.log(`Total tentado: ${batch.length}`);
  console.log(`Sucessos: ${successCount}`);
  console.log(`Falhas: ${batch.length - successCount}`);
  console.log(`==========================================\n`);
}

captureScreenshots().catch(err => {
  console.error('Erro crítico na execução:', err);
  process.exit(1);
});
