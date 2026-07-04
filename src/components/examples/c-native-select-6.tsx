import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/reui/native-select";

export function Pattern() {
  return (
    <NativeSelect aria-invalid="true" className="w-full max-w-xs">
      <NativeSelectOption value="">Invalid Select</NativeSelectOption>
      <NativeSelectOption value="1">Option 1</NativeSelectOption>
    </NativeSelect>
  );
}
