import Link from "next/link";
import { notFound } from "next/navigation";
import { getHouseTypeBySlug } from "@/app/(site)/houses/queries";
import { ImageGallery } from "@/components/image-gallery";
import { formatArea, formatCurrency } from "@/lib/format";

export default async function HouseTypeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const houseType = await getHouseTypeBySlug(slug);
  if (!houseType) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link
        href="/houses"
        className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
      >
        &larr; Back to house types
      </Link>

      <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-gray-100">{houseType.name}</h1>

      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Price from" value={formatCurrency(houseType.priceFrom)} />
        <Stat label="Bedrooms" value={String(houseType.bedrooms)} />
        <Stat label="Bathrooms" value={String(houseType.bathrooms)} />
        <Stat label="Floor area" value={formatArea(houseType.floorAreaSqm)} />
      </div>

      {houseType.images.length > 0 && (
        <div className="mt-8">
          <ImageGallery images={houseType.images} alt={houseType.name} />
        </div>
      )}

      {houseType.description && (
        <p className="mt-8 whitespace-pre-wrap text-gray-600 dark:text-gray-400">
          {houseType.description}
        </p>
      )}

      <div className="mt-12 rounded-lg border border-gray-200 bg-gray-50 p-6 text-center dark:border-gray-800 dark:bg-gray-900">
        <p className="text-gray-700 dark:text-gray-300">Interested in {houseType.name}?</p>
        <Link
          href="/register"
          className="mt-3 inline-flex items-center justify-center rounded-md bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
        >
          Register for updates
        </Link>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-200 p-4 text-center dark:border-gray-800">
      <p className="text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500">{label}</p>
      <p className="mt-1 font-semibold text-gray-900 dark:text-gray-100">{value}</p>
    </div>
  );
}
