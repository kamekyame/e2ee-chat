import { JSX } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";

export function Button(props: JSX.HTMLAttributes<HTMLButtonElement>) {
  // クラス名を文字列として確実に取得
  const className = typeof props.class === "string" ? props.class : "";
  const isLineStyle = className.includes("line-button");

  return (
    <button
      {...props}
      disabled={!IS_BROWSER || props.disabled}
      class={isLineStyle
        ? `${className}`
        : `px-3 py-2 rounded-full bg-[#06c755] hover:bg-[#05b14a] text-white transition-colors text-sm sm:text-base whitespace-nowrap font-bold ${className}`}
    />
  );
}
