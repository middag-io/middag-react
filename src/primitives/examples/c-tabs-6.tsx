import { Card, CardContent } from "@/primitives/reui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/primitives/reui/tabs";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DashboardSquare02Icon,
  ChartBarLineIcon,
  SettingsIcon,
} from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <Tabs defaultValue="overview">
        <TabsList className="w-full">
          <TabsTrigger value="overview">
            <HugeiconsIcon
              icon={DashboardSquare02Icon}
              strokeWidth={2}
              className="size-4"
            />
            Overview
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <HugeiconsIcon
              icon={ChartBarLineIcon}
              strokeWidth={2}
              className="size-4"
            />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="settings">
            <HugeiconsIcon
              icon={SettingsIcon}
              strokeWidth={2}
              className="size-4"
            />
            Settings
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card>
            <CardContent>Overview dashboard content goes here.</CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analytics">
          <Card>
            <CardContent>Analytics charts and metrics.</CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="settings">
          <Card>
            <CardContent>Application settings and preferences.</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
