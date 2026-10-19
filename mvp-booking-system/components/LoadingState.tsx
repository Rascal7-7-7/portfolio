/** ブラウザ側でダミーデータを用意するまでの一瞬だけ出す */
export default function LoadingState() {
  return (
    <div className="px-4 md:px-10 py-6 md:py-8 max-w-5xl" aria-busy="true">
      <p className="sr-only">読み込み中</p>
      <div className="h-8 w-48 bg-[#e7e8e9] rounded-lg mb-6 animate-pulse" />
      <div className="grid grid-cols-3 gap-3 md:gap-5 mb-8">
        {[0, 1, 2].map(i => (
          <div key={i} className="h-24 bg-white rounded-xl shadow-sm animate-pulse" />
        ))}
      </div>
      <div className="space-y-2">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="h-16 bg-white rounded-xl shadow-sm animate-pulse" />
        ))}
      </div>
    </div>
  );
}
