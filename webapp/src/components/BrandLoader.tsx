import { JENEVIV_LOGO } from "@/lib/brand";

/**
 * The brand loader: the logo arrives in two halves, one from above and one from
 * below, meets in the middle, then the whole mark turns. Shown while the app is
 * opening a session.
 */
const CSS = `
@keyframes brand-half-top {
  0%   { transform: translateY(-150%); opacity: 0; }
  55%  { transform: translateY(0);     opacity: 1; }
  100% { transform: translateY(0);     opacity: 1; }
}
@keyframes brand-half-bottom {
  0%   { transform: translateY(150%); opacity: 0; }
  55%  { transform: translateY(0);    opacity: 1; }
  100% { transform: translateY(0);    opacity: 1; }
}
@keyframes brand-turn {
  0%, 60% { transform: rotate(0deg); }
  100%    { transform: rotate(360deg); }
}
.brand-half-top {
  clip-path: inset(0 0 50% 0);
  animation: brand-half-top 760ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
}
.brand-half-bottom {
  clip-path: inset(50% 0 0 0);
  animation: brand-half-bottom 760ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
}
.brand-turn {
  animation: brand-turn 1.7s cubic-bezier(0.65, 0, 0.35, 1) 700ms infinite;
}
@media (prefers-reduced-motion: reduce) {
  .brand-half-top,
  .brand-half-bottom,
  .brand-turn { animation: none; }
}
`;

export default function BrandLoader() {
  const logo = JENEVIV_LOGO;

  return (
    <div className="grid min-h-screen place-items-center bg-cream">
      <style>{CSS}</style>

      <div className="relative mx-auto h-12 w-12">
        <div className="brand-turn relative h-full w-full">
          <img
            src={logo}
            alt=""
            aria-hidden="true"
            className="brand-half-top absolute inset-0 h-full w-full rounded-[12px] object-cover shadow-[0_8px_20px_-12px_rgba(16,16,16,0.45)]"
          />
          <img
            src={logo}
            alt=""
            aria-hidden="true"
            className="brand-half-bottom absolute inset-0 h-full w-full rounded-[12px] object-cover shadow-[0_8px_20px_-12px_rgba(16,16,16,0.45)]"
          />
        </div>
      </div>
    </div>
  );
}
