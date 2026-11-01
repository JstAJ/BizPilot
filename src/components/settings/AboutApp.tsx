import { APP_NAME, APP_TAGLINE, APP_VERSION, APP_BUILD } from "@/constants/app";

export function AboutApp() {
  return (
    <div className="space-y-1.5 text-sm">
      <p className="font-display text-base font-semibold">{APP_NAME}</p>
      <p className="text-muted-foreground">{APP_TAGLINE}</p>
      <p className="text-xs text-muted-foreground">
        Version {APP_VERSION} · Build {APP_BUILD}
      </p>
      <p className="pt-2 text-xs text-muted-foreground">
        Built for manufacturers and small businesses. All data is stored locally on this
        device — BizPilot works fully offline.
      </p>
    </div>
  );
}
