import { Signal } from "@preact/signals";
import { useEffect, useState } from "preact/hooks";
import { decode, username2key, verifyDecryption } from "../src/e2ee.ts";
import { Message } from "../src/message.ts";

interface MessageListProps {
  username: Signal<string | undefined>;
}

export function MessageList(props: MessageListProps) {
  const [messages, setMessages] = useState<Message[]>(() => []);
  const [encryptedMessages, setEncryptedMessages] = useState<Message[]>(
    () => [],
  );

  // メッセージを受信したときの処理
  useEffect(() => {
    const eventSource = new EventSource("/api/message/stream");
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data) as Message;

      // 暗号化されたメッセージを保存
      setEncryptedMessages((value) => [...value, data]);

      // 復号化処理
      decryptMessage(data);
    };

    // クリーンアップ関数
    return () => eventSource.close();
  }, []);

  // ユーザー名が変更されたときに全メッセージを再度復号化
  useEffect(() => {
    // 既存のメッセージをすべてクリア
    setMessages([]);

    // すべての暗号化メッセージを再度復号化
    encryptedMessages.forEach((msg) => {
      decryptMessage(msg);
    });
  }, [props.username.value]);
  // メッセージの復号化処理
  const decryptMessage = (data: Message) => {
    // 暗号化されたメッセージのコピーを作成
    let text = data.text;
    let isDecrypted = false;

    // ユーザー名がある場合は復号化を試みる
    if (props.username.value) {
      const key = username2key(props.username.value);
      // メッセージを復号化
      text = decode(data.text, key);

      // 検証フィールドがある場合は復号化の成功可否を確認
      if (data.verification) {
        isDecrypted = verifyDecryption(data.verification, key);
      }
    } else {
      // ユーザー名がない場合は常に復号化失敗として処理
      text = data.text;
      isDecrypted = false;
    }

    // 復号化結果をmessages配列に追加
    setMessages((value) => [...value, { ...data, text, isDecrypted }]);
  };
  // 新しいメッセージが追加されたら、一番下にスクロール
  useEffect(() => {
    if (messages.length > 0) {
      const messageList = document.getElementById("message-list");
      if (messageList) {
        messageList.scrollTop = messageList.scrollHeight;
      }
    }
  }, [messages]);

  // 日付の表示用関数
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // 日付の表示用関数（日付が変わった場合に日付を表示）
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  // 前のメッセージと日付が変わったかどうかをチェック
  const shouldShowDate = (index: number, timestamp: string) => {
    if (index === 0) return true;

    const prevDate = new Date(messages[index - 1].timestamp);
    const currentDate = new Date(timestamp);

    return prevDate.toDateString() !== currentDate.toDateString();
  };

  return (
    <div
      id="message-list"
      class="flex flex-col gap-2 py-3 flex-grow overflow-y-auto"
    >
      {messages.length === 0 && (
        <p class="text-gray-500 text-center text-sm py-10">
          メッセージはまだありません
        </p>
      )}

      {messages.map((message, index) => {
        // 自分のメッセージかどうかを判定
        const isOwnMessage = props.username.value === message.username;

        return (
          <div key={index} class="flex flex-col">
            {/* 日付が変わったら日付を表示 */}
            {shouldShowDate(index, message.timestamp) && (
              <div class="flex justify-center my-2">
                <div class="bg-white/70 px-3 py-1 rounded-full text-xs text-gray-500">
                  {formatDate(message.timestamp)}
                </div>
              </div>
            )}

            <div
              class={`flex ${
                isOwnMessage ? "justify-end" : "justify-start"
              } mb-1`}
            >
              {/* ユーザーアイコン（自分以外のメッセージの場合のみ） */}
              {!isOwnMessage && (
                <div class="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold mr-1">
                  {message.username.charAt(0).toUpperCase()}
                </div>
              )}{" "}
              <div
                class={`max-w-[70%] flex flex-col ${
                  isOwnMessage ? "items-end" : "items-start"
                }`}
              >
                {/* ユーザー名と復号化状態（自分以外のメッセージの場合のみ） */}
                {!isOwnMessage && (
                  <div class="flex items-center ml-2 mb-1">
                    <span class="text-xs text-gray-600">
                      {message.username}
                    </span>
                    {message.isDecrypted !== undefined && (
                      <span
                        class={`inline-block ml-1 text-xs ${
                          message.isDecrypted
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        {message.isDecrypted ? "✓" : "✗"}
                      </span>
                    )}
                  </div>
                )} {/* メッセージ本文 */}
                <div class="flex items-end gap-1">
                  {/* タイムスタンプと復号化状態（自分のメッセージの場合は左側に表示） */}
                  {isOwnMessage && (
                    <div class="flex items-center">
                      <span class="text-[10px] text-gray-500">
                        {formatTime(message.timestamp)}
                      </span>
                      {message.isDecrypted !== undefined && (
                        <span
                          class={`inline-block ml-1 text-xs ${
                            message.isDecrypted
                              ? "text-green-600"
                              : "text-red-500"
                          }`}
                        >
                          {message.isDecrypted ? "✓" : "✗"}
                        </span>
                      )}
                    </div>
                  )}

                  {/* メッセージバブル */}
                  <div
                    class={isOwnMessage
                      ? "line-message-me"
                      : "line-message-other"}
                  >
                    <p class="break-words text-sm">
                      {message.text}
                    </p>
                  </div>

                  {/* タイムスタンプ（他のユーザーのメッセージの場合は右側に表示） */}
                  {!isOwnMessage && (
                    <span class="text-[10px] text-gray-500">
                      {formatTime(message.timestamp)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
