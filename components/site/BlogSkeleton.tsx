export default function BlogSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 animate-pulse  max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-4 bg-white rounded-2xl border border-gray-100 flex flex-col gap-4">
                    <div className="w-full aspect-video bg-gray-200 rounded-xl" />
                    <div className="space-y-2">
                        <div className="h-3 w-1/4 bg-gray-200 rounded" />
                        <div className="h-4 w-full bg-gray-200 rounded" />
                        <div className="h-4 w-2/3 bg-gray-200 rounded" />
                    </div>
                </div>
            ))}
        </div>
    );
}