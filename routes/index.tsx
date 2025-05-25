import { useSignal } from "@preact/signals";
import { ChatContainer } from "../islands/ChatContainer.tsx";
import { Username } from "../islands/Username.tsx";

export default function Home() {
  const username = useSignal<string | undefined>(undefined);

  return (
    <div class="line-bg min-h-dvh flex flex-col">
      <div class="line-header">
        <h1 class="text-lg sm:text-2xl font-bold">ここつびと</h1>
      </div>

      <div class="flex-grow flex flex-col w-full max-w-md mx-auto">
        <div class="w-full flex-grow flex flex-col p-2 sm:p-4">
          <Username username={username} />
          <ChatContainer username={username} />
        </div>

        <div class="py-2 px-3 text-xs sm:text-sm text-gray-600 text-center bg-white/80 rounded-t-lg shadow-inner mt-auto">
          <p>このチャットは端末間暗号化（E2EE）で実装されています。</p>
          <p class="mt-1">
            こころが通じ合う人（ここつびと）のメッセージのみ読むことができます。
          </p>
          <p class="flex gap-2 justify-center text-xs mt-2 text-gray-400">
            © 2025 kamekyame
            <a href="/notice" className="text-blue-500 underline">
              注意事項
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
