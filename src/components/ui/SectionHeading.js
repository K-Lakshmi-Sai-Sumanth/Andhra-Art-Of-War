import React from "react";

export default function SectionHeading({
  title,
  teluguSubtitle,
  tag,
  align = "center",
  light = true,
}) {
  const isCenter = align === "center";

  return (
    <div className={`mb-10 ${isCenter ? "text-center" : "text-left"}`}>
      {tag && (
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-widest border border-amber-300 bg-amber-50 text-amber-900 mb-3 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] animate-ping" />
          {tag}
        </div>
      )}

      {teluguSubtitle && (
        <p className="font-serif text-amber-800 text-sm md:text-base font-bold tracking-wide mb-1">
          {teluguSubtitle}
        </p>
      )}

      <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-stone-900">
        {title}
      </h2>

      {/* Decorative Modern Warrior Divider */}
      <div className={`flex items-center gap-3 mt-4 ${isCenter ? "justify-center" : "justify-start"}`}>
        <div className="h-[2px] w-14 bg-gradient-to-r from-transparent via-amber-500 to-[#DC2626]" />
        <div className="w-2.5 h-2.5 rotate-45 border border-amber-400 bg-[#DC2626] shadow-sm shadow-[#DC2626]/40" />
        <div className="h-[2px] w-14 bg-gradient-to-r from-[#DC2626] via-amber-500 to-transparent" />
      </div>
    </div>
  );
}
