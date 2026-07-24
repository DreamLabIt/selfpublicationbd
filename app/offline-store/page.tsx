import { API_KEY, BACKEND_URL } from "@/utils/api";
import OfflineStoreClient from "./OfflineStoreClient";
import { LibraryStore } from "@/types";

const bangladeshData: Record<string, string[]> = {
    Dhaka: ["Dhaka", "Gazipur", "Narayanganj", "Narsingdi", "Tangail", "Kishoreganj", "Manikganj", "Munshiganj", "Faridpur", "Gopalganj", "Madaripur", "Rajbari", "Shariatpur"],
    Chattogram: ["Chattogram", "Cox's Bazar", "Comilla", "Feni", "Noakhali", "Rangamati", "Khagrachari", "Bandarban", "Brahmanbaria", "Chandpur", "Lakshmipur"],
    Rajshahi: ["Rajshahi", "Bogura", "Chapainawabganj", "Naogaon", "Natore", "Pabna", "Joypurhat", "Sirajganj"],
    Khulna: ["Khulna", "Jashore", "Satkhira", "Bagerhat", "Jhenaidah", "Magura", "Narail", "Kushtia", "Chuadanga", "Meherpur"],
    Barishal: ["Barishal", "Patuakhali", "Bhola", "Pirojpur", "Jhalokati", "Barguna"],
    Sylhet: ["Sylhet", "Moulvibazar", "Habiganj", "Sunamganj"],
    Rangpur: ["Rangpur", "Dinajpur", "Thakurgaon", "Panchagarh", "Kurigram", "Gaibandha", "Nilphamari", "Lalmonirhat"],
    Mymensingh: ["Mymensingh", "Jamalpur", "Netrokona", "Sherpur"],
};

export default async function OfflineStorePage() {
    let initialLibraries: LibraryStore[] = [];

    if (!BACKEND_URL) {
        console.error("BACKEND_URL is missing in environment variables!");
        return <OfflineStoreClient initialLibraries={[]} bangladeshData={bangladeshData} />;
    }

    try {
        const url = `${BACKEND_URL}/api/libraries?apiKey=${API_KEY || ""}`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": API_KEY || "",
            },
            next: { revalidate: 3600 }
        });

        const contentType = response.headers.get("content-type");

        if (response.ok && contentType && contentType.includes("application/json")) {
            const resData = await response.json();
            initialLibraries = resData.data || resData || [];
        } else {
            console.log(`API response error: Status ${response.status}, Not a valid JSON response.`);
        }
    } catch (error) {
        console.error("Server-side fetch error caught safely:", error);
    }

    return (
        <OfflineStoreClient
            initialLibraries={initialLibraries}
            bangladeshData={bangladeshData}
        />
    );
}