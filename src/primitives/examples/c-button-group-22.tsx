import { Button } from "@/primitives/reui/button";
import { ButtonGroup } from "@/primitives/reui/button-group";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  FileEmpty02Icon,
  FolderIcon,
  DeleteIcon,
} from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <ButtonGroup>
      <Button variant="outline" aria-label="Files">
        <HugeiconsIcon
          icon={FileEmpty02Icon}
          strokeWidth={2}
          aria-hidden="true"
        />
        Files
      </Button>
      <Button variant="outline" disabled aria-label="Folder">
        <HugeiconsIcon icon={FolderIcon} strokeWidth={2} aria-hidden="true" />
        Folder
      </Button>
      <Button variant="outline" aria-label="Trash">
        <HugeiconsIcon icon={DeleteIcon} strokeWidth={2} aria-hidden="true" />
        Trash
      </Button>
    </ButtonGroup>
  );
}
