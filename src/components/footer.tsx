import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-warm-950 text-warm-50 mt-12">
      <div className="h-0.5 bg-crimson-500" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <Image
            src="/alabamy-icon.png"
            alt="Alabamy"
            width={60}
            height={40}
            className="h-10 w-auto"
          />
          <div className="text-sm text-warm-500">
            <p>mike@alabamy.com | 205-687-TALK</p>
            <p>&copy; 2026 Alabamy. Boundless.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
