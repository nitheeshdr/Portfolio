import { Achievements } from "@/components/about/achievements";
import { Awards } from "@/components/about/awards";
import { Education } from "@/components/about/education";
import { Experience } from "@/components/about/experience";
import { Family } from "@/components/about/family";
import { Filmography } from "@/components/about/filmography";
import { PolaroidStrip } from "@/components/about/polaroid-strip";
import { Skills } from "@/components/about/skills";
import { Stack } from "@/components/about/stack";
import { ContactCard } from "@/components/contact/contact-card";
import {
  JsonLd,
  breadcrumbSchema,
  profilePageSchema,
} from "@/components/seo/json-ld";
import { FadeIn } from "@/components/ui/motion-primitives";
import { createMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = createMetadata({
  title: "About",
  description:
    "Nitheesh Rajendran — Founder & CEO of Setups Works, full stack developer and AI product engineer in Chennai, India. Background, experience, and skills.",
  path: "/about",
});

export default function AboutPage(): ReactNode {
  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <JsonLd
        items={[
          profilePageSchema("/about"),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
        ]}
      />
      <section className="mx-auto w-full max-w-312 pt-6 sm:pt-8 md:pt-20">
        <PolaroidStrip />
      </section>

      <section className="mx-auto w-full max-w-160 px-6 pt-20 pb-16 sm:px-10 sm:pt-28 sm:pb-24">
        <FadeIn delay={0.5}>
          <div className="border-foreground/5 bg-foreground/1.5 dark:bg-foreground/3 rounded-4xl border p-8 sm:p-12">
            <h1 className="text-foreground font-serif text-[1.75rem] font-medium tracking-tight sm:text-[2rem]">
              Hello! I&rsquo;m{" "}
              <span className="border-foreground/30 border-b pb-0.5">
                Nitheesh Rajendran
              </span>
              .
            </h1>
            <div className="text-foreground/75 mt-8 space-y-6 text-[17px] leading-[1.7] tracking-tight sm:text-[18px]">
              <p>
                I&rsquo;m the{" "}
                <strong className="text-foreground font-semibold">
                  Founder &amp; CEO of Setups Works
                </strong>
                , a digital product and technology studio where I work across
                web development, ecommerce, product design, AI, automation, and
                digital experiences. My approach is not limited to writing code;
                I enjoy understanding the problem, designing the experience,
                building the system, shipping the product, and improving it
                after launch.
              </p>
              <p>
                I&rsquo;m a{" "}
                <strong className="text-foreground font-semibold">
                  software developer, founder, product builder, and filmmaker
                </strong>{" "}
                from Chennai, India. I spend most of my time building things
                &mdash; digital products with code, businesses through Setups
                Works, and stories through filmmaking.
              </p>
              <p>
                On the technical side, I primarily work with{" "}
                <strong className="text-foreground font-semibold">
                  React, Next.js, TypeScript, Node.js, MongoDB, PostgreSQL,
                  Supabase
                </strong>
                , and modern cloud platforms. I also work with AI and LLM-based
                technologies to experiment with intelligent products,
                automation, and new ways of interacting with software.
              </p>
              <p>
                Some of my work has involved SaaS platforms, ecommerce systems,
                analytics products, AI applications, custom APIs, payment and
                shipping integrations, and business tools. I particularly enjoy
                products where technology solves a real operational problem
                rather than simply adding another layer of complexity.
              </p>
              <p>
                I&rsquo;m also interested in{" "}
                <strong className="text-foreground font-semibold">
                  responsible security research
                </strong>
                . I have conducted security assessments and reported
                vulnerabilities through responsible disclosure, including
                research involving a Government of Tamil Nadu web application.
                Security research has helped me develop a mindset of questioning
                how systems behave beyond their intended user interface.
              </p>
              <p>
                Technology is only one side of what I do. I&rsquo;m also a{" "}
                <strong className="text-foreground font-semibold">
                  filmmaker and director
                </strong>
                , working across screenwriting, direction, cinematography,
                editing, and production. Filmmaking gives me a completely
                different way of thinking about structure, emotion, pacing, and
                storytelling &mdash; ideas that often influence how I approach
                product design as well.
              </p>
              <p>
                I graduated with my{" "}
                <strong className="text-foreground font-semibold">
                  B.Tech in Computer Science Engineering (Artificial
                  Intelligence &amp; Machine Learning)
                </strong>{" "}
                at VISTAS, Chennai.
              </p>
              <p>
                I&rsquo;m still learning, still experimenting, and still
                building. That is probably the simplest way to describe what I
                do.
              </p>
            </div>
          </div>
        </FadeIn>
      </section>

      <section className="mx-auto w-full max-w-[40rem] px-6 pb-20 sm:px-10 sm:pb-28">
        <FadeIn delay={0.1}>
          <div className="flex flex-col gap-10">
            <Awards />
            <Experience />
            <Skills />
            <Stack />
            <Education />
            <Family />
            <Filmography />
            <Achievements />
          </div>
        </FadeIn>
      </section>

      <ContactCard />
    </main>
  );
}
