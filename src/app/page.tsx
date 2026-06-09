import { AccessGate } from "@/components/AccessGate";
import { PoiListApp } from "@/components/PoiListApp";

export default function HomePage() {
  return (
    <AccessGate>
      <PoiListApp />
    </AccessGate>
  );
}
