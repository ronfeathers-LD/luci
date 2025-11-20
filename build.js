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

  // Replace the Tailwind CDN script with inline CSS
  const updatedHtml = htmlContent
    .replace(
      '<script src="https://cdn.tailwindcss.com"></script>',
      `<style>${cssContent}</style>`
    );

  // Write the built HTML
  fs.writeFileSync(htmlPath, updatedHtml, 'utf8');

  console.log('✅ Built index.html with compiled Tailwind CSS');
} catch (error) {
  console.error('❌ Build error:', error.message);
  process.exit(1);
}

