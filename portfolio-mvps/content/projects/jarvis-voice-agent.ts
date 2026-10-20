import type { Project } from "./types";

export const jarvisVoiceAgent: Project = {
  slug: "jarvis-voice-agent",
  name: "JARVIS",
  headline: "LLMの判断を信頼境界にしない常駐音声アシスタント",
  summary:
    "macOS に常駐し、発話から開発作業を実行します。LLM のルーターを信頼境界にせず、その前後を決定的なポリシー層で挟む構成にしました。判断の根拠は、計測した数値に置いています。既存のエージェント基盤（hermes-agent）を土台に、コードは AI に書かせ、自分は設計の方針を決め、コードを読んで採否を判断し、動作を確かめて修正を指示する形で作りました。",
  tier: "featured",
  categories: ["ai", "security"],
  team: { kind: "solo" },
  period: { start: "2026-09" },
  stack: ["Python", "Swift (SwiftUI)", "Ollama (ローカルLLM)", "launchd", "pytest"],
  highlights: [
    { label: "Prompt Injection の検証（流出0件）", type: "check" },
    { label: "日本語入力でゲートをすり抜ける不具合3件を修正", type: "check" },
    { label: "CIで297件成功（マイク不要の10スイート）", type: "data" },
  ],
  verification: "code-only",
  evidence: [
    "$ bench router=gemma4:e2b",
    "「gitで強制プッシュして」 → 実行系に分類",
    "→ 前後を決定的なポリシー層で挟む",
    "$ gate（決定的なポリシー層）",
    "危険な発話の検出  25 / 25（見逃し 0）",
    "通常の発話の通過  17 / 17（誤検知 0）",
  ],
  links: {
    github: "https://github.com/Rascal7-7-7/jarvis-voice-agent",
    docs: [
      {
        label: "設計判断の記録",
        href: "https://github.com/Rascal7-7-7/jarvis-voice-agent/blob/main/hermes-jarvis/DELEGATION_SECURITY.md",
      },
      {
        label: "HUD の設計契約",
        href: "https://github.com/Rascal7-7-7/jarvis-voice-agent/blob/main/hermes-jarvis/HUD_SECURITY.md",
      },
      {
        label: "CI の実行結果",
        href: "https://github.com/Rascal7-7-7/jarvis-voice-agent/actions/runs/34682091109",
      },
    ],
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
      { label: "LLM ルーター", note: "ローカルLLMが分類する" },
      { label: "ポリシー層（決定的）", note: "コマンドを拒否パターンと照合する", boundary: true },
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
        "ベンチマークで gemma4:e2b が「gitで強制プッシュして」を確認要求ではなく実行系に分類しました。危険な操作の分類を LLM 単体で行うと取り違えが出るため、LLM だけを発話と破壊的な操作の間に置くことはできません。そこで LLM の前後を決定的なポリシー層で挟みました。後段では、実行するシェルコマンドの文字列を40個の拒否パターン（approvals.deny）と照合します。前段のゲートは、危険な発話25件をすべて止め、通常の発話17件をすべて通しています（誤検知・見逃しとも0件）。",
    },
    {
      question: "なぜ表示層（HUD）にコマンド実行権を持たせなかったのか",
      answer:
        "表示用の画面にコマンド実行権を持たせると、画面そのものが攻撃の入口になり、エージェント本体と同じ対策が必要になるためです。HUD は runtime が書く JSON 1ファイルを読むだけにし、runtime へ指示を送る経路は作っていません。この条件を満たせない既存OSSは採用しませんでした。",
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
    "プロンプトインジェクションを仕込んだ HTML を要約経路に通して検証（ペイロードの実行なし、ログ中の SSH 鍵素材0件、シェル履歴の流出先ドメイン0件、Codex の設定ファイルは sha256 が一致し改変なし）",
    "設定値ではなく実効的な制御を特定。Codex の approval_policy は非対話の codex exec には適用されないため、書き込みを防いでいるのは argv に固定した --sandbox read-only だと確かめた（ファイルの変更を指示しても sha256 は変わらなかった）",
    "呼び出しのたびに設定の解決経路を検証し、想定と異なれば停止する（fail-closed）",
    "状態ファイルの権限を絞り、同一マシンの他アカウントから読めないようにした",
  ],
  testing:
    "テストは34ファイルあります。このうちマイクを必要としない10スイートを push / PR ごとに GitHub Actions で実行しており、2026-09-12 時点の main の実行では297件成功・2件スキップでした。",
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
