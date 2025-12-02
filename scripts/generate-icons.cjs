#!/usr/bin/env node

/**
 * Icon Generator for Rogue Bolt PWA
 * Generates PNG icons from SVG for PWA manifest
 *
 * Usage: node scripts/generate-icons.js
 * Requires: npm install sharp (optional, uses fallback if not available)
 */

const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 180, 192, 512];
const iconsDir = path.join(__dirname, '..', 'public', 'assets', 'icons');

// SVG template for icon generation
const generateSVG = (size) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e"/>
      <stop offset="100%" style="stop-color:#0a0a0f"/>
    </linearGradient>
    <linearGradient id="bolt" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ffdd00"/>
      <stop offset="50%" style="stop-color:#ff6b35"/>
      <stop offset="100%" style="stop-color:#ff2222"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${Math.round(size * 0.1875)}" fill="url(#bg)"/>
  <circle cx="${size/2}" cy="${size/2}" r="${size * 0.39}" fill="none" stroke="#4a9eff" stroke-width="${Math.max(1, size * 0.008)}" opacity="0.3"/>
  <path d="M${size * 0.586} ${size * 0.156} L${size * 0.352} ${size * 0.488} L${size * 0.469} ${size * 0.488} L${size * 0.391} ${size * 0.844} L${size * 0.664} ${size * 0.43} L${size * 0.527} ${size * 0.43} L${size * 0.586} ${size * 0.156} Z"
        fill="url(#bolt)" stroke="#ffffff" stroke-width="${Math.max(1, size * 0.008)}"/>
</svg>`;

async function generateIcons() {
  console.log('Generating PWA icons...');

  // Ensure icons directory exists
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }

  // Try to use sharp for PNG conversion
  let sharp;
  try {
    sharp = require('sharp');
  } catch (e) {
    console.log('Sharp not available, generating SVG icons only.');
    console.log('To generate PNG icons, run: npm install sharp');
  }

  for (const size of sizes) {
    const svgContent = generateSVG(size);
    const svgPath = path.join(iconsDir, `icon-${size}.svg`);

    // Always save SVG version
    fs.writeFileSync(svgPath, svgContent);
    console.log(`Created: icon-${size}.svg`);

    // Convert to PNG if sharp is available
    if (sharp) {
      try {
        const pngPath = path.join(iconsDir, `icon-${size}.png`);
        await sharp(Buffer.from(svgContent))
          .png()
          .toFile(pngPath);
        console.log(`Created: icon-${size}.png`);
      } catch (err) {
        console.error(`Failed to create icon-${size}.png:`, err.message);
      }
    }
  }

  console.log('Icon generation complete!');
}

generateIcons().catch(console.error);
