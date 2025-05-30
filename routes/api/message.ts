import { FreshContext, Handlers } from "$fresh/server.ts";
import { getBroadcastChannel } from "../../src/broadcastChannel.ts";

const channel = getBroadcastChannel();

export const handler: Handlers = {
  async POST(req: Request, ctx: FreshContext) {
    const body = await req.json();

    // メッセージを送信
    channel?.postMessage(body);

    return new Response(
      JSON.stringify({ status: "success" }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      },
    );
  },
};
