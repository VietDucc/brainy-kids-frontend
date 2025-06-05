import { auth } from "@clerk/nextjs/server";
import { ListenNSpeakClient } from "./listen-n-speak-client";

export default async function ListenNSpeakPage() {
  await auth();

  return <ListenNSpeakClient />;
}
