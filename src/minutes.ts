/**
 * MCPサーバーの実装
 * 議事録のHTMLテンプレートをリソースとして提供する
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  ListResourcesRequestSchema,
  ListResourceTemplatesRequestSchema,
  ReadResourceRequestSchema,
  Resource,
  ListToolsRequestSchema,
  CallToolRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// ESModuleでの__dirnameの代替実装
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * MCPサーバーインスタンスを作成する
 * リソース機能のみを有効にした設定で初期化
 */
export const createServer = async () => {
  const server = new Server(
    {
      name: "mcp-minutes-generator",
      version: "1.0.0",
    },
    {
      capabilities: {
        resources: {},
        tools: {},
      },
    }
  );

  // テンプレート関連のパス設定
  const TEMPLATES_DIR = path.join(__dirname, "../resources");

  // テンプレート情報を管理するMap
  const templates = new Map<string, Resource>();

  // テンプレート情報の読み込み
  const loadTemplateInfo = async () => {
    try {
      const files = await fs.readdir(TEMPLATES_DIR);
      const htmlFiles = files.filter(file => file.endsWith('.html'));
      
      for (const file of htmlFiles) {
        const stylename = path.basename(file, '.html');
        templates.set(stylename, {
          uri: `minutes://template/${stylename}`,
          name: stylename,
          mimeType: "text/html",
        });
      }
    } catch (error) {
      console.error("Failed to load templates:", error);
    }
  };

  // 初期化
  await loadTemplateInfo();

  /**
   * リソース一覧の取得ハンドラー
   * クライアントが利用可能な議事録テンプレートの一覧を返す
   */
  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    return {
      resources: Array.from(templates.values()),
    };
  });

  /**
   * リソーステンプレートの取得ハンドラー
   * 将来的に複数のスタイルに対応できるようURIテンプレートを定義
   */
  server.setRequestHandler(ListResourceTemplatesRequestSchema, async () => {
    return {
      resourceTemplates: [
        {
          uriTemplate: "minutes://template/{style}", // スタイルをパラメータとして受け取れるように
          name: "Meeting Minutes Template",
          description: "HTML template for meeting minutes with different styles",
        },
      ],
    };
  });

  /**
   * リソース内容の読み取りハンドラー
   * 指定されたURIに対応する議事録テンプレートのHTMLを返す
   */
  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const { uri } = request.params;
    const template = Array.from(templates.entries()).find(([_, resource]) => resource.uri === uri);

    if (template) {
      const [style, resource] = template;
      const templatePath = path.join(TEMPLATES_DIR, `${style}.html`);
      
      const content = await fs.readFile(templatePath, "utf-8");
      return {
        contents: [
          {
            ...resource,
            text: content,
          },
        ],
      };
    }

    // 未知のURIの場合はエラー
    throw new Error(`Unknown resource: ${uri}`);
  });

  /**
   * テンプレート取得ツールの入力スキーマ
   */
  // スタイル選択のスキーマを動的に生成
  const createGetTemplateSchema = () => {
    const styles = Array.from(templates.keys());
    if (styles.length === 0) {
      throw new Error("No templates available");
    }
    return z.object({
      style: z.enum(styles as [string, ...string[]])
        .describe("テンプレートのスタイル名（選択可能: " + styles.join(", ") + "）")
        .default("modern"),
    });
  };

  /**
   * テンプレート登録ツールの入力スキーマ
   */
  const RegisterTemplateSchema = z.object({
    stylename: z.string()
      .describe("登録するテンプレートのスタイル名")
      .min(1),
    html: z.string()
      .describe("テンプレートのHTML内容")
      .min(1),
  });

  /**
   * 利用可能なツール一覧の取得ハンドラー
   */
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    const tools: Tool[] = [
      {
        name: "get_template",
        description: "議事録テンプレートを取得するツール（テンプレートを使う際、人名はアルファベットにすること）",
        inputSchema: zodToJsonSchema(createGetTemplateSchema()) as Tool["inputSchema"],
      },
      {
        name: "register_template",
        description: "新しい議事録テンプレートを登録するツール（必ず事前にArtifactでプレビューを見せ、許可を得てから登録すること）",
        inputSchema: zodToJsonSchema(RegisterTemplateSchema) as Tool["inputSchema"],
      },
    ];

    return { tools };
  });

  /**
   * ツール実行ハンドラー
   */
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    if (name === "get_template") {
      const validatedArgs = createGetTemplateSchema().parse(args);
      const template = templates.get(validatedArgs.style);
      
      if (!template) {
        throw new Error(`Template style "${validatedArgs.style}" not found`);
      }

      const templatePath = path.join(TEMPLATES_DIR, `${validatedArgs.style}.html`);

      const content = await fs.readFile(templatePath, "utf-8");
      return {
        content: [
          {
            type: "text",
            text: content,
          },
        ],
      };
    }

    if (name === "register_template") {
      const validatedArgs = RegisterTemplateSchema.parse(args);
      const { stylename, html } = validatedArgs;

      // テンプレートファイルを保存
      const templatePath = path.join(TEMPLATES_DIR, `${stylename}.html`);
      await fs.writeFile(templatePath, html, "utf-8");

      // テンプレート情報を登録
      templates.set(stylename, {
        uri: `minutes://template/${stylename}`,
        name: stylename,
        mimeType: "text/html",
      });

      return {
        content: [
          {
            type: "text",
            text: `Template "${stylename}" has been registered successfully.`,
          },
        ],
      };
    }

    throw new Error(`Unknown tool: ${name}`);
  });
  return { server, templates };
};