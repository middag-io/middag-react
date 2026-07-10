import Link from "next/link";

import { Button } from "@/components/reui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/reui/navigation-menu";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserIcon,
  Building01Icon,
  DollarCircleIcon,
  GridViewIcon,
  SparklesIcon,
  LiveStreaming02Icon,
} from "@hugeicons/core-free-icons";

const industries = [
  {
    title: "Individuals",
    description: "Keep your finances organized.",
    href: "#",
    icon: <HugeiconsIcon icon={UserIcon} strokeWidth={2} />,
  },
  {
    title: "LLCs",
    description: "Benefit from tax write-offs.",
    href: "#",
    icon: <HugeiconsIcon icon={Building01Icon} strokeWidth={2} />,
  },
  {
    title: "Freelancers",
    description: "For independent workers.",
    href: "#",
    icon: <HugeiconsIcon icon={DollarCircleIcon} strokeWidth={2} />,
  },
  {
    title: "Investors",
    description: "Make and grow your money.",
    href: "#",
    icon: <HugeiconsIcon icon={GridViewIcon} strokeWidth={2} />,
  },
  {
    title: "Small businesses",
    description: "We take care of your taxes.",
    href: "#",
    icon: <HugeiconsIcon icon={SparklesIcon} strokeWidth={2} />,
  },
  {
    title: "Crypto",
    description: "For tech enthusiasts.",
    href: "#",
    icon: <HugeiconsIcon icon={DollarCircleIcon} strokeWidth={2} />,
  },
  {
    title: "Big companies",
    description: "Run your finances easily.",
    href: "#",
    icon: <HugeiconsIcon icon={Building01Icon} strokeWidth={2} />,
  },
  {
    title: "Investments",
    description: "Launch your ideas worldwide.",
    href: "#",
    icon: <HugeiconsIcon icon={LiveStreaming02Icon} strokeWidth={2} />,
  },
];

export function Pattern() {
  return (
    <div className="flex items-center justify-center">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Industries</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="w-[500px]">
                <ul className="grid grid-cols-2 gap-1">
                  {industries.map((item) => (
                    <li key={item.title}>
                      <NavigationMenuLink
                        asChild
                        className="flex items-start gap-2 p-3"
                      >
                        <Link href="#">
                          {item.icon}
                          <div className="flex flex-col gap-0.5">
                            <div className="text-sm leading-none font-medium">
                              {item.title}
                            </div>
                            <p className="text-muted-foreground text-xs leading-snug">
                              {item.description}
                            </p>
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
                <div className="mt-2 px-1 pb-1">
                  <Button className="w-full" asChild>
                    <Link href="#">Learn more</Link>
                  </Button>
                </div>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
