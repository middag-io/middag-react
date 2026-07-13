import { Badge } from "@/primitives/reui/badge";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/primitives/reui/accordion";
import { Button } from "@/primitives/reui/button";
import { ButtonGroup } from "@/primitives/reui/button-group";
import { Input } from "@/primitives/reui/input";
import { Spinner } from "@/primitives/reui/spinner";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkCircle01Icon, QrCodeIcon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <div className="mx-auto mb-auto w-full max-w-lg">
      <Accordion
        type="single"
        collapsible
        defaultValue="pos-app"
        className="border-border rounded-4xl overflow-hidden border"
      >
        {/* Step 1: Completed */}
        <AccordionItem
          value="add-products"
          className="px-0 bg-transparent px-4"
        >
          <AccordionTrigger className="items-center py-4 font-semibold hover:no-underline">
            <div className="flex w-full items-center justify-between pr-4">
              <div className="flex items-center justify-center gap-3">
                <div className="flex size-5 items-center justify-center">
                  <HugeiconsIcon
                    icon={CheckmarkCircle01Icon}
                    strokeWidth={2}
                    className="fill-success text-background size-5"
                  />
                </div>
                <span className="text-sm font-medium">Add products</span>
              </div>
              <Badge variant="success-light">Ready</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground pr-0 pb-4 pl-8 leading-relaxed">
            Your products have been successfully added and are ready for sale.
          </AccordionContent>
        </AccordionItem>

        {/* Step 2: Expanded/In Progress */}
        <AccordionItem value="pos-app" className="px-0 bg-transparent px-4">
          <AccordionTrigger className="items-center py-4 font-semibold hover:no-underline">
            <div className="flex w-full items-center justify-between pr-4">
              <div className="flex items-center gap-3">
                <div className="flex size-5 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-950">
                  <div className="size-2 rounded-full bg-yellow-500" />
                </div>
                <span className="text-foreground text-sm font-medium">
                  Get the point of sale application
                </span>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2 pl-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="flex-1 space-y-6">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Scan the QR code or send yourself the link to get the app. The
                  mobile app is where you&apos;ll manage orders, track
                  inventory, and view analytics on the go.
                </p>
                <ButtonGroup>
                  <Input placeholder="james@alignui.com" />
                  <Button variant="outline" aria-label="Send link">
                    Send link
                  </Button>
                </ButtonGroup>
              </div>
              <div className="bg-muted/30 border-border rounded-4xl flex shrink-0 items-center justify-center border p-3">
                <HugeiconsIcon
                  icon={QrCodeIcon}
                  className="size-20"
                  strokeWidth={1.5}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Step 3: Pending */}
        <AccordionItem value="price-stock" className="px-0 bg-transparent px-4">
          <AccordionTrigger className="items-center py-4 font-semibold hover:no-underline">
            <div className="flex w-full items-center justify-between pr-4">
              <div className="flex items-center gap-3">
                <div className="flex size-5 items-center justify-center">
                  <Spinner className="opacity-60" />
                </div>
                <span className="text-muted-foreground text-sm font-medium">
                  Product price & stock
                </span>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground pl-8 text-sm leading-relaxed">
            Configure your product pricing and manage stock levels across all
            locations.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
