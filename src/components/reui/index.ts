/**
 * reui barrel — primitive UI surface for host-runtime consumers.
 *
 * Re-exports the reui primitives promoted to the package root barrel so
 * consumers import them from "@middag-io/react" (D-03 barrel-root only) instead
 * of deep "/reui/*" subpaths. Re-exported by ../../index.ts via
 * `export * from "@/components/reui"`. The curated reui pieces already exported
 * directly by the root barrel (sidebar, sonner, tooltip, dropdown-menu) stay
 * there to preserve their existing curated surface.
 */
export { Badge, badgeVariants, type BadgeProps } from "./badge";
export { Button, buttonVariants } from "./button";
export { Skeleton } from "./skeleton";
export { Input } from "./input";
export {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
} from "./empty";
export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./select";
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
} from "./card";
export { Progress } from "./progress";
export { Alert, AlertTitle, AlertDescription, AlertAction } from "./alert";
export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog";
export {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxGroup,
  ComboboxLabel,
  ComboboxCollection,
  ComboboxEmpty,
  ComboboxSeparator,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipsInput,
  ComboboxTrigger,
  ComboboxValue,
  useComboboxAnchor,
} from "./combobox";
export { Switch } from "./switch";
export { Textarea } from "./textarea";
export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
export {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "./collapsible";
export { Spinner } from "./spinner";
export { Label } from "./label";
