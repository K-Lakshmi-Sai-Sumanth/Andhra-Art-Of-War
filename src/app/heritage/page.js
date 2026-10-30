"use client";

import React, { useState } from "react";
import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import { heritageTimeline, weaponsList, martialPhilosophy } from "@/data/heritageData";
import { useLanguage } from "@/components/layout/LanguageContext";
import { useSound } from "@/components/layout/SoundContext";
import {
  Calendar,
  ShieldCheck,
  BookOpen,
  Sword,
  Info,
  CheckCircle2,
  ArrowRight,
  Sparkles
} from "lucide-react";
import Link from "next/link";

export default function HeritagePage() {
  const { isTelugu } = useLanguage();
  const { playWoodClick } = useSound();
  const [selectedWeapon, setSelectedWeapon] = useState(weaponsList[0]);

  return (
    <div className="w-full py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-[#FAF8F5]">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <SectionHeading
          tag="Living Tradition & Chronicles"
          teluguSubtitle="ఆంధ్ర యుద్ధ కళా ప్రాశస్త్యం"
          title="The Heritage of Karrasamu"
          align="center"
        />
        <p className="text-sm md:text-base text-stone-600 leading-relaxed font-normal">
          {isTelugu
            ? "శతాబ్దాల కాలంగా దక్షిణ భారతదేశంలోని రక్షణ దళాలకు వెన్నుదన్నుగా నిలిచిన కర్రసాము విద్యను, దాని అసలైన శాస్త్రీయ రూపంలో భద్రపరచడమే మా ధ్యేయం."
            : "Tracing the martial lineage of Andhra Pradesh from the fortress garrisons of the Kakatiya and Vijayanagara dynasties to clandestine colonial survival and modern Gurukulam revitalization."}
        </p>
      </div>

      {/* Historical Chronology Timeline */}
      <section className="mb-24">
        <div className="text-center mb-10">
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
            Historical Chronology & Oral Traditions
          </h3>
          <p className="text-xs text-amber-800 tracking-wider uppercase mt-1 font-semibold">
            Chronological records verified against regional inscriptions and living memory
          </p>
        </div>

        <div className="relative border-l-2 border-amber-300 ml-4 md:ml-32 space-y-12">
          {heritageTimeline.map((item, idx) => (
            <div key={idx} className="relative pl-6 md:pl-10 group">
              {/* Timeline Node Point */}
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-amber-600 group-hover:scale-125 group-hover:bg-[#DC2626] transition-all" />

              {/* Date / Period Badge */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="font-serif text-xs font-bold text-amber-900 tracking-wider bg-amber-50 px-3 py-1 rounded-full border border-amber-300">
                  {item.period}
                </span>
                <span className="text-[10px] uppercase font-bold text-[#DC2626] bg-[#DC2626]/10 px-2 py-0.5 rounded border border-[#DC2626]/20">
                  {item.tag}
                </span>
              </div>

              {/* Card Container */}
              <div className="bg-white border border-amber-200/80 hover:border-amber-400 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all">
                <h4 className="font-serif text-lg md:text-xl font-bold text-stone-900">
                  {item.title}
                </h4>
                <p className="text-xs font-semibold text-amber-800 font-serif mb-3">
                  {item.teluguTitle}
                </p>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Traditional Weapons of the Gurukulam */}
      <section className="mb-24 pt-12 border-t border-amber-200">
        <SectionHeading
          tag="Armory Taxonomy"
          teluguSubtitle="సాంప్రదాయ ఆయుధ విభాగాలు"
          title="Weapons of the Andhra Gurukulam"
          align="center"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Weapon Selector List */}
          <div className="lg:col-span-5 space-y-3">
            {weaponsList.map((w) => {
              const isSelected = selectedWeapon.id === w.id;
              return (
                <button
                  key={w.id}
                  onClick={() => {
                    setSelectedWeapon(w);
                    playWoodClick();
                  }}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    isSelected
                      ? "border-amber-400 bg-amber-50 text-stone-900 shadow-md font-bold"
                      : "border-amber-200/80 bg-white text-stone-700 hover:border-amber-400 shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-sm text-stone-900">
                      {w.name}
                    </span>
                    <span className="text-xs text-amber-800 font-serif font-semibold">{w.telugu}</span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1 line-clamp-1">{w.purpose}</p>
                </button>
              );
            })}
          </div>

          {/* Detailed Weapon Specification Card */}
          <div className="lg:col-span-7 bg-white border border-amber-300/80 rounded-2xl p-6 sm:p-8 shadow-xl relative text-stone-900">
            <div className="flex items-center justify-between pb-4 border-b border-amber-100 mb-6">
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                  {selectedWeapon.name}
                </h3>
                <span className="text-xs font-serif text-amber-800 font-semibold">{selectedWeapon.telugu}</span>
              </div>
              <span className="text-xs uppercase font-bold text-[#DC2626] bg-[#DC2626]/10 border border-[#DC2626]/20 px-3 py-1 rounded-full">
                Gurukulam Standard
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-amber-200 text-xs">
                <span className="text-amber-800 uppercase font-bold tracking-wider block mb-1">
                  Specification Length:
                </span>
                <span className="text-stone-900 font-mono text-sm font-bold">{selectedWeapon.length}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-amber-200 text-xs">
                <span className="text-amber-800 uppercase font-bold tracking-wider block mb-1">
                  Traditional Material:
                </span>
                <span className="text-stone-900 font-medium">{selectedWeapon.material}</span>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-stone-700">
              <div>
                <h4 className="font-bold text-stone-900 uppercase tracking-wider text-xs mb-1">
                  Combat Objective & Mechanics
                </h4>
                <p className="leading-relaxed text-stone-600">{selectedWeapon.purpose}</p>
              </div>

              <div>
                <h4 className="font-bold text-stone-900 uppercase tracking-wider text-xs mb-1">
                  Construction & Seasoning
                </h4>
                <p className="leading-relaxed text-stone-600">{selectedWeapon.details}</p>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-amber-100 flex items-center justify-between">
              <span className="text-xs text-stone-500">Want to inspect this in 3D?</span>
              <Link
                href="/training"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-[#DC2626] uppercase tracking-wider"
              >
                <span>Open 3D Armory Viewer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* The Warrior Code & Ethical Philosophy */}
      <section className="pt-12 border-t border-amber-200">
        <SectionHeading
          tag="Ethical Doctrine"
          teluguSubtitle="యుద్ధ నీతి & ధర్మం"
          title="The Karrasamu Warrior Code"
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {martialPhilosophy.map((p, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-amber-200/80 hover:border-amber-400 relative overflow-hidden shadow-md hover:shadow-xl transition-all"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-[#DC2626] mb-3" />
              <h4 className="font-serif text-base sm:text-lg font-bold text-stone-900 mb-1">
                {p.title}
              </h4>
              <p className="text-xs font-serif text-amber-800 font-semibold mb-3">{p.telugu}</p>
              <p className="text-xs text-stone-600 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
