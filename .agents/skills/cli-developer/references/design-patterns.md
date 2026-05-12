<!-- @c design-patterns | doc | (nÃ£o-apagar)-gerador-de-clone-de-site-com-ia | @v 0.1.0 | @> 
<!-- @. resumo | <deps | >users
# CLI Design Patterns

## Command Hierarchy

```
mycli                           # Root command
├── init [options]              # Simple command
├── config
│   ├── get <key>              # Nested subcommand
│   ├── set <key> <value>
│   └── list
├── deploy [environment]        # Command with args
│   ├── --dry-run              # Flag
│   ├── --force
│   └── --config <file>        # Option with value
└── plugins
    ├── install <name>
    ├── list
    └── remove <name>
```

## Flag Conventions

```bash
# Boolean flags (presence = true)
mycli deploy --force --dry-run

# Short + long forms
mycli -v --verbose
mycli -c config.yml --config config.yml

# Required vs optional
mycli deploy <env>              # Positional (required)
mycli deploy --env production   # Flag (optional)

# Multiple values
mycli install pkg1 pkg2 pkg3    # Variadic args
mycli --exclude node_modules --exclude .git
```

## Configuration Layers

Priority order (highest to lowest):

1. **Command-line flags** - Explicit user intent
2. **Environment variables** - Runtime context
3. **Config files (project)** - `.myclirc`, `mycli.config.js`
4. **Config files (user)** - `~/.myclirc`, `~/.config/mycli/config.yml`
5. **Config files (system)** - `/etc/mycli/config.yml`
6. **Defaults** - Hard-coded sensible defaults

```javascript
// Example config resolution
const config = {
  ...systemDefaults,
  ...loadSystemConfig(),
  ...loadUserConfig(),
  ...loadProjectConfig(),
  ...loadEnvVars(),
  ...parseCliFlags(),
};
```

## Exit Codes

Standard POSIX exit codes:

```javascript
const EXIT_CODES = {
  SUCCESS: 0,
  GENERAL_ERROR: 1,
  MISUSE: 2,              // Invalid arguments
  PERMISSION_DENIED: 77,
  NOT_FOUND: 127,
  SIGINT: 130,            // Ctrl+C
};
```

## Plugin Architecture

```
mycli/
├── core/                      # Core functionality
├── plugins/
│   ├── aws/                  # Plugin: AWS integration
│   │   ├── package.json
│   │   └── index.js
│   └── github/               # Plugin: GitHub integration
│       ├── package.json
│       └── index.js
└── plugin-loader.js          # Discovery & loading
```

Plugin discovery:
1. Check `~/.mycli/plugins/`
2. Check `node_modules/mycli-plugin-*`
3. Check `MYCLI_PLUGIN_PATH` env var

## Error Handling Patterns

```javascript
// Good: Actionable error messages
Error: Config file not found at /path/to/config.yml

Tried locations:
  • ./mycli.config.yml
  • ~/.myclirc
  • /etc/mycli/config.yml

Run 'mycli init' to create a config file, or use --config to specify location.

// Bad: Unhelpful errors
Error: ENOENT
```

## Interactive vs Non-Interactive

```javascript
// Detect if running in CI/CD
const isCI = process.env.CI === 'true' || !process.stdout.isTTY;

if (isCI) {
  // Non-interactive: fail fast with clear errors
  if (!options.environment) {
    throw new Error('--environment required in non-interactive mode');
  }
} else {
  // Interactive: prompt user
  const environment = await prompt({
    type: 'select',
    message: 'Select environment:',
    choices: ['development', 'staging', 'production'],
  });
}
```

## State Management

```
~/.mycli/
├── config.yml           # User configuration
├── cache/               # Cached data
│   ├── plugins.json
│   └── api-responses/
├── credentials.json     # Sensitive data (600 perms)
└── state.json          # Session state
```

## Performance Patterns

```javascript
// Lazy loading: Don't load unused dependencies
if (command === 'deploy') {
  const deploy = require('./commands/deploy'); // Load on demand
  await deploy.run();
}

// Caching: Avoid repeated API calls
const cache = new Cache('~/.mycli/cache', { ttl: 3600 });
let plugins = await cache.get('plugins');
if (!plugins) {
  plugins = await fetchPlugins();
  await cache.set('plugins', plugins);
}

// Async operations: Don't block unnecessarily
await Promise.all([
  validateConfig(),
  checkForUpdates(),
  loadPlugins(),
]);
```

## Versioning & Updates

```javascript
// Check for updates (non-blocking)
checkForUpdates().then(update => {
  if (update.available) {
    console.log(`Update available: ${update.version}`);
    console.log(`Run: npm install -g mycli@latest`);
  }
}).catch(() => {
  // Silently fail - don't interrupt user workflow
});

// Version compatibility
const MIN_NODE_VERSION = '18.0.0';
if (!semver.satisfies(process.version, `>=${MIN_NODE_VERSION}`)) {
  console.error(`mycli requires Node.js ${MIN_NODE_VERSION} or higher`);
  process.exit(1);
}
```

## Help Text Design

```
USAGE
  mycli deploy [environment] [options]

ARGUMENTS
  environment  Target environment (development|staging|production)

OPTIONS
  -c, --config <file>  Path to config file
  -f, --force          Skip confirmation prompts
  -d, --dry-run        Preview changes without executing
  -v, --verbose        Show detailed output

EXAMPLES
  # Deploy to production
  mycli deploy production

  # Preview staging deployment
  mycli deploy staging --dry-run

  # Use custom config
  mycli deploy --config ./custom.yml

Learn more: https://docs.mycli.dev/deploy
```
