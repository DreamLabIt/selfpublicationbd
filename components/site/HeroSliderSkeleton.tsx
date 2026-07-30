export default function HeroSliderSkeleton() {
    return (
        <div className="w-full flex justify-center py-2 pt-2 animate-pulse">
            <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="relative w-full aspect-16/7 md:aspect-16/8 lg:aspect-16/6 bg-gray-100 dark:bg-gray-400 rounded-2xl overflow-hidden shadow-soft flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2">
                        <svg
                            className="w-10 h-10 text-gray-400 animate-spin"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v8H4z"
                            ></path>
                        </svg>
                        <span className="text-sm font-medium text-gray-400">Loading slider...</span>
                    </div>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                        <div className="w-6 h-2 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                        <div className="w-2 h-2 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                        <div className="w-2 h-2 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}