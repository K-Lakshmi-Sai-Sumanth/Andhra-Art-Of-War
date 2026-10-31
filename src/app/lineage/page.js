"use client";

import React from "react";
import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import { guruParampara, seniorInstructors, guruVandanamVerse } from "@/data/lineageData";
import { useLanguage } from "@/components/layout/LanguageContext";
import { useSound } from "@/components/layout/SoundContext";
import { Award, Shield, UserCheck, Flame, BookOpen, Quote, Sparkles } from "lucide-react";
import Link from "next/link";

export default function LineagePage() {
  const { isTelugu, t } = useLanguage();
  const { playBell } = useSound();

  return (
    <div className="w-full py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-[#FAF8F5]">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <SectionHeading
          tag={t("lineage.heading.tag", "Authentic Lineage")}
          teluguSubtitle={t("lineage.heading.teluguSubtitle", "గురు శిష్య పరంపర")}
          title={t("lineage.heading.title", "The Masters of Andhra Karrasamu")}
          align="center"
        />
        <p className="text-sm md:text-base text-stone-600 leading-relaxed font-normal">
          {t(
            "lineage.heading.description",
            "A verified unbroken chain of transmission connecting modern practitioners to the grandmasters of 19th and 20th century coastal Andhra."
          )}
        </p>
      </div>

      {/* Traditional Guru Vandanam Chant Box */}
      <div className="mb-20 max-w-4xl mx-auto bg-gradient-to-r from-amber-50/80 via-white to-amber-50/80 border border-amber-300 rounded-3xl p-6 sm:p-10 text-center shadow-lg relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest bg-amber-100 text-amber-900 border border-amber-300 mb-4 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          <span>Guru Vandanam • గురు వందనం</span>
        </div>

        <p className="font-serif text-lg sm:text-xl md:text-2xl font-bold text-stone-900 tracking-wide mb-2 leading-relaxed">
          {guruVandanamVerse.sanskrit}
        </p>
        <p className="text-xs sm:text-sm font-serif italic text-amber-800 font-semibold mb-4">
          {guruVandanamVerse.transliteration}
        </p>
        <p className="text-xs sm:text-sm text-stone-600 max-w-2xl mx-auto leading-relaxed">
          {guruVandanamVerse.meaning}
        </p>

        <button
          onClick={() => playBell(432, 2.5)}
          className="mt-6 px-6 py-2.5 rounded-xl text-xs font-serif font-bold uppercase tracking-wider bg-gradient-to-r from-[#DC2626] to-[#EF4444] hover:opacity-90 text-white transition-all shadow-md shadow-[#DC2626]/20 inline-flex items-center gap-2 border border-amber-400/40"
        >
          <span>Sound Bell of Reverence</span>
        </button>
      </div>

      {/* Guru Parampara Primary Profiles */}
      <section className="space-y-16 mb-24">
        {guruParampara.map((guru, idx) => (
          <div
            key={idx}
            className="bg-white border border-amber-200/80 hover:border-amber-400 rounded-3xl overflow-hidden shadow-md hover:shadow-xl p-6 md:p-10 transition-all text-stone-900"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Portrait */}
              <div className="lg:col-span-4 relative">
                <div className="relative aspect-[3/4] w-full max-w-[320px] mx-auto rounded-2xl overflow-hidden border-2 border-amber-300 shadow-lg">
                  <Image
                    src={guru.image}
                    alt={guru.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 320px"
                    className="object-cover object-top hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
                </div>
              </div>

              {/* Bio & Records */}
              <div className="lg:col-span-8 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-100 pb-3">
                  <div>
                    <span className="text-xs uppercase font-bold tracking-widest text-[#DC2626] block">
                      {guru.generation}
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl font-black text-stone-900">
                      {guru.name}
                    </h3>
                    <p className="text-xs font-serif text-amber-800 font-semibold">{guru.teluguName}</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-900 bg-amber-50 px-3 py-1 rounded-full border border-amber-300">
                    {guru.honorific}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {guru.bio}
                </p>

                {/* Masteries Tags */}
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block mb-2">
                    Key Codified Masteries:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {guru.masteries.map((m, i) => (
                      <span
                        key={i}
                        className="text-xs bg-[#FAF8F5] text-stone-800 px-3 py-1 rounded-lg border border-amber-200 font-medium"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Quote Callout */}
                <div className="p-4 rounded-xl bg-amber-50/70 border-l-4 border-[#DC2626] text-xs sm:text-sm italic font-serif text-stone-800">
                  <Quote className="w-4 h-4 text-amber-700 mb-1 inline mr-1" />
                  "{guru.quote}"
                </div>

                <div className="text-xs text-stone-600 pt-2">
                  <span className="font-bold text-amber-800">Regional Sphere: </span>
                  {guru.region}
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Senior Acharyas & Instructors Grid */}
      <section className="pt-12 border-t border-amber-200 mb-20">
        <SectionHeading
          tag="Living Faculty"
          teluguSubtitle="ప్రధాన శిక్షకులు"
          title="Senior Instructors & Mentors"
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {seniorInstructors.map((inst, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-amber-200/80 hover:border-amber-400 text-left space-y-3 shadow-md hover:shadow-xl transition-all"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#DC2626] to-amber-500 border border-amber-300 flex items-center justify-center shadow-sm">
                <UserCheck className="w-5 h-5 text-white" />
              </div>

              <div>
                <h4 className="font-serif text-lg font-bold text-stone-900">{inst.name}</h4>
                <p className="text-xs font-serif text-amber-800 font-semibold">{inst.telugu}</p>
                <p className="text-xs font-bold text-[#DC2626] mt-0.5">{inst.role}</p>
              </div>

              <div className="pt-2 border-t border-amber-100 text-xs text-stone-600 space-y-1">
                <p>
                  <span className="font-bold text-stone-900">Experience: </span>
                  {inst.experience}
                </p>
                <p>
                  <span className="font-bold text-stone-900">Specialization: </span>
                  {inst.focus}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Discipleship Protocol CTA */}
      <div className="bg-white border border-amber-300 rounded-3xl p-8 sm:p-10 text-center max-w-3xl mx-auto shadow-xl text-stone-900">
        <Shield className="w-10 h-10 text-amber-700 mx-auto mb-3" />
        <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mb-2">
          {t("lineage.cta.title", "Interested in Direct Gurukulam Apprenticeship?")}
        </h3>
        <p className="text-xs sm:text-sm text-stone-600 mb-6 max-w-xl mx-auto leading-relaxed">
          {t(
            "lineage.cta.description",
            "Guru vijay Kumar Kalidasu accepts disciplined students committed to authentic preservation, moral integrity, and rigorous akhada training."
          )}
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-xs font-serif font-bold uppercase tracking-widest bg-gradient-to-r from-[#DC2626] to-[#EF4444] hover:opacity-90 text-white shadow-md shadow-[#DC2626]/20 transition-all border border-amber-400/40"
        >
          <span>{t("lineage.cta.button", "Inquire for Direct Admission")}</span>
        </Link>
      </div>
    </div>
  );
}
