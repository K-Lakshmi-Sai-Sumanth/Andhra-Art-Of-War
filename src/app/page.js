"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import SectionHeading from "@/components/ui/SectionHeading";
import { useLanguage } from "@/components/layout/LanguageContext";
import { useSound } from "@/components/layout/SoundContext";

const WarriorHero3D = dynamic(() => import("@/components/three/WarriorHero3D"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[640px] sm:h-[720px] lg:h-[820px] bg-[#FAF8F5] flex flex-col items-center justify-center gap-3">
      <div className="w-10 h-10 border-2 border-amber-600 border-t-[#DC2626] rounded-full animate-spin" />
      <span className="text-xs font-serif text-amber-800 uppercase tracking-widest font-bold">
        Initializing 3D Temple Courtyard Dojo...
      </span>
    </div>
  ),
});

import {
  Shield,
  Zap,
  Flame,
  ArrowRight,
  Play,
  Award,
  Users,
  Compass,
  CheckCircle,
  ExternalLink,
  X,
  Sword,
  Sparkles,
  Layers
} from "lucide-react";
import { youtubeVideos } from "@/data/galleryData";

export default function HomePage() {
  const { isTelugu, t } = useLanguage();
  const { playBell, playWhoosh } = useSound();
  const [selectedVideo, setSelectedVideo] = useState(null);

  const pillars = [
    {
      title: isTelugu ? "అడుగులు (Adugulu)" : "Adugulu (అడుగులు)",
      subtitle: isTelugu ? "త్రిభుజాకార పోరాట అడుగులు" : "Triangular Combat Footwork",
      desc: isTelugu
        ? "భూమిపై దృఢమైన నిలకడ. పులి మరియు గరుడ ముద్రలతో కూడిన మెరుపు వేగపు కదలికలు మరియు దిశ మార్పిడులు."
        : "The sacred geometry of grounding. Rapid weight shifts, directional pivots, and evasive stepping inspired by tiger and eagle stances.",
      icon: Compass,
    },
    {
      title: isTelugu ? "కర్ర (Karra)" : "Karra (కర్ర)",
      subtitle: isTelugu ? "వేగవంతమైన కర్ర భ్రమణం" : "Centrifugal Staff Velocity",
      desc: isTelugu
        ? "ఆరడుగుల దృఢమైన వెదురు కర్రపై సంపూర్ణ పట్టు. నిరంతర వృత్తాకార వేగంతో యోధుని చుట్టూ 360 డిగ్రీల రక్షణ వలయం సృష్టిస్తుంది."
        : "Mastery of the 6-foot bamboo staff. Generating continuous circular momentum to form a 360-degree kinetic forcefield around the warrior.",
      icon: Zap,
    },
    {
      title: isTelugu ? "కత్తి & డాలు (Talwar & Dhal)" : "Talwar & Dhal (కత్తి & డాలు)",
      subtitle: isTelugu ? "రాజపుత్ర ఖడ్గం & ఇత్తడి డాలు" : "Royal Sword & Brass Shield",
      desc: isTelugu
        ? "చారిత్రక యుద్ధభూమి ఖడ్గ విన్యాసాలు, కోత కోతలు, సూటి దాడులు మరియు రాజ గారడీలలో భద్రపరచబడిన డాలు రక్షణ."
        : "Historical battlefield blade forms, cutting arcs, thrusting lines, and solid brass shield deflections codified in royal garadis.",
      icon: Sword,
    },
    {
      title: isTelugu ? "వీర పోరు (Veera Poru)" : "Veera Poru (వీర పోరు)",
      subtitle: isTelugu ? "అసలైన ద్వంద్వ సమరం" : "Authentic Warrior Sparring",
      desc: isTelugu
        ? "అఖాడా ప్రాంగణంలో నిజ-సమయ పోరాట ప్రతిస్పందన. దూరం అంచనా వేయడం, లయబద్ధమైన ఎదురుదాడులు మరియు ఆయుధాన్ని చేజిక్కించుకోవడం."
        : "Real-time combat reaction inside the training arena. Pressure testing rhythm, distance judgment, and weapon disarming with zero malice.",
      icon: Shield,
    },
  ];

  const stats = [
    { value: "70+", label: isTelugu ? "సంవత్సరాల పరంపర" : "Years Living Lineage", sub: isTelugu ? "స్థాపన 1952" : "Est. 1952" },
    { value: "36", label: isTelugu ? "సాంప్రదాయ వరుసలు" : "Codified Katas", sub: isTelugu ? "ప్రాచీన వరసలు" : "Ancient Varasulu" },
    { value: "1,200+", label: isTelugu ? "శిక్షణ పొందిన శిష్యులు" : "Disciples Trained", sub: isTelugu ? "యువత నుండి నిపుణులు" : "Youth to Masters" },
    { value: "100%", label: isTelugu ? "సాంప్రదాయ గురుకులం" : "Authentic Heritage", sub: isTelugu ? "నిఖార్సైన వారసత్వం" : "Non-commercial" },
  ];

  return (
    <div className="w-full bg-[#FAF8F5]">
      {/* 1. HERO HEADER BANNER (Directly After Navbar, Full Width, Clean Typography) */}
      <section className="w-full pt-10 pb-8 px-4 sm:px-6 lg:px-8 border-b border-amber-200/80 bg-gradient-to-b from-[#FAF8F5] via-[#F4EFE6] to-[#FAF8F5]">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          {/* Martial Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-300 bg-amber-50 text-amber-900 text-xs font-bold tracking-widest uppercase shadow-sm">
            {/* <span className="w-2 h-2 rounded-full bg-[#DC2626] animate-ping" /> */}
            {/* <span>{t("common.gurukulamName", "Andhra Art Of War")}</span>
            <span className="text-stone-300">•</span> */}
            <span>{t("common.guruName", "Vijay Kumar Kalidasu")}</span>
          </div>

          {/* Title Subtitle */}
          <p className="font-serif text-amber-800 text-sm sm:text-base md:text-lg font-bold tracking-widest uppercase">
            {t("home.subheadingBadge", "Andhra Art Of War Gurukulam • Living Martial Lineage")}
          </p>

          {/* Master Heading */}
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-stone-900 uppercase leading-[1.1]">
            {t("home.headlineMain", "Andhra Praacheena Yudha Kalalu")} <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B45309] via-amber-600 to-[#DC2626]">
              {/* {t("home.headlineMain", "Andhra Praacheena Yudha Kalalu")} */}
            </span>
          </h1>

          {/* <p className="text-sm sm:text-base text-stone-600 font-normal max-w-3xl mx-auto leading-relaxed">
            {t(
              "home.heroDescription",
              "Command an articulated warrior executing traditional Karrasamu staff whirlwinds, curved Talwar sword combat, and authentic brass Dhal shield bashes in real-time 3D."
            )}
          </p> */}

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-3">
            <Link
              href="/contact"
              onClick={() => playBell(528, 0.7)}
              className="px-6 py-3.5 rounded-xl font-serif text-xs sm:text-sm font-bold uppercase tracking-widest bg-gradient-to-r from-[#DC2626] via-[#E11D48] to-[#DC2626] hover:opacity-90 text-white shadow-md shadow-[#DC2626]/30 border border-amber-400/40 hover:scale-105 transition-all flex items-center gap-2 group"
            >
              <span>{t("home.heroCtaEnroll", "Enroll for Classes")}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <button
              onClick={() => {
                setSelectedVideo(youtubeVideos[0]);
                playWhoosh(1.2);
              }}
              className="px-5 py-3.5 rounded-xl font-serif text-xs sm:text-sm font-bold uppercase tracking-widest bg-white hover:bg-stone-50 text-stone-800 border border-stone-200 shadow-sm transition-all flex items-center gap-2 group"
            >
              <div className="w-5 h-5 rounded-full bg-[#DC2626] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-2.5 h-2.5 text-white fill-white ml-0.5" />
              </div>
              <span>{t("home.heroCtaWatch", "Watch Katas")}</span>
            </button>

            <Link
              href="/training"
              className="px-5 py-3.5 rounded-xl font-serif text-xs sm:text-sm font-bold uppercase tracking-widest text-amber-800 hover:text-stone-900 border border-amber-300 bg-amber-50/60 hover:bg-amber-100 transition-all shadow-sm"
            >
              {t("home.heroCtaSyllabus", "Syllabus Details")}
            </Link>
          </div>
        </div>
      </section>

      {/* 2. FULL-WIDTH 3D INTERACTIVE MARTIAL ARENA (Next, Unobstructed, Clear View) */}
      <section className="relative w-full h-[640px] sm:h-[720px] lg:h-[820px] overflow-hidden bg-[#F6F2EB] border-b border-amber-200">
        <WarriorHero3D />
      </section>

      {/* 3. STATS & HALLMARKS BANNER */}
      <section className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 my-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white/95 border border-amber-200/90 rounded-2xl p-6 shadow-xl backdrop-blur-xl">
          {stats.map((s, idx) => (
            <div key={idx} className="text-center p-3 border-r last:border-r-0 border-amber-100">
              <span className="font-serif text-3xl sm:text-4xl font-extrabold text-[#B45309] block">
                {s.value}
              </span>
              <span className="text-xs sm:text-sm font-bold text-stone-900 block mt-1">
                {s.label}
              </span>
              <span className="text-[11px] text-stone-500 uppercase tracking-wider block mt-0.5 font-medium">
                {s.sub}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. THE FOUR PILLARS OF KARRASAMU */}
      <section className="py-20 bg-[#F4EFE6] border-y border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            tag="Martial Disciplines"
            teluguSubtitle="సాధనా విభాగాలు"
            title="The Four Core Pillars of Combat"
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-white border border-amber-200/80 hover:border-amber-400 hover:shadow-xl transition-all group relative overflow-hidden shadow-md"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#DC2626]/10 to-amber-500/20 border border-amber-300 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-amber-700" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-stone-900 group-hover:text-[#DC2626] transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-xs font-semibold text-amber-800 mt-0.5 mb-2">
                    {p.subtitle}
                  </p>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {p.desc}
                  </p>
                  <div className="mt-4 pt-3 border-t border-amber-100 flex items-center gap-1.5 text-xs text-[#DC2626] font-bold group-hover:text-amber-800">
                    <span>Learn syllabus</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. GURU & LINEAGE FEATURE SPOTLIGHT */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-white via-[#FCFBF8] to-[#F5EFE6] rounded-3xl border border-amber-200 p-8 md:p-12 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Trainer Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative w-full h-[400px] sm:h-[460px] rounded-2xl overflow-hidden border-2 border-amber-300 shadow-xl">
                <Image
                  src="/images/trainer.jpg"
                  alt="Chief Acharya Sri Ramana Murthy holding bamboo staff"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-top hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 border border-amber-200 backdrop-blur-md p-3.5 rounded-xl shadow-md">
                  <p className="font-serif font-bold text-sm text-stone-900">Acharya Sri V. Ramana Murthy</p>
                  <p className="text-xs text-amber-800 font-semibold">Chief Master & 38-Year Discipleship Bearer</p>
                </div>
              </div>
            </div>

            {/* Content & Quote */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-widest border border-amber-300 bg-amber-50 text-amber-900 shadow-sm">
                <Award className="w-3.5 h-3.5 text-amber-700" />
                <span>Authentic Lineage Custodianship</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-extrabold text-stone-900">
                Preserving the Sacred Breath of Karrasamu
              </h2>

              <blockquote className="border-l-4 border-amber-500 pl-4 italic text-sm sm:text-base text-stone-800 font-serif leading-relaxed">
                "In Karrasamu, the staff is not held to subjugate an enemy; it is spun to illuminate the undisciplined mind. When the weapon flies at full velocity, there is zero space for pride or hesitation."
              </blockquote>

              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Directly descended from Grandmaster Sri Boddu Ramadasu (1898–1974), who kept Andhra stick combat alive through clandestine camps during colonial bans, our Gurukulam ensures that the ancient oral rhythms and akhada conditioning remain unbroken.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/lineage"
                  className="px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-widest bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white font-serif shadow-md transition-all flex items-center gap-2"
                >
                  <span>Explore Guru Parampara</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  href="/heritage"
                  className="px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-widest bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 shadow-sm transition-all font-medium"
                >
                  Read Historical Chronicle
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FEATURED DEMONSTRATION VIDEOS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          tag="Video Demonstrations"
          teluguSubtitle="ప్రత్యక్ష ప్రదర్శనలు"
          title="Witness the Centrifugal Speed of Karrasamu"
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {youtubeVideos.slice(0, 2).map((vid) => (
            <div
              key={vid.youtubeId}
              onClick={() => {
                setSelectedVideo(vid);
                playWhoosh(1.0);
              }}
              className="group cursor-pointer rounded-2xl overflow-hidden bg-white border border-amber-200/80 hover:border-amber-400 transition-all shadow-md hover:shadow-xl"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-stone-900">
                <Image
                  src={vid.thumbnail}
                  alt={vid.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-[#DC2626] border-2 border-amber-300 flex items-center justify-center text-white shadow-xl shadow-[#DC2626]/50 group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 fill-white ml-0.5" />
                  </div>
                </div>

                <div className="absolute top-3 right-3 bg-black/80 px-2.5 py-1 rounded text-[11px] font-mono text-white">
                  {vid.duration}
                </div>
              </div>

              <div className="p-5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-800 block mb-1">
                  {vid.category}
                </span>
                <h3 className="font-serif text-base font-bold text-stone-900 group-hover:text-[#DC2626] transition-colors">
                  {vid.title}
                </h3>
                <p className="text-xs text-stone-600 mt-2 line-clamp-2">
                  {vid.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-amber-300 bg-white hover:bg-stone-50 text-xs font-bold uppercase tracking-widest text-stone-800 shadow-sm transition-all"
          >
            <span>View Full Photo & Video Gallery</span>
            <ArrowRight className="w-4 h-4 text-amber-700" />
          </Link>
        </div>
      </section>

      {/* 7. ENROLLMENT INVITATION CTA */}
      <section className="py-20 bg-gradient-to-b from-[#F4EFE6] to-[#FAF8F5] border-t border-amber-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-16 h-16 rounded-full bg-[#DC2626]/10 border border-amber-400 mx-auto flex items-center justify-center mb-6 shadow-sm">
            <Shield className="w-8 h-8 text-amber-700" />
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-stone-900 uppercase mb-4">
            Begin Your Warrior Journey
          </h2>

          <p className="text-sm sm:text-base text-stone-600 max-w-xl mx-auto mb-8 leading-relaxed">
            Classes are conducted at Ghantasala Music Collage, sanctified under the divine feet of Goddess Sri Kanaka Durga in Vijayawada. Open to all aspiring practitioners aged 7 and above—no prior experience required.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              onClick={() => playBell(528, 0.8)}
              className="px-8 py-4 rounded-xl font-serif text-xs sm:text-sm font-bold uppercase tracking-widest bg-gradient-to-r from-[#DC2626] via-[#E11D48] to-[#DC2626] hover:opacity-90 text-white shadow-md shadow-[#DC2626]/30 border border-amber-400/50 hover:scale-105 transition-all flex items-center gap-2"
            >
              <span>Submit Enrollment Inquiry</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="https://wa.me/919440128934?text=Namaskaram%2C%20I%20want%20to%20inquire%20about%20Karrasamu%20classes."
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-4 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-widest bg-[#25D366]/15 border border-[#25D366]/40 text-[#15803d] hover:bg-[#25D366] hover:text-white transition-all flex items-center gap-2 shadow-sm"
            >
              <span>WhatsApp Direct</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* LIGHTBOX VIDEO MODAL */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-4xl bg-white border border-amber-300 rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-stone-200">
              <h3 className="font-serif text-sm sm:text-base font-bold text-stone-900">
                {selectedVideo.title}
              </h3>
              <button
                onClick={() => setSelectedVideo(null)}
                className="p-1 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${selectedVideo.youtubeId}?autoplay=1&rel=0`}
                title={selectedVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
