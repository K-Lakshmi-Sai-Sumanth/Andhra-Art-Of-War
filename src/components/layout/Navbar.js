"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Volume2, VolumeX, Globe, Shield, Sparkles } from "lucide-react";
import { useSound } from "./SoundContext";
import { useLanguage } from "./LanguageContext";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { soundEnabled, toggleSound, playBell } = useSound();
  const { language, toggleLanguage, isTelugu, t } = useLanguage();

  const navLinks = [
    { href: "/", label: t("nav.home", "Home") },
    { href: "/heritage", label: t("nav.heritage", "Heritage") },
    { href: "/lineage", label: t("nav.lineage", "Lineage") },
    { href: "/training", label: t("nav.training", "Training") },
    { href: "/gallery", label: t("nav.gallery", "Gallery") },
    { href: "/contact", label: t("nav.contact", "Contact") },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/92 border-b border-amber-200/80 transition-all shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Crest & School Name */}
        <Link
          href="/"
          onClick={() => playBell(720, 0.5)}
          className="flex items-center gap-3.5 group text-left"
        >
          {/* Traditional Gurukulam Crest Emblem in Vermilion & Gold */}
          <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-[#DC2626] via-amber-500 to-[#B45309] p-[2px] shadow-md shadow-[#DC2626]/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center border border-amber-300">
              <svg viewBox="0 0 32 32" className="w-6 h-6 text-amber-700" fill="currentColor">
                <line x1="6" y1="26" x2="26" y2="6" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="6" y1="6" x2="26" y2="26" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="16" cy="16" r="3.5" fill="#DC2626" stroke="#D97706" strokeWidth="1.5" />
              </svg>
            </div>
          </div>

          <div>
            <span className="font-serif font-black tracking-widest text-stone-900 text-sm sm:text-base uppercase group-hover:text-amber-800 transition-colors block">
              {t("common.gurukulamName", "Andhra Art Of War")}
            </span>
            <p className="text-[10px] sm:text-xs font-serif text-amber-800 font-semibold tracking-wider uppercase">
              {isTelugu ? "గురుకులం • గురు విజయ కుమార్ కాళిదాసు" : "Gurukulam • Guru vijay Kumar Kalidasu"}
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1.5">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3.5 py-2 rounded-xl text-xs tracking-wider uppercase font-bold transition-all ${isActive
                  ? "text-[#DC2626] bg-amber-50/90 border border-amber-300/80 shadow-sm"
                  : "text-stone-700 hover:text-stone-900 hover:bg-stone-100/70"
                  }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#DC2626] rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls & CTA */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Sound FX Toggle */}
          <button
            onClick={toggleSound}
            title={soundEnabled ? "Martial Sound Enabled" : "Enable Martial Sound FX"}
            className={`p-2.5 rounded-xl border transition-all ${soundEnabled
              ? "bg-amber-100/90 border-amber-400 text-amber-800 shadow-sm"
              : "bg-stone-100 border-stone-200 text-stone-500 hover:text-stone-800"
              }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-700" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Telugu / English Toggle */}
          <button
            onClick={toggleLanguage}
            title="Toggle Telugu / English"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-amber-300 bg-amber-50/70 text-xs font-bold text-stone-800 hover:border-amber-500 transition-all shadow-sm"
          >
            <Globe className="w-3.5 h-3.5 text-amber-700" />
            <span>{isTelugu ? "EN" : "తెలుగు"}</span>
          </button>

          {/* Enroll CTA */}
          <Link
            href="/contact"
            onClick={() => playBell(600, 0.6)}
            className="px-5 py-2.5 rounded-xl text-xs font-serif font-black tracking-widest uppercase bg-gradient-to-r from-[#DC2626] via-[#E11D48] to-[#DC2626] hover:opacity-90 text-white shadow-md shadow-[#DC2626]/25 hover:scale-105 transition-all border border-amber-400/40"
          >
            {t("nav.enroll", "Enroll Now")}
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={toggleLanguage}
            className="px-2.5 py-1.5 rounded-lg border border-amber-300 text-xs text-amber-800 font-bold bg-amber-50"
          >
            {isTelugu ? "EN" : "తె"}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-stone-100 border border-stone-200 text-stone-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF8F5] border-b border-amber-200 px-4 pt-3 pb-6 space-y-2 shadow-lg">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-sm font-bold tracking-wider uppercase ${isActive
                  ? "bg-[#DC2626] text-white font-black"
                  : "text-stone-700 hover:bg-stone-100 hover:text-stone-900"
                  }`}
              >
                {link.label}
              </Link>
            );
          })}

          <div className="pt-4 border-t border-stone-200 flex items-center justify-between gap-3">
            <button
              onClick={toggleSound}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs text-stone-700"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-700" /> : <VolumeX className="w-4 h-4" />}
              <span>{soundEnabled ? t("nav.soundOn", "Sound ON") : t("nav.soundOff", "Sound OFF")}</span>
            </button>

            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 text-center py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#DC2626] to-[#EF4444] text-white"
            >
              {t("nav.enroll", "Enroll Now")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
