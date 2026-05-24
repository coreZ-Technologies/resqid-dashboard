"use client";

import { useRouter } from "next/navigation";

const BLOCKS = [
    { w: "w-5", h: "h-5", left: "left-[8%]", dur: "[14s]", delay: "[0s]" },
    { w: "w-3", h: "h-3", left: "left-[22%]", dur: "[18s]", delay: "[2s]" },
    { w: "w-6", h: "h-2", left: "left-[58%]", dur: "[12s]", delay: "[4s]" },
    { w: "w-4", h: "h-4", left: "left-[78%]", dur: "[16s]", delay: "[1s]" },
    { w: "w-2", h: "h-6", left: "left-[43%]", dur: "[20s]", delay: "[3s]" },
    { w: "w-4", h: "h-4", left: "left-[88%]", dur: "[15s]", delay: "[5s]" },
];

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background px-6">

            {/* Floating blocks */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                {BLOCKS.map((b, i) => (
                    <div
                        key={i}
                        className={`absolute ${b.w} ${b.h} ${b.left} rounded-md bg-foreground opacity-[0.04] animate-[float404_linear_infinite]`}
                        style={{ animationDuration: b.dur.replace(/[\[\]]/g, ""), animationDelay: b.delay.replace(/[\[\]]/g, "") }}
                    />
                ))}
            </div>

            {/* 4 [FACE] 4 */}
            <div className="flex items-center gap-3 mb-6">

                {/* Left 4 */}
                <span className="text-[80px] font-bold leading-none tracking-[-6px] text-foreground select-none">
                    4
                </span>

                {/* Notion face */}
                <div className="relative w-[140px] h-[140px] flex items-center justify-center" aria-hidden="true">
                    {/* Ears */}
                    <div className="absolute top-1/2 -translate-y-1/2 flex justify-between w-[136px]">
                        <div className="w-3 h-7 rounded-md bg-muted border border-border" />
                        <div className="w-3 h-7 rounded-md bg-muted border border-border" />
                    </div>
                    {/* Head */}
                    <div className="relative w-[120px] h-[120px] rounded-[24px] bg-muted border-2 border-border flex flex-col items-center justify-center gap-1">
                        {/* Sweat drop */}
                        <div
                            className="absolute top-3 right-3 w-2 h-3.5 bg-blue-400 opacity-80 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] animate-[drip404_2.5s_ease-in-out_infinite]"
                        />
                        {/* Eyes */}
                        <div className="flex gap-5 mb-1">
                            <div className="relative w-4 h-4 rounded-full bg-foreground animate-[blink404_4s_ease-in-out_infinite]">
                                <div className="absolute top-[3px] left-[3px] w-1.5 h-1.5 rounded-full bg-background" />
                            </div>
                            <div className="relative w-4 h-4 rounded-full bg-foreground animate-[blink404_4s_ease-in-out_0.1s_infinite]">
                                <div className="absolute top-[3px] left-[3px] w-1.5 h-1.5 rounded-full bg-background" />
                            </div>
                        </div>
                        {/* Mouth — sad */}
                        <div className="w-7 h-2.5 border-2 border-foreground border-t-0 rounded-b-[14px]" />
                    </div>
                </div>

                {/* Right 4 */}
                <span className="text-[80px] font-bold leading-none tracking-[-6px] text-foreground select-none">
                    4
                </span>
            </div>

            {/* Text */}
            <h1 className="text-2xl font-semibold text-foreground mb-2 text-center">
                Oops, this page got lost
            </h1>
            <p className="text-sm text-muted-foreground text-center max-w-xs leading-relaxed mb-8">
                The page you&apos;re looking for doesn&apos;t exist or may have moved.
                Let&apos;s get you back on track.
            </p>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 justify-center">
                <button
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-2 rounded-lg bg-foreground text-background px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-75"
                >
                    ← Go back
                </button>
                <button
                    onClick={() => router.push("/login")}
                    className="inline-flex items-center gap-2 rounded-lg border border-border bg-transparent text-muted-foreground px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground"
                >
                    🏠 Go to login
                </button>
            </div>

            {/* Breadcrumb trail */}
            <div className="flex items-center gap-2 mt-10 text-xs text-muted-foreground/50 select-none" aria-hidden="true">
                <span>home</span>
                <span className="w-1 h-1 rounded-full bg-muted-foreground/50 inline-block" />
                <span>???</span>
                <span className="w-1 h-1 rounded-full bg-muted-foreground/50 inline-block" />
                <span className="text-destructive">404</span>
            </div>

            <style>{`
        @keyframes float404 {
          0%   { transform: translateY(100vh) rotate(0deg); }
          100% { transform: translateY(-200px) rotate(180deg); }
        }
        @keyframes blink404 {
          0%, 90%, 100% { transform: scaleY(1); }
          95%           { transform: scaleY(0.1); }
        }
        @keyframes drip404 {
          0%, 100% { transform: translateY(0) scaleY(1); }
          50%      { transform: translateY(3px) scaleY(1.2); }
        }
      `}</style>
        </div>
    );
}