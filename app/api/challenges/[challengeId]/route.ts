import { NextResponse } from "next/server";
import { api } from "../../config";

export async function GET(
  request: Request,
  context: { params: { challengeId: string } }
) {
  try {
    const params = await context.params;
    const challengeId = parseInt(params.challengeId);

    if (isNaN(challengeId)) {
      return NextResponse.json(
        { error: "Invalid challenge ID" },
        { status: 400 }
      );
    }

    const response = await fetch(api.challenges(challengeId), {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch challenge with ID ${challengeId}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error fetching challenge:`, error);
    return NextResponse.json([], { status: 500 });
  }
}
