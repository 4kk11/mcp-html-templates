# MCP HTML Templates

Dockerを使用してHTMLテンプレートを管理するためのツールです。

# 使い方

## 開発
```bash
# Dockerイメージをビルド
make build

# Dockerイメージを削除
make clean
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
        "-e",
        "READ_ONLY",
        "mcp-html-templates"
      ],
      "env": {
        "READ_ONLY": false
      }
    },
  }
}
```

## 本番

### Docker

```bash
docker pull 4kk11/mcp-html-templates
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
        "-v", // optional
        "{TEMPLATES_DIR}:/app/resources", // optional
        "-e", // 
        "READ_ONLY",
        "4kk11/mcp-html-templates"
      ],
      "env": {
        "READ_ONLY": false
      }
    },
  }
}
```
