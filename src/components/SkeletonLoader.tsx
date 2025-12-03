

export const SkeletonLoader = () => (
    <div className="w-full h-full flex flex-col p-8 space-y-4 animate-pulse">
        <div className="h-8 bg-surface w-1/3 rounded"></div>
        <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-surface rounded w-full"></div>
            ))}
        </div>
    </div>
);
