---
name: context-mode-setup
description: Install and configure context-mode for OpenCode sandboxing. Use when user wants to set up context-mode MCP server and plugin for secure tool execution.
license: MIT
compatibility: Requires Node.js and npm for global installation.
metadata:
  author: user
  version: "1.0"
---

Set up context-mode in OpenCode for secure sandboxed tool execution.

## Installation Steps

### Step 1 — Install globally

```bash
npm install -g context-mode
```

### Step 2 — Register MCP server and plugin

Create or update `opencode.json` in your project root with both `mcp` and `plugin` entries:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "context-mode": {
      "type": "local",
      "command": ["context-mode"]
    }
  },
  "plugin": ["context-mode"]
}
```

- **`mcp` entry**: Provides the 6 sandbox tools
- **`plugin` entry**: Enables hooks that intercept tool calls before/after execution, blocking dangerous commands (like raw curl) and enforcing sandbox routing

### Step 3 — Restart OpenCode

On first plugin init, the plugin automatically manages `AGENTS.md` routing instructions:
- File does not exist → routing instructions are written
- File exists without context-mode rules → rules are appended after existing content
- File already contains context-mode rules → skipped (idempotent, no duplicates)

---

## How to Use

After setup, context-mode provides:

1. **6 sandbox tools** via MCP server for secure operations
2. **Runtime tool interception** via plugin hooks:
   - `tool.execute.before` fires on every tool call
   - Blocks or redirects data-heavy commands before they execute
3. **Session compaction recovery** via `experimental.session.compacting` hook that builds and injects resume snapshots

### Without the plugin (don't do this)

Without the `plugin` entry, the model can:
- Run raw `curl` commands
- Read large files directly
- Dump unprocessed output into context
- Ignore `AGENTS.md` instructions

### With the plugin (correct setup)

Tool calls are intercepted at runtime, blocking dangerous commands and enforcing sandbox routing automatically.

---

## Verification

1. Check installation: `npm list -g context-mode`
2. Verify config exists: `opencode.json` with both `mcp` and `plugin` entries
3. Restart OpenCode and check for no errors during plugin initialization
4. The plugin will create/update `AGENTS.md` automatically

---

## Notes

- **SessionStart hook** is not yet available (#14808), so startup/resume session restore is not supported
- `AGENTS.md` is the primary way context-mode instructions reach the model at session start
- **Compaction recovery** works fully via the plugin
