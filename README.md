

```bash
cd mcp-html-templates
docker build -t mcp-html-templates .
```

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
        "{TEMPLATES_DIR}:/app/resources",
        "mcp-html-templates"
      ]
    },
  }
}
```