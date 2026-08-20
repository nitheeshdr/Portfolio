import type { ReactNode } from "react";
import { getLoveLetters } from "@/lib/love-letter";
import { LoveLetterEditor } from "@/components/admin/love-letter-editor";

export default async function AdminLoveLetterPage(): Promise<ReactNode> {
  const { letters, envelopeEnabled } = await getLoveLetters();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-foreground font-serif text-[1.75rem] font-medium tracking-tight">
          Love letters
        </h1>
        <p className="text-foreground/60 mt-1 text-[14px] tracking-tight">
          Shown on the home page when someone types the secret trigger word on
          the keyboard and opens the envelope. The trigger word lives in the{" "}
          <code>NEXT_PUBLIC_LOVE_TRIGGER</code> env var, not here, so it
          isn&rsquo;t sitting in this page&rsquo;s source.
        </p>
      </div>
      <LoveLetterEditor
        initialLetters={letters}
        initialEnvelopeEnabled={envelopeEnabled}
      />
    </div>
  );
}

export const dynamic = "force-dynamic";
