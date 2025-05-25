export interface Message {
  username: string;
  text: string;
  timestamp: string;
  verification?: string; // 検証用のテキスト
  isDecrypted?: boolean; // 復号化の成功可否を示すフラグ
}
