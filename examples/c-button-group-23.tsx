import { Button } from "@/components/reui/button";
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/components/reui/button-group";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  FileEmpty02Icon,
  FolderIcon,
  ImageIcon,
} from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <ButtonGroup className="**:data-[slot=button]:border-0">
      <Button aria-label="Files">
        <HugeiconsIcon
          icon={FileEmpty02Icon}
          strokeWidth={2}
          aria-hidden="true"
        />
        Files
      </Button>
      <ButtonGroupSeparator className="bg-primary/72" />
      <Button aria-label="Folder">
        <HugeiconsIcon icon={FolderIcon} strokeWidth={2} aria-hidden="true" />
        Folder
      </Button>
      <ButtonGroupSeparator className="bg-primary/72" />
      <Button aria-label="Trash">
        <HugeiconsIcon icon={ImageIcon} strokeWidth={2} aria-hidden="true" />
        Media
      </Button>
    </ButtonGroup>
  );
}
