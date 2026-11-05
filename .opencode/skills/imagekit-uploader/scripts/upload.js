const fs = require('fs');
const path = require('path');
const https = require('https');

// Helper to load and parse .env manually
function loadEnv() {
  const envPaths = [
    path.join(process.cwd(), '.env'),
    path.join(__dirname, '../../../../.env'), // traversed up from 08-system/081-agents/.rulesync/skills/...
  ];

  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      const lines = content.split('\n');
      for (const line of lines) {
        const match = line.match(/^\s*([\w\.\-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
          let key = match[1];
          let value = match[2] ? match[2].trim() : '';
          // Strip quotes
          if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
          if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
          process.env[key] = value;
        }
      }
      return envPath;
    }
  }
  return null;
}

// Function to construct multipart/form-data body manually
function buildMultipartBody(fileBuffer, fileName, folder, boundary, tags = '') {
  const chunks = [];

  // 1. Append file parameter
  chunks.push(Buffer.from(`--${boundary}\r\n`));
  chunks.push(Buffer.from(`Content-Disposition: form-data; name="file"; filename="${fileName}"\r\n`));
  chunks.push(Buffer.from(`Content-Type: application/octet-stream\r\n\r\n`));
  chunks.push(fileBuffer);
  chunks.push(Buffer.from(`\r\n`));

  // 2. Append fileName parameter
  chunks.push(Buffer.from(`--${boundary}\r\n`));
  chunks.push(Buffer.from(`Content-Disposition: form-data; name="fileName"\r\n\r\n`));
  chunks.push(Buffer.from(`${fileName}\r\n`));

  // 3. Append folder parameter
  chunks.push(Buffer.from(`--${boundary}\r\n`));
  chunks.push(Buffer.from(`Content-Disposition: form-data; name="folder"\r\n\r\n`));
  chunks.push(Buffer.from(`${folder}\r\n`));

  // 4. Append tags parameter if present
  if (tags) {
    chunks.push(Buffer.from(`--${boundary}\r\n`));
    chunks.push(Buffer.from(`Content-Disposition: form-data; name="tags"\r\n\r\n`));
    chunks.push(Buffer.from(`${tags}\r\n`));
  }

  // End boundary
  chunks.push(Buffer.from(`--${boundary}--\r\n`));

  return Buffer.concat(chunks);
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.error('Utilização: node upload.js <local-file-path> [virtual-folder-path]');
    process.exit(1);
  }

  const localFilePath = path.resolve(args[0]);
  const folder = args[1] || '/';
  const tags = args[2] || '';

  if (!fs.existsSync(localFilePath)) {
    console.error(`Erro: O ficheiro local não existe em: ${localFilePath}`);
    process.exit(1);
  }

  // Load environment credentials
  const loadedPath = loadEnv();
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

  if (!privateKey || !urlEndpoint) {
    console.error('Erro: Credenciais do ImageKit não encontradas no ficheiro .env.');
    if (loadedPath) {
      console.error(`Ficheiro .env lido de: ${loadedPath}`);
    }
    console.error('Certifique-se de definir IMAGEKIT_PRIVATE_KEY e IMAGEKIT_URL_ENDPOINT.');
    process.exit(1);
  }

  const fileName = path.basename(localFilePath);
  console.log(`=========================================`);
  console.log(`ImageKit.io Uploader`);
  console.log(`Ficheiro local: ${localFilePath}`);
  console.log(`Pasta no ImageKit: ${folder}`);
  if (tags) console.log(`Tags: ${tags}`);
  console.log(`=========================================`);

  try {
    console.log(`[1/2] A carregar o ficheiro e a construir formulário multipart...`);
    const fileBuffer = fs.readFileSync(localFilePath);
    const boundary = '----ImageKitBoundary' + Math.random().toString(16).substring(2);
    
    const postData = buildMultipartBody(fileBuffer, fileName, folder, boundary, tags);

    console.log(`[2/2] A efetuar upload para o ImageKit.io...`);
    const authHeader = 'Basic ' + Buffer.from(privateKey + ':').toString('base64');

    const options = {
      hostname: 'upload.imagekit.io',
      path: '/api/v1/files/upload',
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': postData.length
      }
    };

    const req = https.request(options, (res) => {
      let chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        const body = Buffer.concat(chunks).toString('utf-8');
        try {
          const response = JSON.parse(body);
          if (res.statusCode === 200) {
            console.log(`\n[✓] Upload concluído com sucesso!`);
            console.log(`================ RESULTADO ================`);
            console.log(`Nome do Ficheiro : ${response.name}`);
            console.log(`ID do Ficheiro   : ${response.fileId}`);
            console.log(`URL Otimizada    : ${response.url}`);
            console.log(`===========================================`);
            process.exit(0);
          } else {
            console.error(`\n[X] Erro no upload (Status ${res.statusCode}):`, response.message || response);
            process.exit(1);
          }
        } catch (e) {
          console.error(`\n[X] Erro a processar resposta do servidor:`, body);
          process.exit(1);
        }
      });
    });

    req.on('error', (e) => {
      console.error(`\n[X] Erro de rede:`, e.message);
      process.exit(1);
    });

    req.write(postData);
    req.end();

  } catch (err) {
    console.error(`\n[X] Erro inesperado:`, err.message);
    process.exit(1);
  }
}

main();
