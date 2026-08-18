import type { ReactNode } from "react";
import { getLoveLetters } from "@/lib/love-letter";
import { LoveLetterEditor } from "@/components/admin/love-letter-editor";

export default async function AdminLoveLetterPage(): Promise<ReactNode> {
  const { letters } = await getLoveLetters();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-[1.75rem] font-medium tracking-tight text-foreground">
          Love letters
        </h1>
        <p className="text-foreground/60 mt-1 text-[14px] tracking-tight">
          Shown on the home page when someone types &ldquo;love&rdquo; on the keyboard and opens the envelope.
        </p>
      </div>
      <LoveLetterEditor initialLetters={letters} />
    </div>
  );
}

export const dynamic = "force-dynamic";
