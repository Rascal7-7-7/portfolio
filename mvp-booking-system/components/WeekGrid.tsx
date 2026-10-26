import Link from 'next/link';
import { dayParts, formatShortDate, toMinutes } from '@/lib/date';
import { CLOSE_MIN, OPEN_MIN, durationMin, endTime, placeInLanes } from '@/lib/slots';
import { sortByDateTime } from '@/lib/store';
import { STATUS_LABEL, type Reservation } from '@/lib/types';
import { isNew, needsAttention } from '@/components/ReservationRow';

const HOUR_H = 72;
const HOURS = Array.from({ length: (CLOSE_MIN - OPEN_MIN) / 60 }, (_, i) => OPEN_MIN / 60 + i);
/** これより低いブロックは2行（時刻・名前 / 担当）だけにする */
const TALL_H = 64;
/** これより低い（30分の）ブロックは1行（時刻・姓）だけにする。2行目以降が途中で切れるため */
const SHORT_H = 48;

type MenuKind = 'cut' | 'color' | 'perm' | 'care';

/** 週表示はメニュー種別で色分けする（Airリザーブの週表示と同じ考え方）。クラスは Tailwind が拾えるよう文字列のまま書く */
/** block は予定ブロック用（枠は同系色を薄く引いて面で見せる）、swatch は凡例用（小さいので枠を濃くして見分けやすくする） */
export const KIND: Record<MenuKind, { label: string; block: string; swatch: string }> = {
  cut:   { label: 'カット',     block: 'bg-menu-cut border-menu-cut-line/25',     swatch: 'bg-menu-cut border-menu-cut-line' },
  color: { label: 'カラー',     block: 'bg-menu-color border-menu-color-line/25', swatch: 'bg-menu-color border-menu-color-line' },
  perm:  { label: 'パーマ',     block: 'bg-menu-perm border-menu-perm-line/25',   swatch: 'bg-menu-perm border-menu-perm-line' },
  care:  { label: 'スパ・ケア', block: 'bg-menu-care border-menu-care-line/25',   swatch: 'bg-menu-care border-menu-care-line' },
};

export function menuKind(service: string): MenuKind {
  if (service.includes('カラー')) return 'color';
  if (service.includes('パーマ')) return 'perm';
  if (service.includes('カット')) return 'cut';
  return 'care';
}

export function WeekLegend() {
  return (
    <ul aria-label="色の見方" className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-dim">
      {(Object.keys(KIND) as MenuKind[]).map(k => (
        <li key={k} className="flex items-center gap-1.5">
          <span aria-hidden="true" className={`size-3 rounded-[3px] border ${KIND[k].swatch}`} />{KIND[k].label}
        </li>
      ))}
      <li className="flex items-center gap-1.5"><span aria-hidden="true" className="size-2 rounded-full bg-attn" />確定待ち</li>
      <li className="flex items-center gap-1.5"><span aria-hidden="true" className="size-3 rounded-[3px] border border-dashed border-line-strong" />キャンセル</li>
    </ul>
  );
}

/** デスクトップの週表示：日〜土の7列 × 営業時間。列見出しを押すとその日の日表示へ */
export default function WeekGrid({ days, reservations, today, nowMin, onPickDay }: {
  days: string[]; reservations: Reservation[]; today: string; nowMin: number | null; onPickDay: (date: string) => void;
}) {
  const cols = { gridTemplateColumns: `56px repeat(${days.length}, minmax(0, 1fr))` };
  const byDay = (d: string) => sortByDateTime(reservations.filter(r => r.reservation_date === d));
  return (
    <div className="rounded-xl overflow-hidden bg-canvas shadow-[0_0_0_1px_var(--color-line),0_1px_2px_rgba(60,45,30,0.04)]">
      <div className="grid border-b border-line" style={cols}>
        <div />
        {days.map(d => {
          const { day, weekday } = dayParts(d);
          const isToday = d === today;
          const count = byDay(d).filter(r => r.status !== 'canceled').length;
          return (
            <button key={d} type="button" onClick={() => onPickDay(d)}
              aria-label={`${formatShortDate(d)}${isToday ? '（本日）' : ''} ${count}件。日表示で見る`}
              className="border-l border-line px-2.5 py-2.5 text-left hover:bg-muted focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand">
              <span className="block text-xs text-dim">{weekday}</span>
              <span className="flex items-center gap-1.5 mt-0.5">
                <span className={`inline-flex items-center justify-center h-7 min-w-7 px-1 rounded-full text-[15px] font-bold tabular-nums ${isToday ? 'bg-brand text-white' : 'text-ink'}`}>{day}</span>
                <span className="text-xs text-dim tabular-nums">{count > 0 ? `${count}件` : ''}</span>
              </span>
            </button>
          );
        })}
      </div>
      <div className="grid" style={cols}>
        <div className="pt-1.5">
          {HOURS.map(h => (
            <div key={h} className="pr-2 text-right text-xs text-dim tabular-nums" style={{ height: HOUR_H }}>
              {String(h).padStart(2, '0')}:00
            </div>
          ))}
        </div>
        {days.map(d => (
          <DayColumn key={d} list={byDay(d)} nowMin={d === today ? nowMin : null} past={d < today} />
        ))}
      </div>
    </div>
  );
}

function DayColumn({ list, nowMin, past }: { list: Reservation[]; nowMin: number | null; past: boolean }) {
  const y = (min: number) => ((min - OPEN_MIN) / 60) * HOUR_H + 3;
  return (
    <div className={`relative border-l border-line ${past ? 'bg-muted/60' : ''}`} style={{ height: HOUR_H * HOURS.length }}>
      {/* 正時は実線、30分は点線（Notion Calendar と同じ）。いちばん上の正時は見出しの罫線と二重になるので引かない */}
      {HOURS.map((h, i) => (
        <div key={h}>
          {i > 0 && <div className="absolute left-0 right-0 border-t border-line" style={{ top: i * HOUR_H + 3 }} />}
          <div className="absolute left-0 right-0 border-t border-dotted border-line/70" style={{ top: i * HOUR_H + HOUR_H / 2 + 3 }} />
        </div>
      ))}
      {placeInLanes(list).map(({ r, lane, lanes }) => {
        const width = `calc((100% - 6px - ${(lanes - 1) * 3}px) / ${lanes})`;
        const left = `calc(3px + (${width} + 3px) * ${lane})`;
        const height = (durationMin(r) / 60) * HOUR_H - 3;
        return (
          <div key={r.id} className="absolute" style={{ top: Math.max(0, y(toMinutes(r.reservation_time))) + 2, left, width, height }}>
            <WeekBlock r={r} tall={height >= TALL_H} short={height < SHORT_H} narrow={lanes > 1} />
          </div>
        );
      })}
      {nowMin !== null && <div aria-hidden="true" className="absolute left-0 right-0 z-10 h-0.5 bg-now pointer-events-none" style={{ top: y(nowMin) - 1 }} />}
    </div>
  );
}

/** 2行目はメニュー名（担当は高くて広いブロックだけ後ろに足す。担当で文字が切れるため）。横に並ぶ（narrow）ときは姓を2行目に回し、メニューの行は高いブロックだけに出す（45分枠で3行目が欠けるため）。低い（short）ときは1行に姓まで */
function WeekBlock({ r, tall, short, narrow }: { r: Reservation; tall: boolean; short: boolean; narrow: boolean }) {
  const canceled = r.status === 'canceled';
  const kind = KIND[menuKind(r.service_name)];
  const look = canceled
    ? 'bg-canvas border border-dashed border-line-strong text-dim'
    : `border ${kind.block}`;
  // 新着はメニュー色の地でも 4.5:1 を保てるよう accent より一段濃い色（text-accent-hover）にする
  // 横に並んで幅が狭いとき・低いときは姓だけにする。狭くて低いときは時刻も省く（位置で分かる。全文は aria-label と詳細画面で）
  const fresh = isNew(r);
  const name = (
    <span className={`font-medium text-ink truncate ${canceled ? 'line-through' : ''}`}>
      {narrow || short ? r.customer_name.split(' ')[0] : r.customer_name}
    </span>
  );
  const freshMark = <span className="shrink-0 font-medium text-accent-hover">新着</span>;
  return (
    <Link href={`/reservations/${r.id}`}
      aria-label={`${r.reservation_time}–${endTime(r)} ${r.customer_name}様 ${r.service_name} 担当${r.staff} ${STATUS_LABEL[r.status]}${needsAttention(r) ? ' 確認通知未送信' : ''}${fresh ? ' 新着' : ''}`}
      className={`block h-full overflow-hidden rounded-md px-1.5 py-1 text-[11px] leading-[15px] hover:brightness-[0.97] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand ${look} ${fresh ? 'ring-1 ring-accent' : ''}`}>
      <p className="flex items-center gap-1 min-w-0">
        {!(short && narrow) && <span className="tabular-nums text-body shrink-0">{r.reservation_time}</span>}
        {(!narrow || short) && name}
        {short && fresh && freshMark}
        {r.status === 'pending' && <span aria-hidden="true" className="ml-auto size-2 shrink-0 rounded-full bg-attn" />}
      </p>
      {!short && narrow && <p className="flex items-center gap-1 min-w-0">{name}{!tall && fresh && freshMark}</p>}
      {!short && (!narrow || tall) && <p className="text-dim truncate">{fresh && <span className="mr-1 font-medium text-accent-hover">新着</span>}{r.service_name}{tall && !narrow && <><span aria-hidden="true"> · </span>{r.staff}</>}</p>}
    </Link>
  );
}
