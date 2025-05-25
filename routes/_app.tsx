import { type PageProps } from "$fresh/server.ts";

export default function App({ Component }: PageProps) {
  return (
    <html lang="ja" class="h-full">
      <head>
        <meta charset="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <meta name="theme-color" content="#f3f4f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <title>E2EE Chat - 端末間暗号化チャット</title>
        <meta
          name="description"
          content="シンプルな端末間暗号化（E2EE）チャットアプリケーション"
        />
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body class="h-full">
        <Component />
      </body>
    </html>
  );
}
