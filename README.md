# claude-hook-debug

Diagnostic CLI for Claude Code hook issues. Detects ghost hooks from disabled plugins, scope conflicts, misconfigured settings, and known Claude Code bugs.

## Install

```bash
npm install -g @mcptoolshop/claude-hook-debug
```

Or run directly:

```bash
npx @mcptoolshop/claude-hook-debug
```

## Usage

```bash
# Scan current workspace
claude-hook-debug

# Scan a specific project
claude-hook-debug /path/to/project

# JSON output (for piping/scripting)
claude-hook-debug --json
```

Exit code 1 if any errors are found, 0 otherwise.

## What It Detects

| ID | Severity | Description |
|----|----------|-------------|
| `GHOST_HOOK_PREVIEW` | error | claude-preview plugin disabled but Stop hook still fires ([#19893](https://github.com/anthropics/claude-code/issues/19893)) |
| `GHOST_HOOK_GENERIC` | warning | Any disabled plugin that may still have active hooks |
| `LOCAL_ONLY_PLUGINS` | error | `enabledPlugins` in local settings only — overrides silently dropped ([#25086](https://github.com/anthropics/claude-code/issues/25086)) |
| `SCOPE_CONFLICT` | warning | Plugin enabled in one scope, disabled in another |
| `STOP_CONTINUE_LOOP` | error | Stop hook outputs `continue:true` causing infinite loop ([#1288](https://github.com/anthropics/claude-code/issues/1288)) |
| `DISABLE_ALL_HOOKS_ACTIVE` | warning/error | `disableAllHooks: true` suppresses all hooks (escalates to error if managed settings exist) |
| `BROKEN_SETTINGS_JSON` | error | Invalid JSON silently disables all settings from that file |
| `LARGE_SETTINGS_FILE` | warning | Settings file >100KB (may cause slow startup) |
| `PLUGIN_HOOKS_INVISIBLE` | info | No user hooks but plugins are enabled — plugin hooks are invisible to inspection |

## Settings Scopes

The tool reads all four settings scopes in Claude Code's load order:

| Scope | Path | Precedence |
|-------|------|------------|
| managed | `~/.claude/managed-settings.json` | Highest |
| user | `~/.claude/settings.json` | |
| project | `.claude/settings.json` | |
| local | `.claude/settings.local.json` | Lowest (last write wins) |

## Library Usage

```typescript
import { debug } from '@mcptoolshop/claude-hook-debug';

const report = debug({ projectRoot: '/path/to/project' });

console.log(report.diagnostics);
// [{ id: 'GHOST_HOOK_PREVIEW', severity: 'error', title: '...', ... }]

console.log(report.plugins);
// [{ pluginId: 'claude-preview@...', mergedEnabled: false, scopes: [...] }]
```

## Security

- **Read-only.** Reads settings files, never modifies them.
- **No network.** No API calls, no telemetry, no phone-home.
- **No secrets.** Does not read or log env var values, API keys, or tokens.
- **Zero dependencies.** Only Node.js built-ins.

---

Built by [MCP Tool Shop](https://mcp-tool-shop.github.io/)
