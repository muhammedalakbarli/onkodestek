"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";

interface NavUser {
  name?: string | null;
  image?: string | null;
}

const NAV_LINKS = [
  { href: "/patients",     label: "Xəstələr" },
  { href: "/transparency", label: "Şəffaflıq" },
  { href: "/donate",       label: "İanə et" },
  { href: "/about",        label: "Haqqımızda" },
  { href: "/volunteer",    label: "Könüllü ol" },
  { href: "/contact",      label: "Əlaqə" },
];

export default function MobileMenu({ user }: { user?: NavUser }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Menyu"
        className="sm:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
      >
        {open ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="sm:hidden absolute top-16 left-0 right-0 border-t border-slate-100 bg-white px-4 py-3 space-y-1 shadow-lg z-40">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block px-3 py-2.5 text-sm font-medium text-slate-700 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all"
            >
              {item.label}
            </Link>
          ))}
          <div className="border-t border-slate-100 pt-2 mt-2">
            {user ? (
              <>
                <Link
                  href="/me"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-all"
                >
                  {user.image ? (
                    <Image src={user.image} alt="" width={20} height={20} className="rounded-full" />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 text-[10px] font-bold">
                      {user.name?.[0] ?? "U"}
                    </div>
                  )}
                  {user.name}
                </Link>
                <button
                  type="button"
                  onClick={() => { setOpen(false); signOut({ callbackUrl: "/" }); }}
                  className="block w-full text-left px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
                  Çıxış
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="block px-3 py-2.5 text-sm font-medium text-slate-700 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all"
              >
                Daxil ol
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
