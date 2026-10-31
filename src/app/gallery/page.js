"use client";

import React, { useState } from "react";
import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import { galleryCategories, galleryPhotos, youtubeVideos } from "@/data/galleryData";
import { useLanguage } from "@/components/layout/LanguageContext";
import { useSound } from "@/components/layout/SoundContext";
import {
  Play,
  X,
  Maximize2,
  Filter,
  Calendar,
  Layers,
  Sparkles,
  ChevronRight
} from "lucide-react";

export default function GalleryPage() {
  const { isTelugu, t } = useLanguage();
  const { playWhoosh, playWoodClick } = useSound();

  const [activeTab, setActiveTab] = useState("all"); // "all" | "photos" | "videos"
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [lightboxPhoto, setLightboxPhoto] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);

  // Filter photos
  const filteredPhotos = galleryPhotos.filter(
    (p) => selectedCategory === "All" || p.category === selectedCategory
  );

  // Filter videos
  const filteredVideos = youtubeVideos.filter(
    (v) => selectedCategory === "All" || v.category === selectedCategory
  );

  return (
    <div className="w-full py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-[#FAF8F5]">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <SectionHeading
          tag={t("gallery.heading.tag", "Living Visual Archives")}
          teluguSubtitle={t("gallery.heading.teluguSubtitle", "చిత్ర & దృశ్యమాలిక")}
          title={t("gallery.heading.title", "Gurukulam Demonstrations & Photos")}
          align="center"
        />
        <p className="text-sm md:text-base text-stone-600 leading-relaxed font-normal">
          {t(
            "gallery.heading.description",
            "High-speed staff rotations, partner sparring in the combat arena, and archival heritage footage captured across Andhra Pradesh."
          )}
        </p>
      </div>

      {/* Main Mode Switcher: All / High-Res Photos / YouTube Demonstrations */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
        {[
          { id: "all", label: "All Media", telugu: "అన్నీ" },
          { id: "photos", label: "Archival Photography", telugu: "చిత్రాలు" },
          { id: "videos", label: "Demonstration Videos", telugu: "వీడియోలు" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              playWoodClick();
            }}
            className={`px-5 py-2.5 rounded-xl text-xs font-serif font-bold uppercase tracking-wider transition-all ${activeTab === tab.id
                ? "bg-gradient-to-r from-[#DC2626] to-[#EF4444] text-white shadow-md shadow-[#DC2626]/20 border border-amber-400/40"
                : "bg-white text-stone-700 hover:text-stone-900 border border-stone-200 shadow-sm"
              }`}
          >
            {isTelugu ? tab.telugu : tab.label}
          </button>
        ))}
      </div>

      {/* Category Pills Filter */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
        {galleryCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              playWoodClick();
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${selectedCategory === cat
                ? "bg-amber-500 text-white font-bold shadow-sm"
                : "bg-white text-stone-700 hover:text-stone-900 border border-stone-200 shadow-sm"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* YOUTUBE VIDEOS SECTION (Thumbnail-First Zero-Bloat) */}
      {(activeTab === "all" || activeTab === "videos") && filteredVideos.length > 0 && (
        <div className="mb-20">
          <div className="flex items-center gap-2 mb-6 border-b border-amber-200 pb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626]" />
            <h3 className="font-serif text-xl font-bold text-stone-900">
              YouTube Demonstrations (Click-to-Load Playback)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((vid) => (
              <div
                key={vid.youtubeId}
                onClick={() => {
                  setActiveVideo(vid);
                  playWhoosh(1.1);
                }}
                className="group cursor-pointer rounded-2xl overflow-hidden bg-white border border-amber-200/80 hover:border-amber-400 transition-all shadow-md hover:shadow-xl flex flex-col justify-between"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-stone-900">
                  <Image
                    src={vid.thumbnail}
                    alt={vid.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-[#DC2626] border border-amber-300 flex items-center justify-center text-white shadow-xl shadow-[#DC2626]/50 group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </div>
                  </div>

                  <span className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded text-[10px] font-mono text-white">
                    {vid.duration}
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-amber-800 block mb-1">
                      {vid.category}
                    </span>
                    <h4 className="font-serif text-sm font-bold text-stone-900 group-hover:text-[#DC2626] transition-colors line-clamp-2">
                      {vid.title}
                    </h4>
                  </div>
                  <p className="text-xs text-stone-600 mt-2 line-clamp-2">
                    {vid.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* HIGH-RES ARCHIVAL PHOTOGRAPHY GRID */}
      {(activeTab === "all" || activeTab === "photos") && filteredPhotos.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-6 border-b border-amber-200 pb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
            <h3 className="font-serif text-xl font-bold text-stone-900">
              High-Resolution Photography
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPhotos.map((photo) => (
              <div
                key={photo.id}
                onClick={() => {
                  setLightboxPhoto(photo);
                  playWoodClick();
                }}
                className="group cursor-pointer rounded-2xl overflow-hidden bg-white border border-amber-200/80 hover:border-amber-400 transition-all shadow-md hover:shadow-xl"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-900">
                  <Image
                    src={photo.image}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70" />

                  <div className="absolute top-3 right-3 p-2 rounded-xl bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-4 h-4" />
                  </div>

                  <span className="absolute bottom-2 left-3 bg-white/90 px-2 py-1 rounded text-[10px] text-amber-900 uppercase tracking-wider font-bold shadow-sm">
                    {photo.category}
                  </span>
                </div>

                <div className="p-4">
                  <h4 className="font-serif text-sm font-bold text-stone-900 group-hover:text-[#DC2626] transition-colors">
                    {photo.title}
                  </h4>
                  <p className="text-xs text-amber-800 font-serif mt-0.5 font-semibold">{photo.teluguTitle}</p>
                  <p className="text-xs text-stone-600 mt-2 line-clamp-2">{photo.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LIGHTBOX PHOTO MODAL */}
      {lightboxPhoto && (
        <div
          onClick={() => setLightboxPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl bg-white border border-amber-300 rounded-2xl overflow-hidden shadow-2xl"
          >
            <div className="flex items-center justify-between p-4 border-b border-amber-100">
              <div>
                <h3 className="font-serif text-sm sm:text-base font-bold text-stone-900">
                  {lightboxPhoto.title}
                </h3>
                <span className="text-xs text-amber-800 font-semibold">{lightboxPhoto.teluguTitle}</span>
              </div>
              <button
                onClick={() => setLightboxPhoto(null)}
                className="p-1 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-[16/10] w-full bg-stone-950">
              <Image
                src={lightboxPhoto.image}
                alt={lightboxPhoto.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 896px"
                className="object-contain"
              />
            </div>

            <div className="p-4 bg-[#FAF8F5] border-t border-amber-100">
              <p className="text-xs sm:text-sm text-stone-700">{lightboxPhoto.caption}</p>
              <div className="flex items-center justify-between mt-2 text-[11px] text-amber-800 font-medium">
                <span>Category: {lightboxPhoto.category}</span>
                <span>Archive Date: {lightboxPhoto.date}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* YOUTUBE VIDEO MODAL */}
      {activeVideo && (
        <div
          onClick={() => setActiveVideo(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl bg-white border border-amber-300 rounded-2xl overflow-hidden shadow-2xl"
          >
            <div className="flex items-center justify-between p-4 border-b border-amber-100">
              <h3 className="font-serif text-sm sm:text-base font-bold text-stone-900">
                {activeVideo.title}
              </h3>
              <button
                onClick={() => setActiveVideo(null)}
                className="p-1 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            <div className="p-4 bg-[#FAF8F5] border-t border-amber-100">
              <p className="text-xs text-stone-700">{activeVideo.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
