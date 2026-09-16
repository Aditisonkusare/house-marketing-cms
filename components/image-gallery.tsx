export function ImageGallery({ images, alt }: { images: string[]; alt: string }) {
  if (images.length === 0) return null;

  return (
    <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:overflow-visible md:pb-0">
      {images.map((src, i) => (
        <img
          key={`${src}-${i}`}
          src={src}
          alt={`${alt} ${i + 1}`}
          className="aspect-[4/3] w-64 shrink-0 snap-start rounded-lg object-cover md:w-full"
        />
      ))}
    </div>
  );
}
