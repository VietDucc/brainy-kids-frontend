import { auth } from "@clerk/nextjs/server";
import { WordChainClient } from "./word-chain-client";

export default async function WordChainPage() {
  // Authentication check
  await auth();

  return <WordChainClient />;
}
