---
name: openspec-architect
description: >-
  Use this skill to map dependencies and evaluate the technical impact of an
  OpenSpec proposal using the Graphify MCP.
---
# OpenSpec Architect

You have access to the `graphify` MCP server, which maintains a local knowledge graph of the repository's code and documentation.

1. **Technical Impact Analysis**: During the drafting of an OpenSpec design document or proposal, use tools like `get_neighbors` or `query_graph` to map out which existing files, modules, or systems will be impacted by the proposed changes.
2. **Risk Mitigation / Blast Radius**: Include the specific list of impacted nodes returned by Graphify in the "Technical Impact" or "Blast Radius" section of the proposal. This ensures architectural integrity and comprehensive test planning before any code is written.
