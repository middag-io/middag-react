import {
  NativeSelect,
  NativeSelectOption,
} from "@/primitives/reui/native-select";

export function Pattern() {
  return (
    <NativeSelect disabled className="w-full max-w-xs">
      <NativeSelectOption value="">Disabled Select</NativeSelectOption>
      <NativeSelectOption value="1">Option 1</NativeSelectOption>
    </NativeSelect>
  );
}
