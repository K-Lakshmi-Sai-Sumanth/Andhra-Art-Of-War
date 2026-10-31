"use client";

import React, { useState } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import { useLanguage } from "@/components/layout/LanguageContext";
import { useSound } from "@/components/layout/SoundContext";
import confetti from "canvas-confetti";
import {
  MapPin,
  Phone,
  Mail,
  Send,
  CheckCircle,
  ExternalLink,
  Clock,
  Sparkles,
  AlertCircle,
  ShieldCheck
} from "lucide-react";

export default function ContactPage() {
  const { isTelugu, t } = useLanguage();
  const { playBell, playWoodClick } = useSound();

  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    inquiryType: "Joining a Beginner Class",
    preferredLanguage: "Telugu & English",
    message: "",
  });

  const [status, setStatus] = useState({
    submitting: false,
    success: false,
    error: null,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    playWoodClick();
    setStatus({ submitting: true, success: false, error: null });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Submission failed");
      }

      setStatus({ submitting: false, success: true, error: null });
      playBell(528, 2.0);

      // Trigger celebratory crimson & gold confetti
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#D97706", "#DC2626", "#EF4444", "#F59E0B"],
      });

      setFormData({
        name: "",
        contact: "",
        inquiryType: "Joining a Beginner Class",
        preferredLanguage: "Telugu & English",
        message: "",
      });
    } catch (err) {
      setStatus({ submitting: false, success: false, error: err.message });
    }
  };

  return (
    <div className="w-full py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-[#FAF8F5]">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <SectionHeading
          tag={t("contact.heading.tag", "Direct Inquiry & Enrollment")}
          teluguSubtitle={t("contact.heading.teluguSubtitle", "గురుకుల ప్రవేశ సమాచారం")}
          title={t("contact.heading.title", "Connect with Andhra Art Of War")}
          align="center"
        />
        <p className="text-sm md:text-base text-stone-600 leading-relaxed font-normal">
          {t(
            "contact.heading.description",
            "Whether inquiring about beginner batches, master workshops, or cultural demonstrations, Guru vijay Kumar Kalidasu and our trainers welcome your correspondence."
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Contact Form */}
        <div className="lg:col-span-7 bg-white border border-amber-200/80 rounded-3xl p-6 sm:p-10 shadow-xl">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-amber-100">
            <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626]" />
            <h3 className="font-serif text-xl font-bold text-stone-900">
              Enrollment & Inquiry Form
            </h3>
          </div>

          {status.success ? (
            <div className="p-8 rounded-2xl bg-amber-50/70 border border-amber-300 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#DC2626] text-white flex items-center justify-center mx-auto shadow-md">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h4 className="font-serif text-2xl font-bold text-stone-900">
                Namaskaram! Inquiry Received.
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                Thank you for your interest in preserving Andhra Karrasamu. Our senior trainers will review your submission and contact you within 24 hours.
              </p>
              <button
                onClick={() => setStatus({ submitting: false, success: false, error: null })}
                className="mt-4 px-6 py-2.5 rounded-xl text-xs font-serif font-bold uppercase tracking-wider bg-white border border-amber-300 text-stone-800 hover:bg-stone-50 shadow-sm"
              >
                Send Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {status.error && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-300 flex items-start gap-3 text-red-700 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{status.error}</span>
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-900 mb-1.5">
                  Full Name (పూర్తి పేరు) <span className="text-[#DC2626]">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. S. Ramakrishna Varma"
                  className="w-full bg-[#FAF8F5] border border-stone-300 focus:border-amber-500 rounded-xl px-4 py-3 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500 shadow-sm"
                />
              </div>

              {/* Phone or Email */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-900 mb-1.5">
                  Phone Number or Email (ఫోన్ లేదా ఈమెయిల్) <span className="text-[#DC2626]">*</span>
                </label>
                <input
                  type="text"
                  name="contact"
                  required
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="e.g. +91 98765 43210 or yourname@example.com"
                  className="w-full bg-[#FAF8F5] border border-stone-300 focus:border-amber-500 rounded-xl px-4 py-3 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500 shadow-sm"
                />
              </div>

              {/* Inquiry Type & Preferred Language */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-amber-900 mb-1.5">
                    Inquiry Category
                  </label>
                  <select
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleChange}
                    className="w-full bg-[#FAF8F5] border border-stone-300 focus:border-amber-500 rounded-xl px-4 py-3 text-xs sm:text-sm text-stone-900 focus:outline-none shadow-sm"
                  >
                    <option value="Joining a Beginner Class">Joining a Beginner Class</option>
                    <option value="Weekend Intensive Masterclass">Weekend Masterclass</option>
                    <option value="Youth & Kids Training (Ages 7-16)">Youth & Kids Training</option>
                    <option value="Women Self-Defence Batch">Women Self-Defence Batch</option>
                    <option value="Cultural Demonstration / Event">Cultural Demonstration</option>
                    <option value="Martial Arts Research & Media">Research & Media</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-amber-900 mb-1.5">
                    Preferred Language
                  </label>
                  <select
                    name="preferredLanguage"
                    value={formData.preferredLanguage}
                    onChange={handleChange}
                    className="w-full bg-[#FAF8F5] border border-stone-300 focus:border-amber-500 rounded-xl px-4 py-3 text-xs sm:text-sm text-stone-900 focus:outline-none shadow-sm"
                  >
                    <option value="Telugu & English">Telugu & English (తెలుగు & ఇంగ్లీష్)</option>
                    <option value="Telugu Only">Telugu Only (కేవలం తెలుగు)</option>
                    <option value="English Only">English Only</option>
                    <option value="Hindi">Hindi (హిందీ)</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-900 mb-1.5">
                  Message or Background Experience (సందేశం) <span className="text-[#DC2626]">*</span>
                </label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your background, goals, or preferred batch timing..."
                  className="w-full bg-[#FAF8F5] border border-stone-300 focus:border-amber-500 rounded-xl px-4 py-3 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500 shadow-sm"
                />
              </div>

              <button
                type="submit"
                disabled={status.submitting}
                className="w-full py-4 rounded-xl font-serif text-xs sm:text-sm font-bold uppercase tracking-widest bg-gradient-to-r from-[#DC2626] via-[#E11D48] to-[#DC2626] hover:opacity-90 text-white shadow-md shadow-[#DC2626]/25 border border-amber-400/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-[1.01]"
              >
                {status.submitting ? (
                  <span>Submitting Inquiry...</span>
                ) : (
                  <>
                    <span>Submit Gurukulam Application</span>
                    <Send className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Right Column: Location Map & Direct WhatsApp Details */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick WhatsApp Action Box */}
          <div className="bg-emerald-50 border border-emerald-300 rounded-3xl p-6 shadow-md">
            <h4 className="font-serif text-lg font-bold text-stone-900 mb-1">
              Prefer Instant WhatsApp Chat?
            </h4>
            <p className="text-xs text-stone-600 mb-4">
              Get immediate answers regarding fees, batch openings, and directions directly from our admin coordinator.
            </p>
            <a
              href="https://wa.me/919440128934?text=Namaskaram%2C%20I%20want%20to%20inquire%20about%20Karrasamu%20training%20at%20Andhra%20Art%20Of%20War%20Gurukulam%20under%20Guru%20Vijaya%20Kumar%20Kalidasu."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl text-xs font-bold uppercase tracking-widest bg-[#25D366] text-white hover:bg-[#20b858] transition-all shadow-md font-serif"
            >
              <span>Message on WhatsApp (+91 95530 00201)</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Location & Akhada Facility Card */}
          <div className="bg-white border border-amber-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex items-center gap-3 pb-3 border-b border-amber-100">
              <MapPin className="w-6 h-6 text-[#DC2626]" />
              <div>
                <h4 className="font-serif font-bold text-base text-stone-900">
                  {t("common.gurukulamName", "Andhra Art Of War")}
                </h4>
                <p className="text-xs text-amber-800 font-semibold">{t("contact.directConnect.locationTitle", "Traditional Akhada Ground")}</p>
              </div>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-stone-600">
              <p>
                <span className="font-bold text-stone-900 block mb-0.5">Physical Address:</span>
                Under the Divine Feet of Sri Kanaka Durga Ammavaru, Ghantasala Music Collage, Durgapuram (SN Puram), Vijayawada, Andhra Pradesh 520003, India.
              </p>

              <p>
                <span className="font-bold text-stone-900 block mb-0.5">Visiting & Trial Hours:</span>
                Monday to Saturday: 06:30 AM – 09:00 AM & 05:00 PM – 07:30 PM.
              </p>

              <p>
                <span className="font-bold text-stone-900 block mb-0.5">Direct Acharya Desk:</span>
                +91 95530 00201 / contact@andhraartofwar.org
              </p>
            </div>

            {/* Stylized Visual Map Card */}
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-amber-200 bg-[#FAF8F5] flex items-center justify-center p-4 text-center shadow-inner">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-[#DC2626] border border-amber-300 mx-auto flex items-center justify-center text-white shadow-md">
                  <MapPin className="w-5 h-5" />
                </div>
                <p className="font-serif font-bold text-xs text-stone-900">
                  Vijayawada Indrakeeladri Akhada
                </p>
                <p className="text-[11px] text-amber-800 font-medium">
                  Under the Lotus Feet of Sri Kanaka Durga • Latitude 16.5144° N, Longitude 80.6066° E
                </p>
                <a
                  href="https://maps.google.com/?q=Indrakeeladri+Kanaka+Durga+Temple+Vijayawada"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#DC2626] hover:text-amber-800 uppercase tracking-wider mt-1"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
