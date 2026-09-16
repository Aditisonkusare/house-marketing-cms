import { createHouseTypeAction } from "@/app/admin/house-types/actions";
import { HouseTypeForm } from "@/app/admin/house-types/house-type-form";

export default function NewHouseTypePage() {
  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-gray-900 dark:text-gray-100">New House Type</h1>
      <HouseTypeForm action={createHouseTypeAction} />
    </div>
  );
}
