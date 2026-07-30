import { getVisitorAnalyticsAction } from "@/app/actions/visitor";
import VisitorAnalytics from "@/components/admin/Visitor/VisitorAnalytics";

export const dynamic = "force-dynamic";

export default async function Visitor() {
    const res = await getVisitorAnalyticsAction();

    return (
        <div >
            <VisitorAnalytics
                initialData={res.data}
                errorMessage={!res.success ? res.message : undefined}
            />
        </div>
    );
}