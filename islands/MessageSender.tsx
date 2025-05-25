import type { Signal } from "@preact/signals";
import { useRef } from "preact/hooks";
import { encode, generateVerification, username2key } from "../src/e2ee.ts";

interface MessageSenderProps {
  username: Signal<string | undefined>;
}

export function MessageSender(props: MessageSenderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const submit = (e: Event) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const messageText = formData.get("text") as string;

    if (!messageText || !messageText.trim()) return;

    const key = username2key(props.username.value);
    const text = encode(messageText, key);
    const verification = generateVerification(key);

    fetch("/api/message", {
      method: "POST",
      body: JSON.stringify({
        username: props.username.value,
        text,
        verification,
        timestamp: new Date().toISOString(),
      }),
    });

    // フォームをリセットしてフォーカスを維持
    (e.target as HTMLFormElement).reset();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div class="line-input mt-auto bg-white/80 rounded-lg shadow-inner">
      {props.username.value && (
        <form onSubmit={submit} class="w-full">
          <div class="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              name="text"
              class="flex-grow p-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#06c755] focus:border-transparent"
              placeholder="メッセージを入力"
              autoComplete="off"
            />
            <button type="submit" class="line-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-5 h-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                />
              </svg>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
