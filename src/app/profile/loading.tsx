export default function Loading() {
  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="h-6 w-40 animate-pulse rounded bg-gray-200" />
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-[160px_1fr]">
        <div className="h-32 w-32 rounded-full bg-gray-200 animate-pulse" />
        <div className="space-y-3">
          <div className="h-5 w-64 rounded bg-gray-200 animate-pulse" />
          <div className="h-5 w-72 rounded bg-gray-200 animate-pulse" />
          <div className="h-5 w-56 rounded bg-gray-200 animate-pulse" />
        </div>
      </div>
    </div>
  );
}