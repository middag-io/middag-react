import { useState } from "react";

import { Calendar } from "@/primitives/reui/calendar";
import { Card, CardContent } from "@/primitives/reui/card";

export function Pattern() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <Card className="p-0">
      <CardContent className="p-0">
        <Calendar
          classNames={{
            day_button: "!rounded-full",
          }}
          mode="single"
          onSelect={setDate}
          selected={date}
        />
      </CardContent>
    </Card>
  );
}
