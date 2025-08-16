"use client";

import * as React from "react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

type Props = {
  name: string;
  email: string;
  image?: string;
};

export default function UserMenu({ name, email, image }: Props) {
  const [open, setOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  // Close on click outside
  React.useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // Basic keyboard handling
  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") setOpen(false);
  }

  return (
    <div className="relative" ref={menuRef} onKeyDown={onKeyDown}>
      <button
        type="button"
        className="flex items-center gap-2 rounded-md border px-2 py-1.5 text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt=""
            className="h-6 w-6 rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="h-6 w-6 rounded-full bg-gray-200" />
        )}
        <span className="hidden sm:inline-block max-w-[12ch] truncate">{name || email}</span>
      </button>

      {open && (
        <div
          role="menu"
          aria-label="User menu"
          className="absolute right-0 mt-2 w-56 overflow-hidden rounded-md border bg-white shadow-lg"
        >
          <div className="px-3 py-2 text-sm">
            <div className="font-medium truncate">{name || "Signed in"}</div>
            <div className="text-gray-500 truncate">{email}</div>
          </div>
          <div className="h-px bg-gray-100" />
          <div className="flex flex-col p-1 text-sm">
            <Link role="menuitem" className="rounded px-2 py-1.5 hover:bg-gray-50" href="/profile">
              Profile
            </Link>
            <Link role="menuitem" className="rounded px-2 py-1.5 hover:bg-gray-50" href="/subscriptions">
              Subscriptions
            </Link>
            <button
              role="menuitem"
              className="rounded px-2 py-1.5 text-left hover:bg-gray-50"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}