import Link from "next/link";
import { listHouseTypes, deleteHouseTypeAction, togglePublishAction } from "@/app/admin/house-types/actions";

export default async function HouseTypesPage() {
  const houseTypes = await listHouseTypes();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">House Types</h1>
        <Link
          href="/admin/house-types/new"
          className="rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white"
        >
          New House Type
        </Link>
      </div>

      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-gray-500">
            <th className="py-2">Name</th>
            <th className="py-2">Price From</th>
            <th className="py-2">Beds / Baths</th>
            <th className="py-2">Status</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {houseTypes.map((houseType) => (
            <tr key={houseType.id} className="border-b border-gray-100">
              <td className="py-2">{houseType.name}</td>
              <td className="py-2">€{houseType.priceFrom.toLocaleString()}</td>
              <td className="py-2">
                {houseType.bedrooms} / {houseType.bathrooms}
              </td>
              <td className="py-2">
                <span
                  className={
                    houseType.status === "PUBLISHED"
                      ? "rounded bg-green-100 px-2 py-0.5 text-xs text-green-800"
                      : "rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                  }
                >
                  {houseType.status}
                </span>
              </td>
              <td className="space-x-3 py-2">
                <Link href={`/admin/house-types/${houseType.id}`} className="text-blue-600 hover:underline">
                  Edit
                </Link>
                <form action={togglePublishAction.bind(null, houseType)} className="inline">
                  <button type="submit" className="text-gray-600 hover:underline">
                    {houseType.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                  </button>
                </form>
                <form action={deleteHouseTypeAction.bind(null, houseType.id)} className="inline">
                  <button type="submit" className="text-red-600 hover:underline">
                    Delete
                  </button>
                </form>
              </td>
            </tr>
          ))}
          {houseTypes.length === 0 && (
            <tr>
              <td colSpan={5} className="py-6 text-center text-gray-400">
                No house types yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
