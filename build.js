const fs = require('fs');
const path = require('path');

try {
  // Read the original index.html
  const htmlPath = path.join(__dirname, 'index.html');
  const cssPath = path.join(__dirname, 'dist/output.css');
  
  if (!fs.existsSync(htmlPath)) {
    console.error('❌ index.html not found');
    process.exit(1);
  }
  
  if (!fs.existsSync(cssPath)) {
    console.error('❌ Compiled CSS not found. Run "npm run build" first.');
    process.exit(1);
  }
  
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');
  const cssContent = fs.readFileSync(cssPath, 'utf8');

  // Generate build timestamp and version
  const buildTimestamp = Date.now();
  const buildVersion = process.env.VERCEL_GIT_COMMIT_SHA?.substring(0, 7) || buildTimestamp.toString(36);

  // Replace the Tailwind CDN script with inline CSS, or replace existing style tag
  let updatedHtml = htmlContent;
  
  // First, try to replace existing style tag (if it contains Tailwind CSS)
  if (htmlContent.includes('<style>') && htmlContent.includes('tailwindcss')) {
    // Replace the first style tag that contains tailwindcss
    updatedHtml = updatedHtml.replace(
      /<style>[\s\S]*?tailwindcss[\s\S]*?<\/style>/,
      `<style>${cssContent}</style>`
    );
  } else if (htmlContent.includes('<script src="https://cdn.tailwindcss.com"></script>')) {
    // Replace the Tailwind CDN script with inline CSS
    updatedHtml = updatedHtml.replace(
      '<script src="https://cdn.tailwindcss.com"></script>',
      `<style>${cssContent}</style>`
    );
  } else {
    // If neither exists, inject before closing </head>
    updatedHtml = updatedHtml.replace(
      '</head>',
      `<style>${cssContent}</style>\n  </head>`
    );
  }

  // Inject build version and timestamp into HTML
  // Add version meta tag if it doesn't exist, or update it
  if (updatedHtml.includes('data-build-version')) {
    updatedHtml = updatedHtml.replace(
      /data-build-version="[^"]*"/,
      `data-build-version="${buildVersion}"`
    );
    updatedHtml = updatedHtml.replace(
      /data-build-timestamp="[^"]*"/,
      `data-build-timestamp="${buildTimestamp}"`
    );
  } else {
    // Insert after viewport meta tag
    updatedHtml = updatedHtml.replace(
      '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
      `<meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="build-version" content="${buildVersion}">
  <meta name="build-timestamp" content="${buildTimestamp}">`
    );
    // Also add data attributes to html tag for easy access
    updatedHtml = updatedHtml.replace(
      '<html lang="en">',
      `<html lang="en" data-build-version="${buildVersion}" data-build-timestamp="${buildTimestamp}">`
    );
  }

  // Write the built HTML
  fs.writeFileSync(htmlPath, updatedHtml, 'utf8');

  console.log('✅ Built index.html with compiled Tailwind CSS');
} catch (error) {
  console.error('❌ Build error:', error.message);
  process.exit(1);
}

