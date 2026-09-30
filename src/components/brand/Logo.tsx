// A self-contained mark (its own background baked in, not a currentColor
// glyph dropped into an external badge div) so it renders identically
// wherever it's placed — sidebar, mobile drawer, login screen. Deliberately
// solid colors only, no <defs>/gradient/id: two copies of this SVG can be
// in the DOM at once (desktop sidebar + mobile drawer, one hidden by CSS,
// not unmounted), and duplicate ids on a gradient would be invalid HTML.
export function LogoMark({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="40" height="40" rx="11" fill="#4f46e5" />
      <polygon points="20,8 31,17.5 9,17.5" fill="white" />
      <rect x="12" y="17.5" width="16" height="13" rx="2" fill="white" />
      <rect x="17.5" y="23" width="5" height="7.5" rx="1" fill="#4f46e5" />
    </svg>
  );
}

export function Logo({
  size = 32,
  title = "HomeService",
  subtitle,
  titleClassName = "text-sm font-semibold text-white",
  subtitleClassName = "text-xs text-slate-400",
}: {
  size?: number;
  title?: string;
  subtitle?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <LogoMark size={size} />
      {(title || subtitle) && (
        <div>
          {title ? <p className={titleClassName}>{title}</p> : null}
          {subtitle ? <p className={subtitleClassName}>{subtitle}</p> : null}
        </div>
      )}
    </div>
  );
}
