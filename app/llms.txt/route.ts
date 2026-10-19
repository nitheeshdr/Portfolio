import { buildLlmsTxt, textResponse } from "@/lib/llms";

export const revalidate = 3600;

export async function GET(): Promise<Response> {
  return textResponse(await buildLlmsTxt({ full: false }));
}
