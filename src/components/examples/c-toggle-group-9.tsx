import { ToggleGroup, ToggleGroupItem } from "@/components/reui/toggle-group";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Wifi01Icon,
  BluetoothIcon,
  AirplaneModeIcon,
  Location06Icon,
} from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <div className="flex items-center justify-center">
      <ToggleGroup
        type="multiple"
        orientation="vertical"
        spacing={1}
        defaultValue={["wifi", "bluetooth"]}
      >
        <ToggleGroupItem value="wifi" aria-label="Wi-Fi" className="w-full">
          <HugeiconsIcon icon={Wifi01Icon} strokeWidth={2} />
          Wi-Fi
        </ToggleGroupItem>
        <ToggleGroupItem
          value="bluetooth"
          aria-label="Bluetooth"
          className="w-full"
        >
          <HugeiconsIcon icon={BluetoothIcon} strokeWidth={2} />
          Bluetooth
        </ToggleGroupItem>
        <ToggleGroupItem
          value="airplane"
          aria-label="Airplane Mode"
          className="w-full"
        >
          <HugeiconsIcon icon={AirplaneModeIcon} strokeWidth={2} />
          Airplane Mode
        </ToggleGroupItem>
        <ToggleGroupItem
          value="location"
          aria-label="Location"
          className="w-full"
        >
          <HugeiconsIcon icon={Location06Icon} strokeWidth={2} />
          Location
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
