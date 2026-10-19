import type { Project } from "./types";

export const jarvisVoiceAgent: Project = {
  slug: "jarvis-voice-agent",
  name: "JARVIS",
  headline: "AIを信頼境界にしない前提で設計した常駐音声アシスタント",
  summary:
    "macOS に常駐し、発話から開発作業を実行します。LLM のルーターを信頼境界にせず、その前後を決定的なポリシー層で挟む構成にしました。判断の根拠は、自分で計測した数値に置いています。",
  tier: "featured",
  categories: ["ai", "security"],
  team: { kind: "solo" },
  period: { start: "2026-09" },
  stack: ["Python", "Swift (SwiftUI)", "Ollama (ローカルLLM)", "launchd", "pytest"],
  highlights: [
    { label: "LLMを信頼境界にしない設計", type: "check" },
    { label: "日本語音声特有の脆弱性3件を修正", type: "check" },
    { label: "テスト34ファイル・CIで297件成功", type: "data" },
  ],
  verification: "code-only",
  evidence: [
    "$ bench router=gemma4:e2b",
    "「gitで強制プッシュして」 → 実行系に分類",
    "危険な操作の分類精度  0.75",
    "→ LLM を信頼境界にしない",
    "→ 前後を決定的なポリシー層で挟む",
  ],
  links: {
    github: "https://github.com/Rascal7-7-7/jarvis-voice-agent",
  },

  // ---- Case Study ----
  problem:
    "音声からコマンドを実行させると、聞き間違いや曖昧な指示がそのまま破壊的な操作につながります。どこまでをLLMに任せてよいかを、感覚ではなく根拠で決める必要がありました。",
  goal: "発話と危険な操作の間に、LLMの判断に依存しない境界を置くこと。",
  diagram: {
    description:
      "JARVIS の構成図。発話は、決定的なポリシー層、LLM ルーター、もう一度決定的なポリシー層の順に通ってから実行される。信頼境界はポリシー層で、LLM ルーターは信頼境界にしない。HUD は runtime が書く JSON 1ファイルを読むだけで、runtime へ戻る経路を持たない。",
    steps: [
      { label: "発話", note: "音声で開発作業を指示する" },
      { label: "ポリシー層（決定的）", note: "LLM の前で判定する", boundary: true },
      { label: "LLM ルーター", note: "ローカルLLMが分類する。信頼境界にしない" },
      { label: "ポリシー層（決定的）", note: "LLM の後で判定する", boundary: true },
      { label: "実行", note: "開発作業を実行する" },
    ],
    sidePath: {
      steps: [
        { label: "runtime", note: "状態を書く" },
        { label: "JSON", note: "1ファイル" },
        { label: "HUD", note: "読むだけ" },
      ],
      note: "HUD から runtime へ戻る経路は持たない",
    },
  },
  decisions: [
    {
      question: "なぜ LLM のルーターを信頼境界にしなかったのか",
      answer:
        "ベンチマークで gemma4:e2b が「gitで強制プッシュして」を確認要求ではなく実行系に分類し、危険な操作の分類精度が 0.75 でした。4回に1回間違えるものを、発話と破壊的な操作の間に置くことはできません。そのため LLM の前後を決定的なポリシー層で挟んでいます。",
    },
    {
      question: "なぜ表示層（HUD）にコマンド実行権を持たせなかったのか",
      answer:
        "コマンドを実行できる表示面は、もはや表示ではなくエージェントであり、脅威モデル全体を引き継ぐためです。HUD の入力は runtime が書く JSON 1ファイルのみとし、runtime へ戻る経路を持たせていません。この契約に合わない既存OSSは採用を見送りました。",
    },
  ],
  challenges: [
    {
      problem:
        "権限昇格を含む発話が、キーワード判定をすり抜けてゲートを通過しました。英語の入力では同じパターンが機能していました。",
      investigation:
        "英語では動くのに日本語で動かないことから、単語境界の扱いを疑いました。Python の正規表現は日本語の助詞も単語文字として扱うため、英単語の直後に単語境界が生まれていませんでした。",
      solution:
        "単語境界に依存しない判定へ変更しました。あわせて「〜教えて」で終わる発話が概念的な質問と誤判定され秘密情報の要求が通っていた問題と、ASCIIのみのパターンがカタカナ表記を検出できない問題も修正しています。正常な質問は通したまま、要求だけを止める形にしました。",
    },
  ],
  security: [
    "LLM の判断を信頼境界にせず、決定的なポリシー層で前後を挟む",
    "プロンプトインジェクションを実際に流し、鍵素材の露出・シェル履歴・ファイル改変の有無で検証",
    "設定値ではなく実効的な制御を特定（承認ポリシーが非対話モードに適用されないことを実測）",
    "呼び出しのたびに設定の解決経路を検証し、想定と異なれば停止する（fail-closed）",
    "状態ファイルの権限を絞り、同一マシンの他アカウントから読めないようにした",
  ],
  testing:
    "34ファイル。うちマイクを必要としない10スイートを push / PR ごとに GitHub Actions で実行し、main の最新コミット（2026-09-12）では297件成功・2件スキップでした。",
  learned: [
    "正規表現の単語境界は、言語をまたぐと前提が崩れる",
    "「設定してある」と「実際に効いている」は別物で、後者は毎回確かめる必要がある",
    "守れない範囲を明示しない防御は、過大評価を招く",
  ],
  futureWork: [
    "ゲートはキーワード照合のため、意図的に難読化された発話には対応できない",
    "承認フローを単回使用のトークン方式で実装する",
  ],
};
