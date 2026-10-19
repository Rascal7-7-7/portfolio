/**
 * ページ全体で共有する本文の幅と左右の余白。
 * ヘッダー・本文・フッターがすべてこれを使うことで、左端の位置が揃う。
 * （以前はヘッダーだけ max-w の内側に px が入り、ロゴが本文より 24px 右にずれていた）
 */
export const container = "mx-auto w-full max-w-2xl px-5 sm:px-6";
