#!/usr/bin/env node

/**
 * Validate tools.json structure and URLs
 * 
 * Checks:
 * - JSON structure (required fields)
 * - jobToBeDone length (max 12 words)
 * - tip length (max 20 words)
 * - URL accessibility
 * - Screenshot URL accessibility
 * - Tags validity
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TOOLS_PATH = path.join(__dirname, '../data/tools.json');
const TIMEOUT = 5000;

// Color output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(color, ...args) {
  console.log(`${colors[color]}${args.join(' ')}${colors.reset}`);
}

function countWords(str) {
  return str.trim().split(/\s+/).length;
}

function validateUrl(urlString) {
  try {
    const url = new URL(urlString.startsWith('http') ? urlString : `https://${urlString}`);
    return url.toString();
  } catch {
    return null;
  }
}

async function checkUrlAccessible(urlString, timeout = TIMEOUT) {
  return new Promise((resolve) => {
    const url = new URL(urlString.startsWith('http') ? urlString : `https://${urlString}`);
    const protocol = url.protocol === 'https:' ? https : http;

    const request = protocol.request(url, { method: 'HEAD', timeout }, (res) => {
      resolve(res.statusCode >= 200 && res.statusCode < 400);
    });

    request.on('error', () => resolve(false));
    request.on('timeout', () => {
      request.destroy();
      resolve(false);
    });

    request.end();
  });
}

async function validateTool(tool) {
  const errors = [];
  const warnings = [];

  // Check required fields
  const requiredFields = ['id', 'name', 'jobToBeDone', 'screenshotUrl', 'url', 'tags', 'tip'];
  for (const field of requiredFields) {
    if (!tool[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // Validate jobToBeDone length
  if (tool.jobToBeDone) {
    const jobWords = countWords(tool.jobToBeDone);
    if (jobWords > 12) {
      warnings.push(`jobToBeDone has ${jobWords} words (max 12): "${tool.jobToBeDone}"`);
    }
  }

  // Validate tip length
  if (tool.tip) {
    const tipWords = countWords(tool.tip);
    if (tipWords > 20) {
      warnings.push(`tip has ${tipWords} words (max 20): "${tool.tip}"`);
    }
  }

  // Validate tags structure
  if (tool.tags) {
    if (!Array.isArray(tool.tags.lessonPhase)) {
      errors.push('tags.lessonPhase must be an array');
    } else if (tool.tags.lessonPhase.length === 0) {
      errors.push('tags.lessonPhase must have at least 1 item');
    }

    if (!Array.isArray(tool.tags.outputFormat)) {
      errors.push('tags.outputFormat must be an array');
    } else if (tool.tags.outputFormat.length === 0) {
      errors.push('tags.outputFormat must have at least 1 item');
    }

    const validCostTypes = ['Free', 'Freemium', 'Paid', 'Trial'];
    if (!validCostTypes.includes(tool.tags.costType)) {
      errors.push(`tags.costType must be one of: ${validCostTypes.join(', ')}`);
    }
  }

  // Validate URL format
  if (tool.url) {
    const normalizedUrl = validateUrl(tool.url);
    if (!normalizedUrl) {
      errors.push(`Invalid URL format: ${tool.url}`);
    }
  }

  // Validate screenshot URL format
  if (tool.screenshotUrl) {
    const normalizedScreenshotUrl = validateUrl(tool.screenshotUrl);
    if (!normalizedScreenshotUrl) {
      errors.push(`Invalid screenshot URL format: ${tool.screenshotUrl}`);
    }
  }

  // Check URL accessibility
  if (tool.url && validateUrl(tool.url)) {
    const urlAccessible = await checkUrlAccessible(tool.url);
    if (!urlAccessible) {
      warnings.push(`⚠️  URL not responding: ${tool.url}`);
    }
  }

  // Check screenshot accessibility
  if (tool.screenshotUrl && validateUrl(tool.screenshotUrl)) {
    const screenshotAccessible = await checkUrlAccessible(tool.screenshotUrl);
    if (!screenshotAccessible) {
      warnings.push(`⚠️  Screenshot URL not responding: ${tool.screenshotUrl}`);
    }
  }

  return { errors, warnings };
}

async function main() {
  try {
    // Read tools.json
    if (!fs.existsSync(TOOLS_PATH)) {
      log('red', '❌ Error: data/tools.json not found');
      process.exit(1);
    }

    const toolsContent = fs.readFileSync(TOOLS_PATH, 'utf-8');
    let tools;

    try {
      tools = JSON.parse(toolsContent);
    } catch (e) {
      log('red', '❌ Error: Invalid JSON in data/tools.json');
      log('red', e.message);
      process.exit(1);
    }

    if (!Array.isArray(tools)) {
      log('red', '❌ Error: tools.json must be an array');
      process.exit(1);
    }

    log('blue', `\n📋 Validating ${tools.length} tools...\n`);

    let totalErrors = 0;
    let totalWarnings = 0;

    // Validate each tool
    for (let i = 0; i < tools.length; i++) {
      const tool = tools[i];
      const { errors, warnings } = await validateTool(tool);

      if (errors.length > 0 || warnings.length > 0) {
        log('yellow', `\n[${i + 1}] ${tool.name || 'Unnamed Tool'}`);

        if (errors.length > 0) {
          totalErrors += errors.length;
          log('red', '  ❌ Errors:');
          errors.forEach(err => log('red', `     - ${err}`));
        }

        if (warnings.length > 0) {
          totalWarnings += warnings.length;
          log('yellow', '  ⚠️  Warnings:');
          warnings.forEach(warn => log('yellow', `     - ${warn}`));
        }
      }
    }

    // Summary
    log('blue', '\n' + '='.repeat(60));
    log('blue', `📊 Summary: ${tools.length} tools validated`);
    
    if (totalErrors === 0 && totalWarnings === 0) {
      log('green', '✅ All validations passed!');
      log('blue', '='.repeat(60) + '\n');
      process.exit(0);
    } else {
      if (totalErrors > 0) {
        log('red', `❌ ${totalErrors} error(s) found`);
      }
      if (totalWarnings > 0) {
        log('yellow', `⚠️  ${totalWarnings} warning(s) found`);
      }
      log('blue', '='.repeat(60) + '\n');

      if (totalErrors > 0) {
        process.exit(1);
      } else {
        process.exit(0);
      }
    }
  } catch (error) {
    log('red', '❌ Unexpected error:');
    log('red', error.message);
    process.exit(1);
  }
}

main();
