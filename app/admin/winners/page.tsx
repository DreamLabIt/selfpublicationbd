import { getAllWinnersAdminAction } from "@/app/actions/winner";
import WinnersClient from "./WinnersClient";

export const metadata = {
    title: "Admin - Winners Management",
    description: "Manage winners data",
};
export const dynamic = "force-dynamic";

export default async function AdminWinnersPage() {
    const response = await getAllWinnersAdminAction();
    const initialWinners = response.success ? response.data : [];

    return (
        <div className="p-4 sm:p-6">
            <WinnersClient initialWinners={initialWinners} />
        </div>
    );
}