import { auth } from "@clerk/nextjs/server";
import { GamesClient } from "./games-client";

export default async function GamesPage() {
  await auth();

  return <GamesClient />;
}
