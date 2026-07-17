import Link from "next/link";

export function Footer() {
  const links = [
    { label: "Docs", href: "#" },
    { label: "GitHub", href: "#" },
    { label: "Twitter", href: "#" },
    { label: "Privacy", href: "#" },
    { label: "Contact", href: "#" },
  ];

  return (
    <footer className="bg-gray-950 px-6 py-12 border-t border-gray-900">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 md:flex-row md:items-end">
        
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <span className="font-serif text-2xl font-medium text-white mb-2">Pendon</span>
          <p className="text-gray-500 text-sm">Where ideas become intelligence.</p>
        </div>
        
        <div className="flex flex-col items-center gap-6 md:items-end">
          <nav className="flex flex-wrap justify-center gap-6">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-gray-400 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} Pendon. All rights reserved.
          </p>
        </div>
        
      </div>
    </footer>
  );
}
