const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

(async () => {
try {
  // Read the original index.html
  const htmlPath = path.join(__dirname, 'index.html');
  const cssPath = path.join(__dirname, 'dist/output.css');
  const distPath = path.join(__dirname, 'dist');
  
  // Ensure dist directory exists
  if (!fs.existsSync(distPath)) {
    fs.mkdirSync(distPath, { recursive: true });
  }
  
  if (!fs.existsSync(htmlPath)) {
    console.error('❌ index.html not found');
    process.exit(1);
  }
  
  if (!fs.existsSync(cssPath)) {
    console.error('❌ Compiled CSS not found. Run "npm run build:css" first.');
    process.exit(1);
  }
  
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');
  const cssContent = fs.readFileSync(cssPath, 'utf8');

  // Compile JSX components to plain JavaScript using esbuild
  console.log('📦 Compiling JSX components...');
  const components = [
    { src: 'src/lib/utils.js', out: 'dist/utils.js' },
    { src: 'src/components/shared/Icons.js', out: 'dist/Icons.js' },
    { src: 'src/components/shared/ErrorBoundary.js', out: 'dist/ErrorBoundary.js' },
    { src: 'src/components/auth/LoginPage.js', out: 'dist/LoginPage.js' },
    { src: 'src/components/admin/AdminPage.js', out: 'dist/AdminPage.js' },
    { src: 'src/components/admin/AllAnalysesPage.js', out: 'dist/AllAnalysesPage.js' },
    { src: 'src/components/admin/RoleManagementPage.js', out: 'dist/RoleManagementPage.js' },
    { src: 'src/components/user/UserPage.js', out: 'dist/UserPage.js' },
    { src: 'src/components/SentimentAnalyzer.js', out: 'dist/SentimentAnalyzer.js' },
    { src: 'src/lib/router.js', out: 'dist/router.js' },
    { src: 'src/App.js', out: 'dist/App.js' },
  ];

  for (const component of components) {
    const srcPath = path.join(__dirname, component.src);
    const outPath = path.join(__dirname, component.out);
    
    if (!fs.existsSync(srcPath)) {
      console.warn(`⚠️  Warning: ${component.src} not found, skipping...`);
      continue;
    }

    try {
      const result = await esbuild.build({
        entryPoints: [srcPath],
        bundle: false,
        format: 'iife',
        target: 'es2015',
        jsx: 'transform',
        outfile: outPath,
        loader: {
          '.js': 'jsx',
        },
        define: {
          'process.env.NODE_ENV': '"production"',
        },
      });
      console.log(`  ✓ Compiled ${component.src} → ${component.out}`);
    } catch (error) {
      console.error(`  ✗ Failed to compile ${component.src}:`, error.message);
      throw error;
    }
  }

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

  console.log('✅ Built index.html with compiled Tailwind CSS and JSX components');
} catch (error) {
  console.error('❌ Build error:', error.message);
  process.exit(1);
}
})();

