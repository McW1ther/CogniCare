import { User } from "lucide-react";
import { getAvatar } from "../../data/avatars";

const SIZES = {
  sm: { box: 28, icon: 14 },
  md: { box: 36, icon: 17 },
  lg: { box: 64, icon: 28 },
} as const;

/** A solid-colour circular badge, deliberately more saturated than
 * EmotionIcon's subtle wash — this is meant to read as a proper
 * avatar (recognisable at a glance) rather than atmosphere. */
export function AvatarBadge({
  avatarId,
  size = "md",
  className = "",
}: {
  avatarId?: string | null;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  const { box, icon } = SIZES[size];
  const avatar = getAvatar(avatarId);
  const Icon = avatar?.icon ?? User;

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full ${className}`}
      style={{
        width: box,
        height: box,
        background: avatar ? avatar.color : "var(--color-mist-strong)",
      }}
    >
      <Icon size={icon} strokeWidth={1.75} color="var(--color-paper)" />
    </span>
  );
}
