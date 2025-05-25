import { FreshContext, Handlers } from "$fresh/server.ts";
import { getBroadcastChannel } from "../../../src/broadcastChannel.ts";

const channel = getBroadcastChannel();
const controllers: ReadableStreamDefaultController[] = [];

// 接続が切れたコントローラーを定期的に削除する関数
const cleanupControllers = () => {
  for (let i = controllers.length - 1; i >= 0; i--) {
    try {
      // 接続テスト
      controllers[i].enqueue(new TextEncoder().encode(": keep-alive\n\n"));
    } catch (_error) {
      // エラーが発生した場合はコントローラーを削除
      controllers.splice(i, 1);
    }
  }
};

// 30秒ごとにクリーンアップを実行
const isBuildMode = Deno.args.includes("build");
if (!isBuildMode) {
  setInterval(cleanupControllers, 30000);
}

if (channel) {
  channel.onmessage = (event) => {
    const message = event.data;
    for (const controller of controllers) {
      try {
        controller.enqueue(
          new TextEncoder().encode(`data: ${JSON.stringify(message)}\n\n`),
        );
      } catch (_error) {
        // エラーが発生した場合はコントローラーをリストから削除
        const index = controllers.indexOf(controller);
        if (index !== -1) {
          controllers.splice(index, 1);
        }
      }
    }
  };
}

export const handler: Handlers = {
  GET(_req: Request, _ctx: FreshContext) {
    return new Response(
      new ReadableStream({
        start: (controller) => {
          controllers.push(controller);
        },
      }),
      {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
      },
    );
  },
};
