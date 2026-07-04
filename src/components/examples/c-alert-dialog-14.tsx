import { Badge } from "@/components/reui/badge";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/reui/alert-dialog";
import { Button } from "@/components/reui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  SquareLock01Icon,
  FingerPrintIcon,
  Key02Icon,
  ShieldEnergyIcon,
} from "@hugeicons/core-free-icons";

const SECURITY_ITEMS = [
  {
    icon: (
      <HugeiconsIcon
        icon={SquareLock01Icon}
        strokeWidth={2}
        className="text-muted-foreground size-4"
      />
    ),
    title: "Password Policy",
    description: "Verify strength and rotation",
    status: "Pending",
  },
  {
    icon: (
      <HugeiconsIcon
        icon={FingerPrintIcon}
        strokeWidth={2}
        className="text-muted-foreground size-4"
      />
    ),
    title: "Biometric Status",
    description: "Check hardware encryption",
    status: "Done",
  },
  {
    icon: (
      <HugeiconsIcon
        icon={Key02Icon}
        strokeWidth={2}
        className="text-muted-foreground size-4"
      />
    ),
    title: "Active Sessions",
    description: "Review connected devices",
    status: "Pending",
  },
];

export function Pattern() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Advanced Security Check</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-sm! gap-0 overflow-hidden p-0">
        {/* Header */}
        <div className="flex flex-col items-center justify-center gap-1.5 px-4 pt-6 pb-5 text-center">
          <AlertDialogMedia className="rounded-full size-12 bg-green-50 text-green-500 dark:bg-green-950 dark:text-green-400">
            <HugeiconsIcon
              icon={ShieldEnergyIcon}
              strokeWidth={2}
              className="size-6"
            />
          </AlertDialogMedia>
          <AlertDialogTitle className="text-base font-semibold">
            Advanced Security Audit
          </AlertDialogTitle>
          <AlertDialogDescription className="p-0 text-sm">
            Summary of your account status and security settings.
          </AlertDialogDescription>
        </div>

        {/* Content */}
        <div className="space-y-3 p-4">
          {SECURITY_ITEMS.map((item) => (
            <div
              key={item.title}
              className="border-border rounded-4xl flex items-center justify-between border border-dashed px-3 py-2.5"
            >
              <div className="flex items-center gap-2.5">
                <div className="bg-background border-border/80 rounded-4xl flex size-8 items-center justify-center border shadow-xs">
                  {item.icon}
                </div>
                <div className="flex flex-col gap-0.25">
                  <span className="text-sm font-medium">{item.title}</span>
                  <span className="text-muted-foreground text-xs">
                    {item.description}
                  </span>
                </div>
              </div>
              <Badge
                variant={
                  item.status === "Pending" ? "warning-light" : "success-light"
                }
              >
                {item.status}
              </Badge>
            </div>
          ))}
        </div>

        {/* Footer */}
        <AlertDialogFooter className="grid grid-cols-1 gap-2 p-4">
          <AlertDialogAction variant="default" className="flex-1">
            Start Deep Audit
          </AlertDialogAction>
          <AlertDialogCancel variant="ghost" className="flex-1">
            Skip for now
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
