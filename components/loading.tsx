export function LoadingSkeleton({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-bounce text-5xl">🔄</div>
        <p className="text-xl font-medium text-blue-600">Loading {text}...</p>
      </div>
    </div>
  );
}
