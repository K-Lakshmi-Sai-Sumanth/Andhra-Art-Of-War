"use client";

import React from "react";
import Link from "next/link";
import { Shield, MapPin, Phone, Mail, Clock, ArrowRight, Heart } from "lucide-react";
import { useLanguage } from "./LanguageContext";

export default function Footer() {
  const { t, isTelugu } = useLanguage();

  return (
    <footer className="w-full bg-[#F4EFE6] border-t border-amber-200 text-stone-700 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-amber-200/80">
          {/* Col 1: School Heritage Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#DC2626] to-amber-500 border border-amber-400 flex items-center justify-center shadow-md shadow-[#DC2626]/20">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-serif font-black tracking-wider text-sm uppercase block text-stone-900">
                  {t("common.gurukulamName", "Andhra Art Of War")}
                </span>
                <span className="text-xs text-amber-800 font-serif font-bold">
                  {isTelugu ? "గురుకులం • గురు విజయ కుమార్ కాళిదాసు" : "Gurukulam • Guru vijay Kumar Kalidasu"}
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              {t(
                "footer.description",
                "Dedicated to the authentic preservation, scientific practice, and ethical transmission of Karrasamu—the ancient staff combat art of Andhra Pradesh under Guru vijay Kumar Kalidasu."
              )}
            </p>

            <div className="p-3.5 rounded-2xl bg-white/80 border border-amber-300/70 text-xs shadow-sm">
              <p className="text-amber-900 font-serif italic mb-1 font-semibold">
                {t("common.motto", "\"ధర్మో రక్షతి రక్షితః — The weapon protects only when guided by Dharma.\"")}
              </p>
              <span className="text-[10px] text-stone-500 uppercase tracking-wider block font-bold">
                — {isTelugu ? "ప్రాచీన గురుకుల సూత్రం" : "Ancient Gurukulam Motto"}
              </span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="font-serif font-bold text-sm tracking-wider uppercase text-amber-900 mb-4">
              {t("footer.exploreTitle", "Explore Tradition")}
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-600">
              <li>
                <Link href="/" className="hover:text-amber-800 flex items-center gap-1.5 transition-colors font-medium">
                  <ArrowRight className="w-3 h-3 text-[#DC2626]" />
                  <span>{t("nav.home", "Gurukulam Home")}</span>
                </Link>
              </li>
              <li>
                <Link href="/heritage" className="hover:text-amber-800 flex items-center gap-1.5 transition-colors font-medium">
                  <ArrowRight className="w-3 h-3 text-[#DC2626]" />
                  <span>{t("nav.heritage", "Historical Heritage & Timeline")}</span>
                </Link>
              </li>
              <li>
                <Link href="/lineage" className="hover:text-amber-800 flex items-center gap-1.5 transition-colors font-medium">
                  <ArrowRight className="w-3 h-3 text-[#DC2626]" />
                  <span>{t("nav.lineage", "Guru Parampara & Masters")}</span>
                </Link>
              </li>
              <li>
                <Link href="/training" className="hover:text-amber-800 flex items-center gap-1.5 transition-colors font-medium">
                  <ArrowRight className="w-3 h-3 text-[#DC2626]" />
                  <span>{t("nav.training", "Curriculum & 3D Interactive Dojo")}</span>
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-amber-800 flex items-center gap-1.5 transition-colors font-medium">
                  <ArrowRight className="w-3 h-3 text-[#DC2626]" />
                  <span>{t("nav.gallery", "YouTube & Demonstration Gallery")}</span>
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-amber-800 flex items-center gap-1.5 transition-colors font-medium">
                  <ArrowRight className="w-3 h-3 text-[#DC2626]" />
                  <span>{isTelugu ? "గోప్యతా విధానం & నీతి నియమావళి" : "Privacy Notice & Ethical Code"}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Gurukulam Schedule */}
          <div>
            <h4 className="font-serif font-bold text-sm tracking-wider uppercase text-amber-900 mb-4">
              {t("footer.timingsTitle", "Akhada Timings")}
            </h4>
            <div className="space-y-3 text-xs text-stone-600">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-stone-900">
                    {isTelugu ? "ఉదయపు సూర్యోదయ అఖాడా" : "Morning Sunrise Akhada"}
                  </p>
                  <p>Mon / Wed / Fri: 06:00 AM – 07:30 AM</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-stone-900">
                    {isTelugu ? "సాయంత్రం యువత & పెద్దలు" : "Evening Youth & Adults"}
                  </p>
                  <p>Tue / Thu / Sat: 05:30 PM – 07:00 PM</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-stone-900">
                    {isTelugu ? "వారాంతపు ప్రత్యేక తరగతులు" : "Weekend Masterclasses"}
                  </p>
                  <p>Saturday & Sunday: 08:00 AM – 11:00 AM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Col 4: Location & WhatsApp Inquiry */}
          <div>
            <h4 className="font-serif font-bold text-sm tracking-wider uppercase text-amber-900 mb-4">
              {t("footer.locationTitle", "Gurukulam Location")}
            </h4>
            <div className="space-y-2.5 text-xs text-stone-600">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
                <span>Ghantasala Music Collage, Durgapuram (SN Puram), Vijayawada, Andhra Pradesh 520003</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#DC2626] shrink-0" />
                <span>+91 95530 00201</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#DC2626] shrink-0" />
                <span>acharya@andhraartofwar.org</span>
              </p>

              {/* Direct WhatsApp Action */}
              <div className="pt-2">
                <a
                  href="https://wa.me/919440128934?text=Namaskaram%2C%20I%20am%20interested%20in%20learning%20Karrasamu%20at%20Andhra%20Art%20Of%20War%20Gurukulam%20under%20Guru%20Vijaya%20Kumar%20Kalidasu."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase bg-[#25D366]/15 border border-[#25D366]/40 text-[#15803d] hover:bg-[#25D366] hover:text-white transition-all shadow-sm"
                >
                  <span>{t("footer.chatWhatsApp", "Chat on WhatsApp")}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>
            {t("footer.copyright", "© 2026 Andhra Art Of War. All rights reserved. Traditional heritage of Andhra Pradesh.")}
          </p>
          <p className="flex items-center gap-1">
            <span>{t("common.preservingHeritage", "Preserving Indian Indigenous Martial Arts with")}</span>
            <Heart className="w-3.5 h-3.5 text-[#DC2626] fill-[#DC2626]" />
          </p>
        </div>
      </div>
    </footer>
  );
}
