import { Kbd, KbdGroup } from "@/components/reui/kbd";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft02Icon,
  DashedLineCircleIcon,
} from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <div className="flex items-center justify-center">
      <KbdGroup>
        <Kbd>
          <HugeiconsIcon icon={ArrowLeft02Icon} strokeWidth={2} />
          Left
        </Kbd>
        <Kbd>
          <HugeiconsIcon icon={DashedLineCircleIcon} strokeWidth={2} />
          Voice Enabled
        </Kbd>
      </KbdGroup>
    </div>
  );
}
