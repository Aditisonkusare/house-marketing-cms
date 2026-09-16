import Link from "next/link";
import { formatArea, formatCurrency } from "@/lib/format";
import type { HouseType } from "@/app/(site)/houses/queries";

export function HouseCard({ houseType }: { houseType: HouseType }) {
  const image = houseType.images[0];

  return (
    <Link
      href={`/houses/${houseType.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 transition hover:shadow-md"
    >
      <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100">
        {image ? (
          <img
            src={image}
            alt={houseType.name}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
            No image yet
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="font-semibold text-gray-900">{houseType.name}</h3>
        <p className="text-sm text-gray-500">
          {houseType.bedrooms} bed &middot; {houseType.bathrooms} bath &middot;{" "}
          {formatArea(houseType.floorAreaSqm)}
        </p>
        <p className="mt-auto pt-2 text-sm font-medium text-gray-900">
          From {formatCurrency(houseType.priceFrom)}
        </p>
      </div>
    </Link>
  );
}
