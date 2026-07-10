import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/primitives/reui/dropdown-menu";
import { Field } from "@/primitives/reui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/primitives/reui/input-group";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  PlusSignIcon,
  Attachment02Icon,
  ImageIcon,
  AiBrain01Icon,
  Search01Icon,
  ShoppingBag01Icon,
  SparklesIcon,
  BookOpen01Icon,
  Globe02Icon,
  DashboardSquare02Icon,
  BrowserIcon,
  Mic02Icon,
  AudioWave01Icon,
} from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <Field className="max-w-3xl">
      <InputGroup className="bg-background rounded-full h-14 border p-1.5">
        <InputGroupAddon className="border-none pl-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <InputGroupButton
                variant="ghost"
                size="icon-sm"
                className="text-muted-foreground hover:text-foreground rounded-full size-10"
              >
                <HugeiconsIcon
                  icon={PlusSignIcon}
                  strokeWidth={2}
                  className="size-6"
                />
              </InputGroupButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              align="start"
              sideOffset={12}
              className="w-56"
            >
              <DropdownMenuItem>
                <HugeiconsIcon icon={Attachment02Icon} strokeWidth={2} />
                <span>Add photos & files</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="-mx-3" />
              <DropdownMenuItem>
                <HugeiconsIcon icon={ImageIcon} strokeWidth={2} />
                <span>Create image</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HugeiconsIcon icon={AiBrain01Icon} strokeWidth={2} />
                <span>Thinking</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HugeiconsIcon icon={Search01Icon} strokeWidth={2} />
                <span>Deep research</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HugeiconsIcon icon={ShoppingBag01Icon} strokeWidth={2} />
                <span>Shopping research</span>
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <HugeiconsIcon icon={SparklesIcon} strokeWidth={2} />
                  <span>More</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-44">
                  <DropdownMenuItem>
                    <HugeiconsIcon icon={BookOpen01Icon} strokeWidth={2} />
                    <span>Study and learn</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <HugeiconsIcon icon={Globe02Icon} strokeWidth={2} />
                    <span>Web search</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <HugeiconsIcon
                      icon={DashboardSquare02Icon}
                      strokeWidth={2}
                    />
                    <span>Canvas</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <HugeiconsIcon icon={BrowserIcon} strokeWidth={2} />
                    <span>Explore apps</span>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
        </InputGroupAddon>

        <InputGroupInput
          placeholder="Ask anything"
          className="placeholder:text-muted-foreground/70 border-none px-2 text-lg shadow-none focus-visible:ring-0"
        />

        <InputGroupAddon align="inline-end" className="gap-2 border-none pr-1">
          <InputGroupButton
            variant="ghost"
            className="text-muted-foreground hover:text-foreground rounded-full size-11"
          >
            <HugeiconsIcon
              icon={Mic02Icon}
              strokeWidth={2}
              className="size-5"
            />
          </InputGroupButton>
          <InputGroupButton
            variant="default"
            className="rounded-full size-11 bg-black text-white hover:bg-black/90"
          >
            <HugeiconsIcon
              icon={AudioWave01Icon}
              strokeWidth={2}
              className="size-5"
            />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}
