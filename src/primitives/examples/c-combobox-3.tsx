import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/primitives/reui/combobox";
import { Field, FieldError, FieldLabel } from "@/primitives/reui/field";

const frameworks = ["Next.js", "SvelteKit", "Nuxt.js", "Remix", "Astro"];

export function Pattern() {
  return (
    <Field className="max-w-xs" data-invalid>
      <FieldLabel htmlFor="combobox-framework-invalid">Framework</FieldLabel>
      <Combobox items={frameworks}>
        <ComboboxInput
          id="combobox-framework-invalid"
          placeholder="Select a framework"
          aria-invalid
        />
        <ComboboxContent>
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <FieldError errors={[{ message: "This field is required." }]} />
    </Field>
  );
}
