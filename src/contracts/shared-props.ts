/**
 * Shared props — the Inertia props every host sends on each request.
 *
 * The wire shape is generated from the middag-php-ui 'SharedProps' value object
 * (schema/shared-props.json). Read them with usePage<SharedProps>().props.
 */

export type { FlashMessages, SharedAuth, SharedProps, SharedTheme } from "@/contracts/generated";
