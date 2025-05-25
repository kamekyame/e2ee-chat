import { Signal } from "@preact/signals";
import { MessageList } from "./MessageList.tsx";
import { MessageSender } from "./MessageSender.tsx";

interface ChatContainerProps {
  username: Signal<string | undefined>;
}

export function ChatContainer({ username }: ChatContainerProps) {
  return (
    <div class="w-full flex-grow flex flex-col">
      {/* メッセージリストは常に表示 */}
      <div class="flex-grow flex flex-col">
        <MessageList username={username} />
      </div>

      {/* ユーザー名が設定されている場合だけメッセージ送信を表示 */}
      {username.value
        ? <MessageSender username={username} />
        : (
          <div class="line-input bg-white/80 rounded-lg p-3 text-center">
            <p class="text-sm text-gray-500">
              メッセージを送信するにはニックネームを設定してください
            </p>
          </div>
        )}
    </div>
  );
}
