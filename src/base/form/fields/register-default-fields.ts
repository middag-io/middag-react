/**
 * Registers all built-in field components in the field registry.
 *
 * Called by registerDefaults(). The field registry enables consumers to
 * register custom field types (e.g. registerFieldComponent("rating", RatingField))
 * without modifying FormField.tsx.
 *
 * Built-in fields are registered eagerly here because they are already
 * imported by FormField.tsx — the registry simply makes them discoverable
 * for custom form renderers and type lookups.
 */

// Import all built-in field components
import { CheckboxField } from "./CheckboxField";
import { ColorField } from "./ColorField";
import { CurrencyField } from "./CurrencyField";
// DateField and DocumentField are NOT registered here — they're lazy-loaded
// in FormField.tsx to avoid bundling date-fns+react-day-picker (~115KB) and
// validator.js (~28KB) in the main chunk. Same pattern as PhoneField.
import { EntityPickerField } from "./EntityPickerField";
import { registerFieldComponent } from "./field-registry";
import { FileUploadField } from "./FileUploadField";
import { MultiSelectField } from "./MultiSelectField";
import { NativeSelectField } from "./NativeSelectField";
import { NumberFieldComponent } from "./NumberField";
import { OtpField } from "./OtpField";
import { PasswordField } from "./PasswordField";
import { RadioField } from "./RadioField";
import { RatingField } from "./RatingField";
import { SelectField } from "./SelectField";
import { SliderField } from "./SliderField";
import { SlugField } from "./SlugField";
import { StaticField } from "./StaticField";
import { SwitchField } from "./SwitchField";
import { TagsField } from "./TagsField";
import { TextareaField } from "./TextareaField";
import { TextField } from "./TextField";

let registered = false;

export function registerDefaultFields(): void {
  if (registered) return;
  registered = true;

  // Text-based
  registerFieldComponent("text", TextField);
  registerFieldComponent("email", TextField);
  registerFieldComponent("url", TextField);
  registerFieldComponent("password", PasswordField);
  registerFieldComponent("otp", OtpField);
  registerFieldComponent("textarea", TextareaField);

  // Numeric
  registerFieldComponent("int", NumberFieldComponent);
  registerFieldComponent("float", NumberFieldComponent);
  registerFieldComponent("slider", SliderField);

  // Selection
  registerFieldComponent("select", SelectField);
  registerFieldComponent("native_select", NativeSelectField);
  registerFieldComponent("multiselect", MultiSelectField);
  registerFieldComponent("radio", RadioField);

  // Boolean
  registerFieldComponent("checkbox", CheckboxField);
  registerFieldComponent("switch", SwitchField);

  // Note: "date" and "datetime" are NOT registered here — they're lazy-loaded
  // in FormField.tsx to avoid bundling date-fns+react-day-picker (~115KB).

  // Specialized
  // Note: "document" is NOT registered here — it's lazy-loaded in FormField.tsx
  // to avoid bundling validator.js (~28KB) in the main chunk.
  registerFieldComponent("currency", CurrencyField);
  registerFieldComponent("entity_picker", EntityPickerField);
  registerFieldComponent("slug", SlugField);
  registerFieldComponent("tags", TagsField);
  registerFieldComponent("file", FileUploadField);
  registerFieldComponent("rating", RatingField);
  registerFieldComponent("color", ColorField);
  registerFieldComponent("static", StaticField);

  // Note: "phone" is NOT registered here — it's lazy-loaded in FormField.tsx
  // to avoid bundling libphonenumber-js (~40KB) in the main chunk.
  // Custom renderers that need phone support should lazy-import PhoneField.
}
