import type { ImageChallenge } from "../api/imageCaptcha";

type Props = {
  /** The challenge payload to render (prompt + images). */
  challenge: ImageChallenge;
  /** The currently selected image IDs. */
  value: string[];
  /** Called whenever selection changes. */
  onChange: (ids: string[]) => void;
};

/**
 * Renders a grid of images for an "image selection" captcha.
 * Users can click or press space/enter to toggle images.
 */
export default function ImageSelectGrid({ challenge, value, onChange }: Props) {
  function toggle(id: string) {
    onChange(
      value.includes(id) ? value.filter((x) => x !== id) : [...value, id]
    );
  }

  return (
    <div className="space-y-2">
      <div className="font-semibold">{challenge.prompt}</div>
      <div
        className="grid grid-cols-3 gap-2"
        role="group"
        aria-label={challenge.prompt}
      >
        {challenge.assets.map((asset) => {
          const selected = value.includes(asset.id);
          return (
            <button
              key={asset.id}
              type="button"
              onClick={() => toggle(asset.id)}
              onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault();
                  toggle(asset.id);
                }
              }}
              aria-pressed={selected}
              aria-label={asset.alt ?? asset.id}
              className={`relative border rounded-md overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                selected ? "ring-4 ring-blue-500" : ""
              }`}
            >
              <img
                src={asset.url}
                alt={asset.alt ?? ""}
                className="w-full h-24 object-cover"
              />
              {selected && (
                <span className="absolute top-1 right-1 text-xs px-1.5 py-0.5 bg-white/80 rounded">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
