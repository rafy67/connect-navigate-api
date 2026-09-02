/**
 * Customer profile banner: charcoal-grill hero image, ringed avatar and stats.
 * Presentation only — all data arrives as props from src/routes/profile.tsx.
 */
import { useRef } from "react";
import { motion } from "framer-motion";
import { BadgeCheck, Camera } from "lucide-react";

import bannerImage from "@/assets/profile-banner.jpg";
import customerAvatar from "@/assets/customer-avatar.jpg";

export type ProfileStat = { label: string; value: string };

type Props = {
  name: string;
  email: string;
  joined?: string | null;
  avatarUrl?: string | null;
  tier?: string;
  stats: ProfileStat[];
  onChangeAvatar?: () => void;
  onPickAvatar?: (file: File) => void;
};

export function ProfileBanner({
  name,
  email,
  joined,
  avatarUrl,
  tier = "Flame member",
  stats,
  onChangeAvatar,
  onPickAvatar,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const canEditPhoto = !!(onPickAvatar || onChangeAvatar);

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="mt-5 overflow-hidden rounded-[2rem] border-2 border-charcoal/10 bg-charcoal text-cream shadow-[0_26px_60px_rgba(20,14,10,0.28)]"
    >
      {/* banner */}
      <div className="relative h-40 w-full sm:h-52">
        <img
          src={bannerImage}
          alt="Charcoal grill embers"
          width={1920}
          height={560}
          className="h-full w-full object-cover" loading="lazy" decoding="async" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/45 to-transparent" />
        <span className="absolute right-5 top-5 inline-flex items-center gap-1.5 rounded-full border border-cream/25 bg-charcoal/55 px-3 py-1.5 font-display text-[10px] font-extrabold uppercase tracking-[0.18em] text-cream backdrop-blur">
          <BadgeCheck className="h-3.5 w-3.5 text-flame" aria-hidden="true" />
          {tier}
        </span>
      </div>

      {/* identity row */}
      <div className="relative -mt-12 flex flex-col gap-6 px-6 pb-6 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between sm:px-8 sm:pb-8">
        <div className="flex items-end gap-4">
          <div className="relative shrink-0">
            <span className="block rounded-[1.6rem] bg-charcoal p-1.5 shadow-[0_18px_40px_rgba(20,14,10,0.45)]">
              <img
                src={avatarUrl || customerAvatar}
                alt={name}
                width={816}
                height={816}
                loading="lazy"
                className="h-24 w-24 rounded-[1.3rem] border-2 border-flame object-cover sm:h-28 sm:w-28" decoding="async" />
            </span>
            {onChangeAvatar && (
              <button
                type="button"
                onClick={onChangeAvatar}
                aria-label="Change profile photo"
                className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-charcoal bg-flame text-cream transition-transform hover:scale-105"
              >
                <Camera className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>
          <div className="min-w-0 pb-1">
            <h1 className="truncate font-display text-2xl font-extrabold uppercase sm:text-3xl">
              {name}
            </h1>
            <p className="truncate font-body text-sm text-cream/70">{email}</p>
            {joined && (
              <p className="font-body text-[11px] text-cream/45">
                Member since {new Date(joined).toLocaleDateString("en-GB")}
              </p>
            )}
          </div>
        </div>

        <dl className="grid grid-cols-3 gap-3 text-center">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-cream/10 bg-cream/10 px-4 py-3 backdrop-blur"
            >
              <dt className="font-body text-[10px] uppercase tracking-widest text-cream/60">
                {stat.label}
              </dt>
              <dd className="font-display text-base font-extrabold">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </motion.section>
  );
}
