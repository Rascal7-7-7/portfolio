import { CHANNEL_LABEL, type Channel } from '@/lib/types';

const STYLE: Record<Channel, string> = {
  line:    'bg-[#e3f7e8] text-[#0b6b2b]',
  phone:   'bg-[#f6f5f4] text-[#444653]',
  web:     'bg-[#f2f9ff] text-[#0a5fb4]',
  walk_in: 'bg-[#fdf1e6] text-[#8a3d00]',
};

export default function ChannelBadge({ channel }: { channel: Channel }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${STYLE[channel]}`}>
      {CHANNEL_LABEL[channel]}
    </span>
  );
}
