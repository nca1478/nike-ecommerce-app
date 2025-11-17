export function RecommendedSkeleton() {
    return (
        <div className="bg-light-200 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="h-8 w-48 bg-light-300 rounded mb-6 animate-pulse" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className="bg-light-100 rounded-lg overflow-hidden animate-pulse"
                        >
                            <div className="w-full aspect-square bg-light-300" />
                            <div className="p-4 space-y-3">
                                <div className="h-6 w-3/4 bg-light-300 rounded" />
                                <div className="h-4 w-1/2 bg-light-300 rounded" />
                                <div className="h-6 w-1/4 bg-light-300 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
