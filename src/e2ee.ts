/**
 * シンプルなXOR暗号を使用してデータを暗号化
 * @param data 暗号化するテキスト
 * @param privateKey 暗号化キー
 * @returns 暗号化されたテキスト
 */
export const encode = (data: string, privateKey: number): string => {
  if (!data) return "";

  // XOR暗号で暗号化
  const encoded = [];
  for (let i = 0; i < data.length; i++) {
    encoded.push(
      String.fromCharCode(data.charCodeAt(i) ^ privateKey),
    );
  }
  return encoded.join("");
};

/**
 * 暗号化されたデータを復号
 * @param data 暗号化されたテキスト
 * @param privateKey 復号キー
 * @returns 復号されたテキスト
 */
export const decode = (data: string, privateKey: number): string => {
  if (!data) return "";

  // XOR暗号で復号
  return encode(data, privateKey); // XOR暗号は対称的
};

/**
 * 検証用のテキストを生成
 * @param privateKey 暗号化キー
 * @returns 暗号化された検証用テキスト
 */
export const generateVerification = (privateKey: number): string => {
  // 検証用の固定文字列と鍵を組み合わせて作成
  const verificationText = `VERIFY_KEY_${privateKey}`;
  return encode(verificationText, privateKey);
};

/**
 * 検証用テキストを検証して、復号化の成功可否を判定
 * @param verification 暗号化された検証用テキスト
 * @param privateKey 復号キー
 * @returns 復号化の成功可否
 */
export const verifyDecryption = (
  verification: string,
  privateKey: number,
): boolean => {
  if (!verification) return false;

  // 復号化
  const decoded = decode(verification, privateKey);

  // 検証用の固定文字列と一致するか確認
  return decoded === `VERIFY_KEY_${privateKey}`;
};

/**
 * ユーザー名から秘密鍵を生成
 * ユーザー名を元に5種類の鍵を生成するため、5で割った余りを返す
 * これにより、5人に1人が同じ鍵を持ち、メッセージを復号できる
 * @param username ユーザー名
 * @returns 数値の秘密鍵 (0-5の範囲)
 */
export const username2key = (username: string | undefined): number => {
  if (!username) return 0;

  let key = 0;
  for (let i = 0; i < username.length; i++) {
    key += username.charCodeAt(i);
  }
  return key % 5 + 1; // 5で割った余りを返す（1-5の値）
};
