# mcp-html-templates

[![npm version](https://badge.fury.io/js/mcp-html-templates.svg)](https://www.npmjs.com/package/mcp-html-templates)
[![Docker Image](https://img.shields.io/docker/v/4kk11/mcp-html-templates?logo=docker)](https://hub.docker.com/r/4kk11/mcp-html-templates)

HTMLテンプレートを管理するためのMCPサーバーです。
様々なHTMLテンプレートをLLMに接続することができます。

## 主な機能

### 1. テンプレートの使用
既存のテンプレートを取得して利用する    
https://github.com/user-attachments/assets/93ba0161-de70-4e4c-923b-d23f259366f3

### 2. テンプレートの登録
新しいテンプレートを登録する    
https://github.com/user-attachments/assets/89599dd3-428a-4749-83ec-a8007436bdf7


## インストール方法

### Dockerを使用する場合

1. Dockerイメージをプル
```bash
docker pull 4kk11/mcp-html-templates
```

2. 設定例（claude_desktop_config.json）
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

### npxを使用する場合

設定例（claude_desktop_config.json）:
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

## 環境変数

> **注意**: Dockerを使用する場合、テンプレートディレクトリの指定は環境変数ではなく、Dockerのボリュームマウント（`-v YOUR_TEMPLATES_DIR:/app/resources`）で行う必要があります。

| 変数名 | 説明 | デフォルト値 |
|--------|------|--------------|
| READ_ONLY | テンプレートの追加・変更を許可するかどうか | false |
| TEMPLATES_DIR | テンプレートファイルを保存するディレクトリのパス（npxの場合のみ） | - |

## 開発者向け

### Dockerイメージのビルドと管理

```bash
# Dockerイメージをビルド
make build

# Dockerイメージを削除
make clean
```

開発時の設定例（claude_desktop_config.json）:
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

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。詳細は[LICENSE](LICENSE)ファイルをご覧ください。