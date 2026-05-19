export default function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Shoply logo">
      <rect width="40" height="40" rx="10" fill="currentColor" />
      <path
        d="M27 14H17.5C15.567 14 14 15.567 14 17.5C14 19.433 15.567 21 17.5 21H22.5C24.433 21 26 22.567 26 24.5C26 26.433 24.433 28 22.5 28H13"
        stroke="#bef264"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="29" cy="14" r="2" fill="#bef264" />
    </svg>
  );
}

export function LogoMark({ className = "w-7 h-7" }: { className?: string }) {
  return <Logo className={className} />;
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2 font-extrabold text-xl tracking-tight ${className}`}>
      <Logo className="w-8 h-8 text-black" />
      <span>
        Shop<span className="text-lime-500">.</span>ly
      </span>
    </span>
  );
}
