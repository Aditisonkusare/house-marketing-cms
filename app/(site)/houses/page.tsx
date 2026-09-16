import { listPublishedHouseTypes } from "@/app/(site)/houses/queries";
import { HouseCard } from "@/components/house-card";

export const metadata = {
  title: "House Types | Glenveagh Homes",
};

export default async function HouseTypesPage() {
  const houseTypes = await listPublishedHouseTypes();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-gray-900">House Types</h1>
      <p className="mt-2 text-gray-600">Browse the house types available at this development.</p>

      {houseTypes.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {houseTypes.map((houseType) => (
            <HouseCard key={houseType.id} houseType={houseType} />
          ))}
        </div>
      ) : (
        <p className="mt-8 text-gray-500">No house types published yet — check back shortly.</p>
      )}
    </div>
  );
}
