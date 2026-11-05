---
name: imgur-downloader
description: >-
  Downloads images from an Imgur album URL to a local folder. Use when the user
  asks to download an imgur album or fetch imgur images. Do not use for
  individual images or other domains.
---
# Imgur Album Downloader

Esta skill permite descarregar de forma automatizada todas as imagens de um álbum público do Imgur para uma pasta local, extraindo dinamicamente o Client-ID necessário sem requerer configuração manual.

## Como Executar

Execute o script de download fornecendo o URL do álbum e a pasta de destino:

```bash
node 08-system/081-agents/.rulesync/skills/imgur-downloader/scripts/download.js "<imgur-album-url>" "<output-directory>"
```

### Exemplo:
```bash
node 08-system/081-agents/.rulesync/skills/imgur-downloader/scripts/download.js "https://imgur.com/a/JYQDxS5" "./public/images/lists"
```

## Como Funciona
1. O script acede ao HTML público do álbum para encontrar o bundle de script principal do Imgur (`main.*.js`).
2. Extrai o `Client-ID` dinâmico do Imgur usado pela aplicação web oficial.
3. Faz um pedido à API pública do Imgur (`https://api.imgur.com/3/album/{hash}/images`) usando a chave extraída.
4. Descarrega todas as imagens de forma assíncrona para a pasta de destino especificada.

## Safety
- This skill executes a local Node.js script. Ensure the target directory is safe to write to.
- Do not run the script unattended if the output directory overwrites critical project files.

## Anti-Patterns
- Never hardcode the Imgur Client-ID in the script.
- Do not edit the downloaded images automatically unless requested.

## Validation Loop
Após a execução do script, verifique a pasta de destino com `list_dir` para confirmar que os ficheiros foram descarregados com sucesso. Se falhar, corrija os parâmetros e tente novamente.
