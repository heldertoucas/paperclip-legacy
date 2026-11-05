---
name: imagekit-uploader
description: >-
  Uploads a local image to ImageKit.io. Use when the user asks to upload an
  image to imagekit. Do not use for uploading files that are not images.
---
# ImageKit Uploader

Esta skill permite carregar uma imagem local diretamente para a biblioteca do ImageKit.io, organizando-a em pastas virtuais e obtendo a URL otimizada de CDN correspondente.

## Como Executar

Execute o script de upload fornecendo o caminho da imagem local e a pasta virtual de destino no ImageKit:

```bash
node 08-system/081-agents/.rulesync/skills/imagekit-uploader/scripts/upload.js "<local-file-path>" "[virtual-folder-path]"
```

### Exemplo:
```bash
node 08-system/081-agents/.rulesync/skills/imagekit-uploader/scripts/upload.js "./public/images/logo.png" "/app-avaliacao/assets"
```

## Como Funciona
1. O script lê as chaves de acesso do ficheiro `.env` na raiz do projeto.
2. Efetua um pedido HTTP POST multipart/form-data à API de upload do ImageKit (`https://upload.imagekit.io/api/v1/files/upload`).
3. Autentica o pedido utilizando a chave privada via Basic Auth.
4. Exibe a URL direta de CDN otimizada e o ID do ficheiro no ImageKit.

## Safety
- This skill reads the `.env` file for credentials and uploads local files to an external service.
- Never commit secrets or upload sensitive personal images unattended.

## Anti-Patterns
- Avoid exposing the direct private keys in any chat output.
- Do not overwrite existing ImageKit files blindly.

## Validation Loop
Verifique a resposta da API de upload. Se ocorrer um erro (ex: credenciais inválidas ou caminho incorreto), analise o erro, corrija o `.env` ou o caminho e repita a operação até obter sucesso com a URL da CDN.
