#!/usr/bin/env node

const puppeteer = require('puppeteer');
const path = require('path');

const DEFAULT_URL = 'http://localhost:5173';
const OUTPUT_FILE = 'presentation.pdf';

async function exportToPDF() {
    const url = process.argv[2] || DEFAULT_URL;
    const outputPath = process.argv[3] || path.join(process.cwd(), OUTPUT_FILE);

    console.log(`📄 Exporting PDF from: ${url}`);
    console.log(`📁 Output: ${outputPath}`);

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        channel: 'chrome', // Use installed Chrome instead of Chromium
    });

    try {
        const page = await browser.newPage();

        // Set viewport to 16:9 landscape (1920x1080)
        await page.setViewport({
            width: 1920,
            height: 1080,
            deviceScaleFactor: 2,
        });

        // Navigate and wait for content to load
        console.log('🔄 Loading page...');
        await page.goto(url, {
            waitUntil: 'networkidle0',
            timeout: 60000,
        });

        // Wait for Mermaid diagrams to render
        console.log('⏳ Waiting for diagrams to render...');
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Hide the export buttons for PDF
        await page.evaluate(() => {
            const buttons = document.querySelector('.no-print');
            if (buttons) buttons.style.display = 'none';
        });

        // Generate PDF
        console.log('📝 Generating PDF...');
        await page.pdf({
            path: outputPath,
            format: 'A4',
            landscape: true,
            printBackground: true,
            preferCSSPageSize: true,
            margin: { top: 0, right: 0, bottom: 0, left: 0 },
        });

        console.log(`✅ PDF exported successfully: ${outputPath}`);
    } catch (error) {
        console.error('❌ Export failed:', error.message);
        process.exit(1);
    } finally {
        await browser.close();
    }
}

exportToPDF();
