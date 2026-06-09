import { AccessGate } from "@/components/AccessGate";
import { PoiDetailApp } from "@/components/PoiDetailApp";

export default function PoiPage({ params }: { params: { slug: string } }) {
  return (
    <AccessGate>
      <PoiDetailApp slug={params.slug} />
    </AccessGate>
  );
}
