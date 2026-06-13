import { Sparkle } from "lucide-react";
import { marqueeItems } from "@/config/site";

export default function Marquee() {
  const row = (
    <>
      {marqueeItems.map((item) => (
        <span
          key={item}
          className="mx-6 inline-flex items-center gap-6 font-display text-lg font-semibold uppercase tracking-wide text-coal sm:text-xl"
        >
          {item}
          <Sparkle className="size-4 shrink-0" aria-hidden />
        </span>
      ))}
    </>
  );

  return (
    <div
      className="marquee-mask relative overflow-hidden border-y border-coal/10 bg-lime py-4"
      aria-label="Our services"
    >
      <div className="animate-marquee flex w-max whitespace-nowrap">
        <div className="flex" aria-hidden={false}>
          {row}
        </div>
        <div className="flex" aria-hidden>
          {row}
        </div>
      </div>
    </div>
  );
}
