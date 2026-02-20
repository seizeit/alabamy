import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#111111] text-cream py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-6">
        <Image
          src="/alabamy-icon.png"
          alt="Alabamy"
          width={40}
          height={40}
          className="w-10 h-10"
        />
        <div className="text-sm text-ink-muted">
          <p>mike@alabamy.com | 205-687-TALK</p>
          <p>&copy; 2026 Alabamy. Boundless.</p>
        </div>
      </div>
    </footer>
  );
}
