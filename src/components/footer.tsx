import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-porch-dark text-porch-cream">
      <div className="h-0.5 bg-crimson-500" />
      <div className="max-w-[960px] mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <Image
            src="/alabamy-icon.png"
            alt="Alabamy"
            width={60}
            height={40}
            className="h-10 w-auto"
          />
          <div>
            <p className="font-serif italic text-white/70 text-sm">
              Boundless.
            </p>
            <p className="text-sm text-white/60 mt-1">
              hello@alabamy.com &middot; 205-687-TALK
            </p>
            <p className="text-xs text-white/40 mt-1">
              &copy; 2026 Alabamy. All rights reserved. &middot;{" "}
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
