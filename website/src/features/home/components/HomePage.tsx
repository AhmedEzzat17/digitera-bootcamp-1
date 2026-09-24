"use client";

import Link from "next/link";
import {HomeProductCard} from "@/features/home/components/HomeProductCard";

const products = [
  ["fleur-de-lune", "Fleur de Lune", "Floral / Jasmine & White Musk", 195, "fleur-de-lune.png"],
  ["santal-parchment", "Santal Parchment", "Woody / Sandalwood & Cardamom", 220, "santal-parchment.png"],
  ["sol-dor", "Sol d'Or", "Fresh / Bergamot & Sea Salt", 185, "sol-dor.png"],
  ["noir-cocoon", "Noir Cocoon", "Oriental / Tobacco & Amber", 240, "noir-cocoon.png"],
] as const;

const archetypes = [
  ["Floral", "Petals, Powder, Green", "floral.png"],
  ["Woody", "Sandalwood, Cedar, Vetiver", "woody.png"],
  ["Oriental", "Amber, Spices, Vanilla", "oriental.png"],
  ["Fresh", "Citrus, Marine, Herbs", "fresh.png"],
] as const;

const occasions = [
  ["Personal Use", "Everyday luxury as second skin", "personal-use.png"],
  ["Wedding", "Immortalize the vows with notes of white jasmine", "wedding.png"],
  ["Gift Sets", "A bespoke gesture of ultimate prestige", "gift-sets.png"],
  ["Birthday", "Vibrant, celebrating a personal revolution", "birthday.png"],
] as const;

function SectionHeader({title, subtitle}: {title: string; subtitle: string}) {
  return (
    <div className="flex w-full flex-col items-center gap-3 text-center">
      <h2 className="w-full font-[family-name:var(--font-instrument-serif)] text-[38px] text-[#1a1a1a] sm:text-[48px]">
        {title}
      </h2>
      <p className="w-full text-[12px] font-normal text-[#605a54] sm:text-[14px]">{subtitle}</p>
    </div>
  );
}

export function HomePage() {
  return (
    <div className="bg-[#faf8f5]">
      <section className="relative flex min-h-[560px] flex-col justify-end px-5 pb-12 sm:min-h-[680px] sm:px-10 sm:pb-20 lg:px-20">
        <img
          src="/images/figma-home/hero.png"
          alt=""
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-[#1a1a1a]/30" />
        <div className="relative flex w-full max-w-[580px] flex-col items-start gap-6">
          <h1 className="font-[family-name:var(--font-instrument-serif)] text-[56px] leading-none text-white sm:text-[80px]">
            Narrative In A Glass
          </h1>
          <p className="text-[14px] leading-[1.6] text-white/90 sm:text-[16px]">
            Ethereal extractions designed to evoke memory, stillness, and elegant presence. Crafted with deliberate restraint in our Parisian studio.
          </p>
          <Link href="/products" className="rounded bg-[#c5a880] px-8 py-4 text-[11px] font-bold text-white uppercase sm:px-10 sm:py-[18px] sm:text-[12px]">
            Explore The Collections
          </Link>
        </div>
      </section>

      <section className="flex flex-col gap-12 px-5 py-16 sm:px-10 sm:py-20 lg:px-20 lg:py-[100px]">
        <SectionHeader title="Olfactory Signatures" subtitle="THE CURRENTLY HIGHLY COVETED EXTRACTIONS" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map(([id, name, notes, price, image]) => (
            <HomeProductCard
              key={id}
              id={id}
              name={name}
              notes={notes}
              price={price}
              image={`/images/figma-home/${image}`}
            />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-12 bg-[#f4f0eb] px-5 py-16 sm:px-10 sm:py-20 lg:px-20 lg:py-[100px]">
        <SectionHeader title="Scent Archetypes" subtitle="OLFACTORY FAMILIES TO EXPLORE" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {archetypes.map(([title, description, image]) => (
            <Link key={title} href={`/products?scentFamily=${title.toLowerCase()}`} className="relative flex h-[220px] flex-col justify-end overflow-hidden rounded-lg p-6 sm:h-[280px]">
              <img src={`/images/figma-home/${image}`} alt="" className="absolute inset-0 size-full object-cover" />
              <div className="absolute inset-0 bg-[#1a1a1a]/40" />
              <div className="relative flex flex-col gap-1">
                <h3 className="font-[family-name:var(--font-instrument-serif)] text-[28px] text-white">{title}</h3>
                <p className="text-[11px] text-[#c5a880] uppercase">{description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-12 px-5 py-16 sm:px-10 sm:py-20 lg:px-20 lg:py-[100px]">
        <SectionHeader title="Occasional Scent Curation" subtitle="INTENTIONALLY FORMULATED FOR SIGNIFICANT MOMENTS" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {occasions.map(([title, description, image]) => (
            <Link key={title} href={`/products?occasion=${title.toLowerCase().replaceAll(" ", "-")}`} className="flex flex-col gap-4">
              <img src={`/images/figma-home/${image}`} alt="" className="h-[240px] w-full rounded-md object-cover" />
              <div className="flex flex-col gap-1">
                <h3 className="font-[family-name:var(--font-instrument-serif)] text-[24px] text-[#1a1a1a]">{title}</h3>
                <p className="text-[13px] text-[#605a54]">{description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="flex min-h-[450px] flex-col bg-[#f4f0eb] lg:flex-row">
        <div className="relative min-h-[280px] flex-1 lg:min-h-0">
          <img src="/images/figma-home/promo.png" alt="" className="absolute inset-0 size-full object-cover" />
        </div>
        <div className="flex flex-1 flex-col items-start justify-center gap-6 p-8 sm:p-12 lg:p-16">
          <p className="text-[11px] font-bold text-[#c5a880] uppercase">The Summer Solstice</p>
          <h2 className="max-w-[520px] font-[family-name:var(--font-instrument-serif)] text-[44px] leading-[1.1] text-[#1a1a1a] sm:text-[54px]">Le Jardin d&apos;Or Solstice Collection</h2>
          <p className="max-w-[520px] text-[14px] leading-[1.6] text-[#605a54]">Our highly anticipated limited reserve capturing the fleeting scent of summer dusk. Formulated with night-blooming cereus and sun-warmed clay.</p>
          <Link href="/products" className="rounded bg-[#1a1a1a] px-8 py-4 text-[11px] font-bold text-white uppercase">Secure the Bottle</Link>
        </div>
      </section>

      <section className="flex flex-col items-center gap-8 px-5 py-16 sm:px-10 sm:py-20 lg:px-20 lg:py-[100px]">
        <div className="flex w-full max-w-[600px] flex-col items-center gap-3 text-center">
          <h2 className="font-[family-name:var(--font-instrument-serif)] text-[36px] text-[#1a1a1a] sm:text-[40px]">Atelier Chronicles</h2>
          <p className="text-[13px] text-[#605a54] sm:text-[14px]">Subscribe to receive exclusive access to Private Reserves, launch invitations, and seasonal olfactory compositions.</p>
        </div>
        <form className="flex w-full max-w-[500px] gap-4" onSubmit={(event) => event.preventDefault()}>
          <input type="email" required placeholder="Enter your email address" className="min-w-0 flex-1 rounded border border-[#ebe6de] bg-white px-5 py-4 text-[13px] outline-none placeholder:text-[#605a54]" />
          <button type="submit" className="rounded bg-[#1a1a1a] px-8 py-4 text-[12px] font-bold text-white uppercase">Join</button>
        </form>
      </section>
    </div>
  );
}
