import { useEffect, useMemo, useState } from "react";
import questions from "../../data/questions.json";
import pictures from "../../data/pictures.json";

// Helper to shuffle an array
function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Helper to build a random challenge
function buildChallenge(): ImageChallenge {
  const question = questions[0];
  const shuffled = shuffle(pictures);
  const selectedPictures = shuffled.slice(0, 9);
  return {
    id: question.questionId + "_" + Math.random().toString(36).slice(2, 8),
    prompt: question.questionContent,
    assets: selectedPictures.map((pic) => ({
      id: pic.pictureId,
      url: pic.image,
      alt: pic.name,
    })),
    rules: { minSelect: 1, maxSelect: 9 },
    nonce: "demo_nonce",
  };
}

// ---------- local types ----------
type ImageAsset = { id: string; url: string; alt?: string };
type ImageChallenge = {
  id: string;
  prompt: string; // e.g., "Select all images with crosswalks"
  assets: ImageAsset[];
  rules?: { minSelect?: number; maxSelect?: number };
  nonce: string;
};

export default function CaptchaImage({
  onSuccess,
  onFail,
}: {
  onSuccess: (token: string) => void;
  onFail?: () => void;
}) {
  const [challenge, setChallenge] = useState<ImageChallenge | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [hint, setHint] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // load challenge
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        // Always use local data for now
        const c: ImageChallenge = buildChallenge();
        if (!cancelled) {
          setChallenge(c);
          setSelected([]);
          setHint(null);
        }
      } catch (e: any) {
        if (!cancelled) setHint(e?.message || "Failed to load challenge");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // ensure exactly 3×3 tiles (pad with blanks if ever short)
  const gridAssets: Array<ImageAsset | null> = useMemo(() => {
    if (!challenge) return Array<ImageAsset | null>(9).fill(null);
    const nine: (ImageAsset | null)[] = [...challenge.assets.slice(0, 9)];
    while (nine.length < 9) nine.push(null);
    return nine;
  }, [challenge]);

  function toggle(id?: string) {
    if (!id) return;
    setSelected((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      if (hint) setHint(null); // Only clear hint if it is currently set
      return next;
    });
  }

  async function submit() {
    if (!challenge) return;
    // Find which assets are correct (isBrainRot=true)
    const correctIds = new Set(
      challenge.assets
        .filter((a) => {
          const pic = pictures.find((p) => p.pictureId === a.id);
          return pic && pic.isBrainRot;
        })
        .map((a) => a.id)
    );
    // Check if selected matches exactly the correct set
    const selectedSet = new Set(selected);
    const isCorrect =
      selected.length === correctIds.size &&
      Array.from(correctIds).every((id) => selectedSet.has(id));
    if (isCorrect) {
      onSuccess("boom_mock_token");
    } else {
      setHint("Incorrect selection. Try again!");
      if (onFail) onFail();
      // Do not auto-reload; let the user try again or reload manually
    }
  }

  function reloadChallenge() {
    setChallenge(buildChallenge());
    setSelected([]);
    setHint(null);
  }

  const minSel = challenge?.rules?.minSelect ?? 0;
  const maxSel = challenge?.rules?.maxSelect ?? Infinity;
  const canSubmit = selected.length >= minSel && selected.length <= maxSel;

  if (loading)
    return (
      <div className="p-4 bg-white border rounded-md shadow-md max-w-sm w-full">
        Loading…
      </div>
    );
  if (!challenge)
    return (
      <div className="p-4 bg-white border rounded-md shadow-md max-w-sm w-full text-red-600">
        Couldn’t load challenge.
      </div>
    );

  return (
    <div className="max-w-sm w-full rounded-md bg-white shadow-md border border-gray-200 overflow-hidden">
      {/* Header (Google-like blue bar) */}
      <div className="bg-[#1a73e8] text-white px-4 py-3">
        <div className="text-base leading-4 font-normal">
          Select all images with
        </div>
        <div className="text-xl leading-6 font-black">
          {/* Roboto Black 900 */}
          {/** Emphasize the key noun in the prompt if present */}
          {highlightTargetFromPrompt("BrainRot")}
        </div>
        <div className="text-[12px] opacity-90 mt-1">
          Click verify once there are none left.
        </div>
      </div>

      {/* Grid (tight gaps, thin separators) */}
      <div className="p-3">
        <div
          className="grid grid-cols-3 gap-[4px] bg-white"
          role="group"
          aria-label={challenge.prompt}
        >
          {gridAssets.map((a, i) => {
            const id = a?.id;
            const isSelected = !!(id && selected.includes(id));
            return (
              <button
                key={id ?? `blank-${i}`}
                type="button"
                onClick={() => toggle(id)}
                disabled={!id}
                aria-pressed={isSelected}
                aria-label={a?.alt ?? "blank"}
                className={`relative aspect-square bg-gray-100 overflow-hidden 
                  ${
                    id
                      ? "hover:outline hover:outline-1 hover:outline-gray-300"
                      : "opacity-40 cursor-not-allowed"
                  }`}
              >
                {a ? (
                  <img
                    src={a.url}
                    alt={a.alt ?? ""}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full grid place-items-center text-[11px] text-gray-400">
                    empty
                  </div>
                )}

                {/* Selected overlay + check */}
                {isSelected && (
                  <>
                    <div className="absolute inset-0 bg-blue-600/25" />
                    <span className="absolute top-1 right-1 inline-flex items-center justify-center w-5 h-5 rounded-sm bg-white shadow text-blue-600 text-xs font-bold">
                      ✓
                    </span>
                  </>
                )}
              </button>
            );
          })}
        </div>

        {/* Rule/hint text */}
        <div className="mt-2">
          {minSel > 0 && (
            <div className="text-[12px] text-gray-600">
              Select at least {minSel}. Currently {selected.length}.
            </div>
          )}
          {hint && (
            <div className="text-[12px] text-red-600 mt-1">💡 {hint}</div>
          )}
        </div>
      </div>

      {/* Footer actions (icons + VERIFY button) */}
      <div className="px-3 py-2 flex items-center justify-between border-t border-gray-200">
        <div className="flex items-center gap-3 text-gray-500">
          {/* simple SVGs as placeholders */}
          <button
            className="p-1 hover:text-gray-700"
            title="Reload"
            onClick={reloadChallenge}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 12a9 9 0 1 1-2.64-6.36"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21 3v7h-7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button className="p-1 hover:text-gray-700" title="Audio">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M11 5l-5 5H3v4h3l5 5V5z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19 12a7 7 0 0 0-7-7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <button className="p-1 hover:text-gray-700" title="Help">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M9.5 9a2.5 2.5 0 1 1 3.9 2.1c-.8.5-1.4 1.1-1.4 2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="12" cy="17" r="1" fill="currentColor" />
            </svg>
          </button>
        </div>
        <button
          className={`px-4 py-1.5 rounded-sm text-sm font-medium ${
            canSubmit
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
          disabled={!canSubmit}
          onClick={submit}
        >
          VERIFY
        </button>
      </div>
    </div>
  );
}

/** Heuristic: try to bold the noun in the prompt the way reCAPTCHA does */
function highlightTargetFromPrompt(prompt: string) {
  // e.g., "Select all images with crosswalks" -> <span>Select all images with </span><strong>crosswalks</strong>
  const m = prompt.match(/(.*\bwith\s+)(.+)$/i);
  if (!m) return <span className="font-black">{prompt}</span>;
  return (
    <>
      <span className="font-normal">{m[1]}</span>
      <span className="font-black">{m[2]}</span>
    </>
  );
}
