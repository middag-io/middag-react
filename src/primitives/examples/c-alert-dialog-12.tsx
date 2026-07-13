import { Badge } from "@/primitives/reui/badge";

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
} from "@/primitives/reui/alert-dialog";
import { Button } from "@/primitives/reui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { NotificationIcon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Subscription Expiring</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="gap-0 p-0 sm:max-w-sm">
        <div className="mx-auto flex flex-col items-center justify-center gap-2 p-8">
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 rounded-full size-12">
            <HugeiconsIcon
              icon={NotificationIcon}
              strokeWidth={2}
              className="size-6"
            />
          </AlertDialogMedia>
          <AlertDialogTitle className="text-center">
            Subscription Expiring Soon
          </AlertDialogTitle>
          <Badge variant="destructive-light" className="font-normal">
            Expires in 2 days
          </Badge>
        </div>

        <div className="bg-muted/60 rounded-b-2xl flex flex-col items-center justify-center gap-5 p-6">
          <AlertDialogDescription className="text-muted-foreground text-center">
            Your current plan will expire in 2 days. Update your payment method
            now to ensure uninterrupted access to your Pro features.
          </AlertDialogDescription>
          <AlertDialogFooter className="gap-4">
            <AlertDialogCancel>Remind Me Later</AlertDialogCancel>
            <AlertDialogAction>Update Payment</AlertDialogAction>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
