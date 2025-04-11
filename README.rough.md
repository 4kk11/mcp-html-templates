# mcp-html-templates

HTMLテンプレートを管理するためのMCPサーバー

# できること
### テンプレートを使用する
https://github.com/user-attachments/assets/93ba0161-de70-4e4c-923b-d23f259366f3

### テンプレートを登録する
https://github.com/user-attachments/assets/89599dd3-428a-4749-83ec-a8007436bdf7


# 使い方

- YOUR_TEMPLATES_DIRは、テンプレートを保存するディレクトリのパスに置き換えてください。
- READ_ONLYは、テンプレートを読み取り専用にするかどうかを指定します。trueの場合、テンプレートは読み取り専用になります。falseの場合、テンプレートは書き込み可能になります。

## Docker

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
        "-v",
        "YOUR_TEMPLATES_DIR:/app/resources",
        "-e", // 
        "READ_ONLY",
        "4kk11/mcp-html-templates"
      ],
      "env": {
        "READ_ONLY": "false"
      }
    },
  }
}
```


## npx

```json
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
```

# 開発
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
        "YOUR_TEMPLATES_DIR:/app/resources",
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

