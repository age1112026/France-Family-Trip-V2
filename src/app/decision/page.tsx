import { AccessGate } from "@/components/AccessGate";
import { DecisionApp } from "@/components/DecisionApp";

export default function DecisionPage() {
  return (
    <AccessGate>
      <DecisionApp />
    </AccessGate>
  );
}
