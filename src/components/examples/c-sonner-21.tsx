import { useRef } from "react";
import { toast } from "sonner";

import { Button } from "@/components/reui/button";
import { Spinner } from "@/components/reui/spinner";
import { HugeiconsIcon } from "@hugeicons/react";
import { Tick02Icon } from "@hugeicons/core-free-icons";

function LoadingToast({ message }: { message: string }) {
  return (
    <div className="bg-popover text-popover-foreground border-border rounded-3xl flex w-[356px] items-center gap-3 border p-4 shadow-lg">
      <Spinner className="size-4 opacity-60" />
      <p className="text-xs font-medium">{message}</p>
    </div>
  );
}

function SuccessToast() {
  return (
    <div className="bg-popover text-popover-foreground border-border rounded-3xl flex w-[356px] items-start gap-3 border p-4 shadow-lg">
      <div className="flex size-4 shrink-0 items-center justify-center rounded-full bg-green-500 text-white">
        <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} className="size-3" />
      </div>
      <div className="flex flex-1 flex-col gap-0.5">
        <p className="text-xs font-semibold">Upload complete!</p>
        <p className="text-muted-foreground text-xs">
          3 files uploaded successfully.
        </p>
      </div>
    </div>
  );
}

export function Pattern() {
  const toastId = useRef<string | number | undefined>(undefined);

  const startProgress = () => {
    toastId.current = toast.custom(
      () => <LoadingToast message="Preparing upload..." />,
      { duration: Infinity },
    );

    setTimeout(() => {
      toast.custom(() => <LoadingToast message="Uploading files... 30%" />, {
        id: toastId.current,
        duration: Infinity,
      });
    }, 1000);

    setTimeout(() => {
      toast.custom(() => <LoadingToast message="Uploading files... 70%" />, {
        id: toastId.current,
        duration: Infinity,
      });
    }, 2000);

    setTimeout(() => {
      toast.custom(() => <SuccessToast />, {
        id: toastId.current,
        duration: 4000,
      });
    }, 3000);
  };

  return (
    <div className="flex items-center justify-center">
      <Button onClick={startProgress} variant="outline" className="w-fit">
        Updatable Toast
      </Button>
    </div>
  );
}
