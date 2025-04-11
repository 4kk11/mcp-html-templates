# mcp-html-templates

[![npm version](https://badge.fury.io/js/mcp-html-templates.svg)](https://www.npmjs.com/package/mcp-html-templates)
[![Docker Image](https://img.shields.io/docker/v/4kk11/mcp-html-templates?logo=docker)](https://hub.docker.com/r/4kk11/mcp-html-templates)

An MCP server for managing and utilizing HTML templates.
You can manage various layout templates such as minutes and invoices in HTML format and use them in connection with LLMs.


## Main Features

### 1. Using Templates
Retrieve and use existing templates

https://github.com/user-attachments/assets/a9c49cf5-4832-46e7-ac64-f664927f6dbf


### 2. Registering Templates
Register new templates

https://github.com/user-attachments/assets/89599dd3-428a-4749-83ec-a8007436bdf7


## Installation

### Using Docker

1. Pull Docker image
```bash
docker pull 4kk11/mcp-html-templates
```

2. Configuration example (claude_desktop_config.json)
```json
{
  "mcpServers": {
    "html-templates": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-v",
        "YOUR_TEMPLATES_DIR:/app/resources",
        "-e",
        "READ_ONLY",
        "4kk11/mcp-html-templates"
      ],
      "env": {
        "READ_ONLY": "false"
      }
    }
  }
}
```

### Using npx

Configuration example (claude_desktop_config.json):
```json
{
  "mcpServers": {
    "html-templates": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-html-templates"
      ],
      "env": {
        "READ_ONLY": "false",
        "TEMPLATES_DIR": "YOUR_TEMPLATES_DIR"
      }
    }
  }
}
```

## Environment Variables

> **Note**: When using Docker, the template directory must be specified using Docker volume mount (`-v YOUR_TEMPLATES_DIR:/app/resources`) instead of environment variables.

| Variable Name | Description | Default Value |
|--------------|-------------|---------------|
| READ_ONLY | Whether to allow adding/modifying templates | false |
| TEMPLATES_DIR | Path to directory where template files are stored | - |

## For Developers

### Building and Managing Docker Images

```bash
# Build Docker image
make docker-build

# Remove Docker image
make docker-clean
```

Development configuration example (claude_desktop_config.json):
```json
{
  "mcpServers": {
    "html-templates": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-v",
        "YOUR_TEMPLATES_DIR:/app/resources",
        "-e",
        "READ_ONLY",
        "mcp-html-templates"
      ],
      "env": {
        "READ_ONLY": false
      }
    }
  }
}
```

## License

This project is released under the MIT License. See [LICENSE](LICENSE) file for details.