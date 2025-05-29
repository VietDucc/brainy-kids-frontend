import { NextRequest, NextResponse } from "next/server";
import { api } from "../../config";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic"; // Use Next.js dynamic configuration

export async function GET(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const courseId = await parseInt(params.courseId, 10);
    const { getToken } = await auth();
    const token = await getToken({ template: "jwt-clerk" });
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (isNaN(courseId)) {
      return NextResponse.json({ error: "Invalid course ID" }, { status: 400 });
    }
    const response = await fetch(api.units(courseId), {
      headers: {
        Authorization: `Bearer ${token}`,
        "no-cache": "true",
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch units for course ${courseId}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch units for course" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const { getToken } = await auth();
  const token = await getToken({ template: "jwt-clerk" });
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { courseId, title, description, orderUnit } = await request.json();

  const response = await fetch(api.units(courseId), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, description, orderUnit }),
  });

  if (!response.ok) { 
    return NextResponse.json({ error: "Failed to create unit" }, { status: 500 });
  }

  return NextResponse.json({ message: "Unit created successfully" }, { status: 201 });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const { getToken } = await auth();
    const token = await getToken({ template: "jwt-clerk" });
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, orderUnit } = await request.json();
    const unitId = parseInt(params.courseId, 10);

    if (isNaN(unitId)) {
      return NextResponse.json({ error: "Invalid unit ID" }, { status: 400 });
    }

    console.log("Updating unit:", { unitId, title, description, orderUnit });

    const response = await fetch(api.units(unitId), {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description, orderUnit }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      return NextResponse.json(
        { error: "Failed to update unit" },
        { status: response.status }
      );
    }

    return NextResponse.json({ message: "Unit updated successfully" });
  } catch (error) {
    console.error("Error updating unit:", error);
    return NextResponse.json(
      { error: "Failed to update unit" },
      { status: 500 }
    );
  }
} 

export async function DELETE(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const { getToken } = await auth();
    const token = await getToken({ template: "jwt-clerk" });
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

          const unitId = parseInt(params.courseId, 10);
    if (isNaN(unitId)) {
      return NextResponse.json({ error: "Invalid unit ID" }, { status: 400 });
    }

    const response = await fetch(api.units(unitId), {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to delete unit" }, { status: 500 });
    } 

    return NextResponse.json(
      { message: "Unit deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting unit:", error);
    return NextResponse.json({ error: "Failed to delete unit" }, { status: 500 });
  }
}
