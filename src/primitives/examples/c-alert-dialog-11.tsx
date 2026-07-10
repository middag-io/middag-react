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
import { ShieldEnergyIcon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">System Update</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="gap-0 p-0 sm:max-w-sm">
        <div className="mx-auto flex flex-col items-center justify-center gap-2 p-8">
          <AlertDialogMedia className="bg-info/10 text-info dark:bg-info/20 rounded-full size-12">
            <HugeiconsIcon
              icon={ShieldEnergyIcon}
              strokeWidth={2}
              className="size-6"
            />
          </AlertDialogMedia>
          <AlertDialogTitle className="text-center">
            System Update Available!
          </AlertDialogTitle>
          <Badge variant="success-light">Release v28.1.0 (2026-01-12)</Badge>
        </div>

        <div className="bg-muted/60 rounded-b-2xl flex flex-col items-center justify-center gap-5 p-6">
          <AlertDialogDescription className="text-muted-foreground text-center">
            A new version of the application is ready. Restarting now will apply
            the latest security patches and features.
          </AlertDialogDescription>
          <AlertDialogFooter className="gap-4">
            <AlertDialogCancel>Remind Me Later</AlertDialogCancel>
            <AlertDialogAction>Update Now</AlertDialogAction>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
