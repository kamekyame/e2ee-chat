import type { Signal } from "@preact/signals";
import { useEffect, useRef } from "preact/hooks";
import { Button } from "../components/Button.tsx";

interface UsernameProps {
  username: Signal<string | undefined>;
}

export function Username(props: UsernameProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // コンポーネントがマウントされたときにLocalStorageからユーザー名を取得
  useEffect(() => {
    const savedUsername = localStorage.getItem("e2ee-chat-username");
    if (savedUsername) {
      props.username.value = savedUsername;
    }
  }, []);

  const submit = (e: Event) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const usernameValue = formData.get("name") as string;

    if (usernameValue && usernameValue.trim()) {
      const trimmedUsername = usernameValue.trim();
      props.username.value = trimmedUsername;
      // LocalStorageにユーザー名を保存
      localStorage.setItem("e2ee-chat-username", trimmedUsername);
    }
  };

  return (
    <div class="py-2 mb-2">
      {!props.username.value
        ? (
          <div class="bg-white/80 rounded-lg p-3 shadow-sm">
            <p class="text-center text-sm mb-2 font-bold text-gray-700">
              ニックネームを設定してチャットに参加しましょう
            </p>
            <form onSubmit={submit} class="flex flex-col sm:flex-row gap-2">
              <input
                ref={inputRef}
                type="text"
                name="name"
                placeholder="ニックネームを入力"
                class="flex-grow border border-gray-300 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-[#06c755] focus:border-transparent"
                required
                autoFocus
              />
              <Button type="submit">参加する</Button>
            </form>
          </div>
        )
        : (
          <div class="bg-white/80 rounded-lg p-3 shadow-sm flex flex-row items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-full bg-[#06c755] flex items-center justify-center text-white font-bold">
                {props.username.value.charAt(0).toUpperCase()}
              </div>
              <p class="font-bold text-sm sm:text-base">
                {props.username.value}
              </p>
            </div>{" "}
            <Button
              onClick={() => {
                props.username.value = undefined;
                // LocalStorageからユーザー名を削除
                localStorage.removeItem("e2ee-chat-username");
                // ユーザー名をリセットした後、入力フィールドにフォーカス
                setTimeout(() => {
                  if (inputRef.current) {
                    inputRef.current.focus();
                  }
                }, 0);
              }}
              class="px-2 py-1 text-xs"
            >
              変更
            </Button>
          </div>
        )}
    </div>
  );
}
