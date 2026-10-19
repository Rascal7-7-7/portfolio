/** ブラウザ側でダミーデータを用意するまでの一瞬だけ出す */
export default function LoadingState() {
  return (
    <div className="px-4 md:px-10 py-6 md:py-10 max-w-5xl" aria-busy="true">
      <p className="sr-only">読み込み中</p>
      <div className="h-7 w-40 bg-subtle rounded-md mb-8 animate-pulse" />
      <div className="h-20 border border-line rounded-lg mb-8 animate-pulse" />
      <div className="border border-line rounded-lg divide-y divide-line">
        {[0, 1, 2, 3].map(i => <div key={i} className="h-16 animate-pulse" />)}
      </div>
    </div>
  );
}
