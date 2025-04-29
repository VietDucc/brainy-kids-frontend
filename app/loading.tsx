import { LoadingSkeleton } from "@/components/loading";

export default function Loading({ text }: { text: string }) {
  return <LoadingSkeleton text={text} />;
}
