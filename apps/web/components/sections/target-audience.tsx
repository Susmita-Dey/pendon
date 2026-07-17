export function TargetAudience() {
  const audiences = ["Students", "Researchers", "Founders", "Writers", "Developers", "Designers"];

  return (
    <section className="bg-white px-6 py-16 sm:py-32 border-t border-b border-gray-100">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="mb-12 font-serif text-2xl font-medium text-gray-400">
          Built for minds that never stop.
        </h2>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
          {audiences.map((audience) => (
            <span
              key={audience}
              className="text-2xl font-medium tracking-tight text-gray-950 sm:text-4xl"
            >
              {audience}.
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
