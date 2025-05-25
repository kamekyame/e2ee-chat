export default function Notice() {
  return (
    <div className="line-bg min-h-dvh flex flex-col">
      <div className="line-header">
        <h1 className="text-lg sm:text-2xl font-bold">注意事項</h1>
      </div>

      <div className="flex-grow flex flex-col w-full max-w-md mx-auto p-4">
        <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base">
          <li>このアプリはサーバーにデータを保存しません。</li>
          <li>画面を閉じてしまうとメッセージは見れなくなります。</li>
          <li>
            端末間暗号化（E2EE）を使用していますが、簡易実装のため暗号化は協力ではありません。
          </li>
          <li>
            ユーザー名から秘密鍵を生成する仕組み:
            <ul className="list-disc pl-5 space-y-1">
              <li>ユーザー名の各文字のUnicode値を合計します。</li>
              <li>その合計値を5で割った余りを計算します。</li>
              <li>余りが秘密鍵（0〜4の値）として使用されます。</li>
            </ul>
            この仕組みにより、5人に1人が同じ鍵を持つ可能性があります。
          </li>
        </ul>
      </div>

      <div className="py-2 px-3 text-xs sm:text-sm text-gray-600 text-center bg-white/80 rounded-t-lg shadow-inner mt-auto">
        <p className="text-xs mt-2 text-gray-400">© 2025 kamekyame</p>
      </div>
    </div>
  );
}
