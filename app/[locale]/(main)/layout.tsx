import type { PropsWithChildren } from "react";
import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";
import { MainLayoutClient } from "./main-layout-client";
import { MainLayoutSkeleton } from "./main-layout-skeleton";
import { api } from "@/app/api/config";

async function getActiveUserStatus(
  userId: string,
  token: string
): Promise<boolean> {
  try {
    const response = await fetch(api.activeUser(userId), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.active || false;
  } catch (error) {
    console.error("Error fetching active user:", error);
    return false;
  }
}

const MainLayout = async ({ children }: PropsWithChildren) => {
  const { userId, getToken } = await auth();

  if (!userId) {
    return (
      <Suspense fallback={<MainLayoutSkeleton />}>
        <MainLayoutClient activeUser={false} userId={null}>
          {children}
        </MainLayoutClient>
      </Suspense>
    );
  }

  const token = await getToken({ template: "jwt-clerk" });
  const activeUser = token ? await getActiveUserStatus(userId, token) : false;

  return (
    <Suspense fallback={<MainLayoutSkeleton />}>
      <MainLayoutClient activeUser={activeUser} userId={userId}>
        {children}
      </MainLayoutClient>
    </Suspense>
  );
};

export default MainLayout;
