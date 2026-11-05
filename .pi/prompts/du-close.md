---
description: Close the active Development Universe session and record canonical history
---
Close session and archive executive summary into `06-sessions/`:

1. Propose memory candidates if applicable:
```bash
dev memory propose "<title>" --type pattern --content "<content>"
```

2. Register transfers if applicable:
```bash
dev transfers add ...
```

3. Close session (mandatory `--project` and `-n` next steps):
```bash
dev session close --project <project-id> --summary "$ARG1" -n "<Next Step 1>"
```

4. Sincronizar repositórios:
```bash
dev sync all
```
