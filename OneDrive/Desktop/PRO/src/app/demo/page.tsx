import { PremiumHero } from "@/components/ui/hero";

export default function DemoOne() {
  const noop = () => {};
  return <PremiumHero onRegister={noop} onDemo={noop} />;
}
