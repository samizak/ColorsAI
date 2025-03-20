import { NextResponse } from "next/server";
import { createClient } from "@/utils/superbase/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("coloring_pages")
      .select("*")
      .eq("id", params.id)
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      return NextResponse.json(
        { error: "Coloring page not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching coloring page:", error);
    return NextResponse.json(
      { error: "Failed to fetch coloring page" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { title, image } = await request.json();

    const { data, error } = await supabase
      .from("coloring_pages")
      .update({ title, image })
      .eq("id", params.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating coloring page:", error);
    return NextResponse.json(
      { error: "Failed to update coloring page" },
      { status: 500 }
    );
  }
} 