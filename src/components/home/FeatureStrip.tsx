import { CameraIcon, HeartIcon, MapIcon, PeaksIcon } from "../icons";
import { Reveal } from "../Reveal";

const FEATURES = [
  { Icon: MapIcon, title: "Explore", text: "New Destinations" },
  { Icon: CameraIcon, title: "Capture", text: "Beautiful Moments" },
  { Icon: PeaksIcon, title: "Experience", text: "Real Adventures" },
  { Icon: HeartIcon, title: "Create", text: "Lifelong Memories" },
];

export function FeatureStrip() {
  return (
    <section className="bg-coal">
      <div className="container-page grid grid-cols-2 gap-y-8 py-10 sm:py-12 md:grid-cols-4">
        {FEATURES.map(({ Icon, title, text }, i) => (
          <Reveal key={title} delay={i * 0.08} className="flex flex-col items-center text-center md:border-l md:border-line/15 md:first:border-l-0">
            <Icon width={34} height={34} strokeWidth={1.3} className="text-forest" />
            <p className="mt-3 text-lg font-medium text-mist">{title}</p>
            <p className="text-sm text-fog">{text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
