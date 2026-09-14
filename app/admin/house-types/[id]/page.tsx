import { notFound } from "next/navigation";
import { getHouseType, updateHouseTypeAction } from "@/app/admin/house-types/actions";
import { HouseTypeForm } from "@/app/admin/house-types/house-type-form";

export default async function EditHouseTypePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const houseType = await getHouseType(id);
  if (!houseType) notFound();

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-gray-900">Edit House Type</h1>
      <HouseTypeForm action={updateHouseTypeAction.bind(null, id)} defaultValues={houseType} />
    </div>
  );
}
