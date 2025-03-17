// You'll need to create or modify this file
import { createClient } from "@/utils/superbase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const returnTo = requestUrl.searchParams.get("returnTo") || "/dashboard"; // Default to editor

  if (code) {
    // Make sure to await the createClient() call
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Redirect to the returnTo path or default to editor
  return NextResponse.redirect(new URL(returnTo, requestUrl.origin));
}
