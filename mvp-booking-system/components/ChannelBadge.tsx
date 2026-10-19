import { CHANNEL_LABEL, type Channel } from '@/lib/types';

/** 受付経路は補足情報なので札にせず、文字だけで添える */
export default function ChannelBadge({ channel }: { channel: Channel }) {
  return <span className="text-xs text-dim whitespace-nowrap">{CHANNEL_LABEL[channel]}</span>;
}
