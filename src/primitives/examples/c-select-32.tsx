import { Field } from "@/primitives/reui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/primitives/reui/select";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  File02Icon,
  ImageIcon,
  Video02Icon,
  MusicNote03Icon,
  Archive02Icon,
} from "@hugeicons/core-free-icons";

const categories = [
  {
    value: "documents",
    label: "Documents",
    icon: (
      <HugeiconsIcon icon={File02Icon} strokeWidth={2} className="size-4" />
    ),
  },
  {
    value: "images",
    label: "Images",
    icon: <HugeiconsIcon icon={ImageIcon} strokeWidth={2} className="size-4" />,
  },
  {
    value: "videos",
    label: "Videos",
    icon: (
      <HugeiconsIcon icon={Video02Icon} strokeWidth={2} className="size-4" />
    ),
  },
  {
    value: "audio",
    label: "Audio",
    icon: (
      <HugeiconsIcon
        icon={MusicNote03Icon}
        strokeWidth={2}
        className="size-4"
      />
    ),
  },
  {
    value: "archives",
    label: "Archives",
    icon: (
      <HugeiconsIcon icon={Archive02Icon} strokeWidth={2} className="size-4" />
    ),
  },
];

export function Pattern() {
  return (
    <Field className="max-w-xs">
      <Select defaultValue={categories[0].value}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectGroup>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                <span className="flex items-center gap-2">
                  {category.icon}
                  <span>{category.label}</span>
                </span>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  );
}
