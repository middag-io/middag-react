import { ToggleGroup, ToggleGroupItem } from "@/components/reui/toggle-group";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  MailIcon,
  Call02Icon,
  NotificationIcon,
  Message02Icon,
} from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <div className="flex items-center justify-center">
      <ToggleGroup
        type="multiple"
        defaultValue={["email", "push"]}
        variant="outline"
        spacing={1}
      >
        <ToggleGroupItem value="email" aria-label="Email notifications">
          <HugeiconsIcon icon={MailIcon} strokeWidth={2} />
          Email
        </ToggleGroupItem>
        <ToggleGroupItem value="sms" aria-label="SMS notifications">
          <HugeiconsIcon icon={Call02Icon} strokeWidth={2} />
          SMS
        </ToggleGroupItem>
        <ToggleGroupItem value="push" aria-label="Push notifications">
          <HugeiconsIcon icon={NotificationIcon} strokeWidth={2} />
          Push
        </ToggleGroupItem>
        <ToggleGroupItem value="slack" aria-label="Slack notifications">
          <HugeiconsIcon icon={Message02Icon} strokeWidth={2} />
          Slack
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
