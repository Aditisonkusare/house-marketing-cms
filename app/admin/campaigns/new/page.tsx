import { createCampaignAction, listPublishedNewsPostsForDropdown } from "@/app/admin/campaigns/actions";
import { CampaignForm } from "@/app/admin/campaigns/campaign-form";

export default async function NewCampaignPage() {
  const newsPosts = await listPublishedNewsPostsForDropdown();

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-gray-900">New Campaign</h1>
      <CampaignForm action={createCampaignAction} newsPosts={newsPosts} />
    </div>
  );
}
