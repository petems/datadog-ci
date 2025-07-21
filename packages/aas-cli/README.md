# Datadog AAS CLI

A lightweight CLI tool for instrumenting Azure App Services with Datadog.

## Installation

```bash
npm install -g @datadog/aas-cli
```

## Usage

### Instrument an Azure App Service

```bash
datadog-aas instrument \
  --subscription-id <subscription-id> \
  --resource-group <resource-group> \
  --name <app-service-name> \
  --service <service-name> \
  --env <environment> \
  --version <version>
```

### Uninstrument an Azure App Service

```bash
datadog-aas uninstrument \
  --subscription-id <subscription-id> \
  --resource-group <resource-group> \
  --name <app-service-name>
```

## Features

- Instrument/uninstrument Azure App Services with Datadog
- Support for .NET applications
- Environment variable configuration
- Dry-run mode for testing
- Resource ID targeting

## Dependencies

This package only includes the minimal dependencies required for Azure App Service instrumentation:

- `@azure/arm-appservice` - Azure App Service management
- `@azure/arm-resources` - Azure resource management  
- `@azure/identity` - Azure authentication
- `clipanion` - CLI framework
- `chalk` - Terminal colors
- `axios` - HTTP client
- `datadog-metrics` - Metrics logging

## Development

```bash
# Install dependencies
yarn install

# Build the package
yarn build

# Run the CLI
yarn launch --help
```