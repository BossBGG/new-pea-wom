const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env' });

const envConfig = {};
for (const key in process.env) {
  if (key.startsWith('NEXT_PUBLIC_')) {
    envConfig[key] = process.env[key];
  }
}

const fileContent = `window.__ENV__ = ${JSON.stringify(envConfig, null, 2)};`;
const filePath = path.join(__dirname, '..', 'public', 'env-config.js');

try {
  fs.writeFileSync(filePath, fileContent);
  console.log('Success: public/env-config.js has been created.');
} catch (error) {
  console.error('Error writing env-config.js:', error);
}