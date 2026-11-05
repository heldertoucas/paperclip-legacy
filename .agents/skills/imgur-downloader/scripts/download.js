const fs = require('fs');
const path = require('path');
const https = require('https');

// Default fallback client ID used by the Imgur web app
const DEFAULT_CLIENT_ID = '546c25a59c58ad7';

// Common User-Agent to avoid bot detection blockages
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

/**
 * Perform a simple HTTPS GET request returning a Promise with the response body
 */
function fetch(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'GET',
      headers: {
        'User-Agent': USER_AGENT,
        ...headers
      }
    };

    https.get(options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        // Handle redirect
        return fetch(res.headers.location, headers).then(resolve).catch(reject);
      }

      if (res.statusCode < 200 || res.statusCode >= 300) {
        return reject(new Error(`Request failed with status code ${res.statusCode} for URL: ${url}`));
      }

      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve(buffer);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Downloads a file from a URL and saves it to a local path
 */
function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'GET',
      headers: {
        'User-Agent': USER_AGENT
      }
    };

    https.get(options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close();
        fs.unlink(destPath, () => {}); // delete partial file
        return downloadFile(res.headers.location, destPath).then(resolve).catch(reject);
      }

      if (res.statusCode !== 200) {
        file.close();
        fs.unlink(destPath, () => {});
        return reject(new Error(`Failed to download file: status code ${res.statusCode}`));
      }

      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      file.close();
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

/**
 * Extract Client-ID dynamically from Imgur web app bundle
 */
async function extractClientId(albumHash) {
  console.log(`[1/4] Aceder à página do álbum Imgur para obter scripts web...`);
  try {
    const htmlBuffer = await fetch(`https://imgur.com/a/${albumHash}`);
    const html = htmlBuffer.toString('utf-8');

    // 1. Find main JS bundle script URL
    // Standard pattern: https://s.imgur.com/desktop-assets/js/main.<hash>.js
    const scriptRegex = /https:\/\/s\.imgur\.com\/desktop-assets\/js\/main\.[a-zA-Z0-9]+\.js/i;
    const match = html.match(scriptRegex);
    let scriptUrl = match ? match[0] : null;

    if (!scriptUrl) {
      // Try relative match /desktop-assets/js/main.<hash>.js
      const relativeRegex = /\/desktop-assets\/js\/main\.[a-zA-Z0-9]+\.js/i;
      const relativeMatch = html.match(relativeRegex);
      if (relativeMatch) {
        scriptUrl = `https://s.imgur.com${relativeMatch[0]}`;
      }
    }

    if (!scriptUrl) {
      console.warn(`[!] Não foi possível detetar o script principal no HTML. Usando Client-ID padrão.`);
      return DEFAULT_CLIENT_ID;
    }

    console.log(`[2/4] Descarregar script principal do Imgur: ${scriptUrl}`);
    const scriptBuffer = await fetch(scriptUrl);
    const scriptContent = scriptBuffer.toString('utf-8');

    // Search for apiClientId pattern
    // Patterns: apiClientId:"<id>", "apiClientId":"<id>", client_id:"<id>"
    const idRegexes = [
      /apiClientId\s*:\s*["']([a-f0-9]{15})["']/i,
      /"apiClientId"\s*:\s*["']([a-f0-9]{15})["']/i,
      /client[_]?id\s*:\s*["']([a-f0-9]{15})["']/i,
      /client[_]?id=([a-f0-9]{15})/i
    ];

    for (const regex of idRegexes) {
      const idMatch = scriptContent.match(regex);
      if (idMatch && idMatch[1]) {
        const foundId = idMatch[1];
        console.log(`[✓] Client-ID extraído com sucesso: ${foundId}`);
        return foundId;
      }
    }

    console.warn(`[!] Client-ID não encontrado no script. Usando Client-ID padrão.`);
    return DEFAULT_CLIENT_ID;
  } catch (err) {
    console.error(`[!] Erro durante extração dinâmica de Client-ID: ${err.message}`);
    console.log(`[!] Usando Client-ID padrão como fallback: ${DEFAULT_CLIENT_ID}`);
    return DEFAULT_CLIENT_ID;
  }
}

/**
 * Main Executable Routine
 */
async function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error('Utilização: node download.js <imgur-album-url> <output-directory>');
    process.exit(1);
  }

  const albumUrl = args[0];
  const outputDir = path.resolve(args[1]);

  // Extract album hash from URL (e.g., https://imgur.com/a/JYQDxS5 -> JYQDxS5)
  const hashMatch = albumUrl.match(/imgur\.com\/(?:a|gallery)\/([a-zA-Z0-9]+)/i);
  if (!hashMatch || !hashMatch[1]) {
    console.error(`Erro: URL inválido. O link deve conter /a/ ou /gallery/ seguido do hash do álbum.`);
    process.exit(1);
  }
  const albumHash = hashMatch[1];
  console.log(`=========================================`);
  console.log(`Imgur Album Downloader`);
  console.log(`Álbum: ${albumUrl} (Hash: ${albumHash})`);
  console.log(`Destino: ${outputDir}`);
  console.log(`=========================================`);

  try {
    // 1. Get client ID
    const clientId = await extractClientId(albumHash);

    // 2. Fetch album images metadata
    console.log(`[3/4] Obter metadados das imagens na API do Imgur...`);
    const apiHeaders = {
      'Authorization': `Client-ID ${clientId}`,
      'Accept': 'application/json'
    };
    
    const apiResponseBuffer = await fetch(`https://api.imgur.com/3/album/${albumHash}/images`, apiHeaders);
    const response = JSON.parse(apiResponseBuffer.toString('utf-8'));

    if (!response.success || !response.data) {
      throw new Error(response.data?.error || 'Erro na resposta da API');
    }

    const images = response.data;
    console.log(`[✓] Encontradas ${images.length} imagens no álbum.`);

    if (images.length === 0) {
      console.log('Nenhuma imagem para descarregar.');
      process.exit(0);
    }

    // 3. Create output directory
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // 4. Download images
    console.log(`[4/4] A descarregar imagens...`);
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      const ext = path.extname(new URL(img.link).pathname) || '.png';
      // Format sequence name, e.g. 01_aBcdEf.png
      const indexStr = String(i + 1).padStart(2, '0');
      const filename = `${indexStr}_${img.id}${ext}`;
      const destPath = path.join(outputDir, filename);

      console.log(`    [${i + 1}/${images.length}] A descarregar: ${img.link} -> ${filename}`);
      try {
        await downloadFile(img.link, destPath);
      } catch (dlErr) {
        console.error(`    [!] Falha ao descarregar a imagem ${img.id}: ${dlErr.message}`);
      }
    }

    console.log(`\n[✓] Concluído! Todas as imagens foram guardadas em ${outputDir}`);
  } catch (err) {
    console.error(`\n[X] Erro crítico: ${err.message}`);
    process.exit(1);
  }
}

main();
