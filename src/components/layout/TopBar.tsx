import { Link } from "react-router-dom";
import { EmotionPill } from "./EmotionPill";
import { BrandMark } from "./BrandMark";
import { AvatarBadge } from "../ui/AvatarBadge";
import { useAuthStore } from "../../store/useAuthStore";
import { tourRef } from "../../store/useTourStore";

export function TopBar() {
  const avatarId = useAuthStore((s) => s.profile?.avatarId);

  return (
    <header className="sticky top-3 z-30 mx-3 mt-3 flex items-center justify-between rounded-full glass panel-shadow px-4 py-2.5 md:hidden">
      <BrandMark size="sm" />
      <div className="flex items-center gap-2">
        <EmotionPill tourKey="emotion-pill" />
        <Link ref={tourRef("profile-avatar")} to="/profile" aria-label="Your profile">
          <AvatarBadge avatarId={avatarId} size="sm" />
        </Link>
      </div>
    </header>
  );
}
