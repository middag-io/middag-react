import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/primitives/reui/avatar";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  PlusSignIcon,
  Tick02Icon,
  StarIcon,
  ShieldEnergyIcon,
} from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <div className="flex items-center gap-2">
      <Avatar className="relative">
        <AvatarImage
          src="https://images.unsplash.com/photo-1485206412256-701ccc5b93ca?w=96&h=96&dpr=2&q=80"
          alt="Nick Johnson"
        />
        <AvatarFallback>NJ</AvatarFallback>
        <AvatarBadge>
          <HugeiconsIcon
            icon={PlusSignIcon}
            strokeWidth={2}
            aria-hidden="true"
          />
        </AvatarBadge>
      </Avatar>
      <Avatar className="relative">
        <AvatarImage
          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&dpr=2&q=80"
          alt="Alex Johnson (away)"
        />
        <AvatarFallback>AJ</AvatarFallback>
        <AvatarBadge className="bg-success">
          <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} aria-hidden="true" />
        </AvatarBadge>
      </Avatar>
      <Avatar className="relative">
        <AvatarImage
          src="https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=96&h=96&dpr=2&q=80"
          alt="Sarah Chen"
        />
        <AvatarFallback>SC</AvatarFallback>
        <AvatarBadge className="bg-warning">
          <HugeiconsIcon icon={StarIcon} strokeWidth={2} aria-hidden="true" />
        </AvatarBadge>
      </Avatar>
      <Avatar className="relative">
        <AvatarImage
          src="https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?w=96&h=96&dpr=2&q=80"
          alt="Michael Rodriguez"
        />
        <AvatarFallback>MR</AvatarFallback>
        <AvatarBadge className="bg-info">
          <HugeiconsIcon
            icon={ShieldEnergyIcon}
            strokeWidth={2}
            aria-hidden="true"
          />
        </AvatarBadge>
      </Avatar>
    </div>
  );
}
