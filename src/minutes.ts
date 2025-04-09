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
export const createServer = () => {
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

  // モダンなデザインの議事録テンプレートのパス
  const TEMPLATE_PATH = path.join(__dirname, "../resources/meeting-minutes-template-modern.html");

  // 提供するリソースの定義
  const RESOURCES: Resource[] = [
    {
      uri: "minutes://template/modern", // minutes://スキーマでリソースを識別
      name: "Modern Meeting Minutes Template",
      mimeType: "text/html",
    },
  ];

  /**
   * リソース一覧の取得ハンドラー
   * クライアントが利用可能な議事録テンプレートの一覧を返す
   */
  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    return {
      resources: RESOURCES,
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

    // モダンテンプレートのリクエスト処理
    if (uri === "minutes://template/modern") {
      const content = await fs.readFile(TEMPLATE_PATH, "utf-8");
      return {
        contents: [
          {
            ...RESOURCES[0],
            text: content, // テンプレートのHTML内容
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
  const GetTemplateSchema = z.object({
    style: z.enum(["modern"])
      .describe("テンプレートのスタイル（現在はmodernのみ対応）")
      .default("modern"),
  });

  /**
   * 利用可能なツール一覧の取得ハンドラー
   */
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    const tools: Tool[] = [
      {
        name: "get_template",
        description: "議事録テンプレートを取得するツール",
        inputSchema: zodToJsonSchema(GetTemplateSchema) as Tool["inputSchema"],
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
      const validatedArgs = GetTemplateSchema.parse(args);

      if (validatedArgs.style === "modern") {
        const content = await fs.readFile(TEMPLATE_PATH, "utf-8");
        return {
          content: [
            {
              type: "text",
              text: content,
            },
          ],
        };
      }
    }

    throw new Error(`Unknown tool: ${name}`);
  });

  return { server };
};