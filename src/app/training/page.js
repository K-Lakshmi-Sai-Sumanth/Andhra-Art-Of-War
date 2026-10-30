"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import SectionHeading from "@/components/ui/SectionHeading";

const WarriorHero3D = dynamic(() => import("@/components/three/WarriorHero3D"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[580px] lg:h-[680px] bg-[#FAF8F5] flex flex-col items-center justify-center gap-3">
      <div className="w-10 h-10 border-2 border-amber-600 border-t-[#DC2626] rounded-full animate-spin" />
      <span className="text-xs font-serif text-amber-800 uppercase tracking-widest font-bold">
        Loading 3D Dojo...
      </span>
    </div>
  ),
});

const WeaponViewer3D = dynamic(() => import("@/components/three/WeaponViewer3D"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[450px] bg-[#FAF8F5] flex flex-col items-center justify-center gap-3">
      <div className="w-10 h-10 border-2 border-amber-600 border-t-[#DC2626] rounded-full animate-spin" />
      <span className="text-xs font-serif text-amber-800 uppercase tracking-widest font-bold">
        Loading 3D Armory...
      </span>
    </div>
  ),
});

import { curriculumLevels, weeklySchedule, faqsList } from "@/data/trainingData";
import { useLanguage } from "@/components/layout/LanguageContext";
import { useSound } from "@/components/layout/SoundContext";
import {
  ShieldAlert,
  Clock,
  Calendar,
  CheckCircle,
  HelpCircle,
  ChevronDown,
  Sparkles,
  ArrowRight,
  Flame,
  Award
} from "lucide-react";
import Link from "next/link";

export default function TrainingPage() {
  const { isTelugu } = useLanguage();
  const { playWoodClick } = useSound();
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="w-full py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-[#FAF8F5]">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <SectionHeading
          tag="Curriculum & 3D Visualizer"
          teluguSubtitle="శాస్త్రీయ శిక్షణా విధానం"
          title="Training Pathways & 3D Interactive Dojo"
          align="center"
        />
        <p className="text-sm md:text-base text-stone-600 leading-relaxed font-normal">
          {isTelugu
            ? "శాస్త్రీయంగా రూపొందించబడిన 4 దశల శిక్షణ. ప్రాథమిక అడుగుల నుండి ద్వంద్వ యుద్ధం (పోరు) వరకు ప్రతి అడుగు నిపుణులైన ఆచార్యుల పర్యవేక్షణలో నేర్పించబడుతుంది."
            : "A structured 4-tier pedagogical syllabus bridging classical warrior conditioning with modern biomechanics and real-time 3D technique visualization."}
        </p>
      </div>

      {/* 1. ARTICULATED WARRIOR 3D DOJO SIMULATOR */}
      <section className="mb-24">
        <div className="text-center mb-6">
          <span className="text-xs font-serif font-bold text-amber-800 uppercase tracking-widest">
            Module 1: Real-Time Centrifugal Biomechanics
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-black text-stone-900 mt-1">
            Interactive Human Warrior Kata Simulator
          </h2>
          <p className="text-xs text-stone-600 max-w-xl mx-auto mt-2">
            Switch between Karrasamu Staff, Royal Talwar with Dhal Shield, and Twin Sticks in the ancient temple courtyard. Adjust speed to examine wrist torque, foot grounding, and blade trajectories.
          </p>
        </div>

        <div className="w-full h-[580px] lg:h-[680px] rounded-2xl overflow-hidden border border-amber-200 shadow-xl">
          <WarriorHero3D />
        </div>
      </section>

      {/* 2. FOUR-LEVEL CURRICULUM SYLLABUS */}
      <section className="mb-24">
        <SectionHeading
          tag="Graded Advancement"
          teluguSubtitle="శిక్షణా స్థాయిలు"
          title="The 4-Stage Gurukulam Syllabus"
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {curriculumLevels.map((lvl, idx) => (
            <div
              key={idx}
              className="bg-white border border-amber-200/80 hover:border-amber-400 rounded-3xl p-6 sm:p-8 shadow-md hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between border-b border-amber-100 pb-4 mb-4">
                  <div>
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900">
                      {lvl.level}
                    </h3>
                    <span className="text-xs text-amber-800 font-semibold">{lvl.duration} Immersion</span>
                  </div>
                  <span className="text-xs uppercase font-bold text-[#DC2626] bg-[#DC2626]/10 px-3 py-1 rounded-full border border-[#DC2626]/25">
                    {lvl.belt}
                  </span>
                </div>

                <p className="text-xs text-stone-600 mb-4">
                  <span className="font-bold text-stone-900">Target Students: </span>
                  {lvl.target}
                </p>

                <div className="space-y-2 mb-6">
                  <span className="text-[11px] uppercase font-bold tracking-wider text-amber-800 block">
                    Core Technical Competencies:
                  </span>
                  {lvl.skills.map((skill, sIdx) => (
                    <div key={sIdx} className="flex items-start gap-2 text-xs text-stone-700">
                      <CheckCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-amber-100 bg-[#FAF8F5] -mx-6 -mb-6 sm:-mx-8 sm:-mb-8 p-4 rounded-b-3xl">
                <p className="text-xs text-amber-900 font-serif">
                  <span className="font-bold text-stone-900">Mastery Benchmark: </span>
                  {lvl.outcome}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. 3D WEAPON ARMORY & MATERIAL LAB */}
      <section className="mb-24 pt-12 border-t border-amber-200">
        <div className="text-center mb-10">
          <SectionHeading
            tag="Weaponry & Metallurgy"
            teluguSubtitle="ఆయుధ పరీక్ష"
            title="Interactive 3D Armory Inspection"
            align="center"
          />
          <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto -mt-6">
            Rotate and inspect the traditional oiled bamboo staff (Karra) and royal steel Talwar with brass shield.
          </p>
        </div>

        <WeaponViewer3D compact={false} />
      </section>

      {/* 4. AKHADA TIMINGS & BATCH SCHEDULE */}
      <section className="mb-24 pt-12 border-t border-amber-200">
        <SectionHeading
          tag="Weekly Schedule"
          teluguSubtitle="తరగతుల సమయ పట్టిక"
          title="Gurukulam Class Timetable"
          align="center"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {weeklySchedule.map((batch, idx) => (
            <div
              key={idx}
              className="bg-white border border-amber-200/80 rounded-2xl p-6 text-left space-y-4 shadow-md hover:shadow-xl transition-all"
            >
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#DC2626] block">
                  Batch {idx + 1}
                </span>
                <h4 className="font-serif text-base sm:text-lg font-bold text-stone-900">
                  {batch.batch}
                </h4>
                <p className="text-xs font-serif text-amber-800 font-semibold">{batch.telugu}</p>
              </div>

              <div className="space-y-1 text-xs text-stone-700">
                <p className="flex items-center gap-1.5 font-bold text-stone-900">
                  <Calendar className="w-3.5 h-3.5 text-amber-700" />
                  <span>{batch.days}</span>
                </p>
                <p className="flex items-center gap-1.5 text-amber-800 font-medium">
                  <Clock className="w-3.5 h-3.5 text-amber-700" />
                  <span>{batch.time}</span>
                </p>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed pt-2 border-t border-amber-100">
                {batch.focus}
              </p>

              <div className="text-[11px] text-amber-800 font-mono font-bold">
                {batch.capacity}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. SAFETY CODE & FAQ ACCORDION */}
      <section className="pt-12 border-t border-amber-200 max-w-4xl mx-auto">
        <div className="p-6 rounded-2xl bg-amber-50 border border-amber-300 mb-12 flex items-start gap-4 shadow-sm">
          <ShieldAlert className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-stone-700 space-y-1">
            <h4 className="font-serif font-bold text-stone-900 text-sm uppercase">
              Akhada Safety & Respect Protocol
            </h4>
            <p className="leading-relaxed">
              All training starts only after barefoot salutations to the lineage masters (*Guru Vandanam*). Padded practice poles and head protection are mandatory during sparring drills. Reckless behavior or unauthorized weapon wielding outside the arena is strictly forbidden.
            </p>
          </div>
        </div>

        <SectionHeading
          tag="Common Inquiries"
          teluguSubtitle="సాధారణ ప్రశ్నలు"
          title="Frequently Asked Questions"
          align="center"
        />

        <div className="space-y-4">
          {faqsList.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-amber-200/80 rounded-2xl overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => {
                    setOpenFaq(isOpen ? -1 : idx);
                    playWoodClick();
                  }}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 font-serif font-bold text-sm sm:text-base text-stone-900 hover:text-[#DC2626]"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-amber-700 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="p-5 pt-0 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-amber-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Enrollment Bottom Button */}
        <div className="text-center mt-12">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-serif text-xs sm:text-sm font-bold uppercase tracking-widest bg-gradient-to-r from-[#DC2626] to-[#EF4444] hover:opacity-90 text-white shadow-md shadow-[#DC2626]/30 transition-all border border-amber-400/40 hover:scale-105"
          >
            <span>Proceed to Class Enrollment</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
