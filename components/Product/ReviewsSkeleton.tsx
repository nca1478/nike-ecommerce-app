export function ReviewsSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Rating Summary Skeleton */}
            <div className="flex items-center gap-3">
                <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-5 h-5 bg-light-300 rounded" />
                    ))}
                </div>
                <div className="h-5 w-24 bg-light-300 rounded" />
                <div className="h-5 w-32 bg-light-300 rounded" />
            </div>

            {/* Reviews List Skeleton */}
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div
                        key={i}
                        className="border-t border-light-300 pt-4 space-y-2"
                    >
                        <div className="flex items-start justify-between">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, j) => (
                                            <div
                                                key={j}
                                                className="w-4 h-4 bg-light-300 rounded"
                                            />
                                        ))}
                                    </div>
                                    <div className="h-4 w-24 bg-light-300 rounded" />
                                </div>
                            </div>
                            <div className="h-4 w-20 bg-light-300 rounded" />
                        </div>
                        <div className="space-y-2">
                            <div className="h-4 w-full bg-light-300 rounded" />
                            <div className="h-4 w-3/4 bg-light-300 rounded" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
