import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/primitives/reui/alert-dialog";
import { Button } from "@/primitives/reui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { AlertCircleIcon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Deactivate Account</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <div className="flex items-start gap-3 py-1">
          <div className="bg-destructive/10 dark:bg-destructive/10 rounded-full flex size-10 shrink-0 items-center justify-center">
            <HugeiconsIcon
              icon={AlertCircleIcon}
              strokeWidth={2}
              className="text-destructive size-5"
            />
          </div>
          <div className="flex flex-col justify-center gap-1">
            <AlertDialogTitle className="text-sm font-semibold">
              Deactivate your account?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground text-sm">
              This will disable your account and remove your profile from all
              active searches.
            </AlertDialogDescription>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep My Account</AlertDialogCancel>
          <AlertDialogAction variant="destructive">
            Deactivate Anyway
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
