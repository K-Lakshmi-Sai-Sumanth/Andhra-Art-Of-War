import React from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import { ShieldCheck, Lock, EyeOff, UserCheck } from "lucide-react";

export const metadata = {
  title: "Privacy Notice & Data Ethics | Sri Vijaya Karrasamu Gurukulam",
  description: "Privacy policy regarding student contact inquiries, data protection, and third-party media embeds.",
};

export default function PrivacyPage() {
  return (
    <div className="w-full py-12 md:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-[#FAF8F5]">
      <SectionHeading
        tag="Data Protection"
        teluguSubtitle="గోప్యతా విధానం"
        title="Privacy Notice & Student Data Ethics"
        align="center"
      />

      <div className="bg-white border border-amber-200/80 rounded-3xl p-6 sm:p-10 space-y-8 text-xs sm:text-sm text-stone-600 shadow-xl leading-relaxed">
        <div>
          <h3 className="font-serif text-lg font-bold text-stone-900 mb-2 flex items-center gap-2">
            <Lock className="w-5 h-5 text-amber-700" />
            <span>1. Collection of Inquiry Information</span>
          </h3>
          <p>
            When you submit an enrollment or class inquiry through our website, we collect only the necessary details required to respond to you: your name, contact phone number or email address, inquiry type, and message. We do not sell, rent, or share your contact details with any commercial third-party marketing companies.
          </p>
        </div>

        <div>
          <h3 className="font-serif text-lg font-bold text-stone-900 mb-2 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-700" />
            <span>2. Purpose & Communication</span>
          </h3>
          <p>
            Your details are used solely by Sri Vijaya Karrasamu Gurukulam administrators to coordinate batch timings, provide fee details, and address questions regarding martial training. You may opt out of future notifications at any time by messaging or emailing us.
          </p>
        </div>

        <div>
          <h3 className="font-serif text-lg font-bold text-stone-900 mb-2 flex items-center gap-2">
            <EyeOff className="w-5 h-5 text-amber-700" />
            <span>3. Third-Party Media & YouTube Embeds</span>
          </h3>
          <p>
            Our website implements a performance-conscious "thumbnail-first" architecture for demonstration videos. Video players from YouTube are only initialized and loaded when you explicitly click the Play button, minimizing unnecessary background tracking scripts.
          </p>
        </div>

        <div>
          <h3 className="font-serif text-lg font-bold text-stone-900 mb-2 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-amber-700" />
            <span>4. Image & Minor Student Safeguards</span>
          </h3>
          <p>
            All training photographs and demonstration reels featuring disciples are published with explicit permissions from students or their guardians. We honor privacy requests promptly.
          </p>
        </div>
      </div>
    </div>
  );
}
