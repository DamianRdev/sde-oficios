// Skeleton de carga para las cards de oficio
const SkeletonCard = () => (
    <div className="animate-pulse rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex gap-3">
            {/* Avatar skeleton */}
            <div className="h-16 w-16 shrink-0 rounded-xl bg-gray-200" />
            <div className="flex-1 space-y-2">
                <div className="h-4 w-2/3 rounded bg-gray-200" />
                <div className="h-3 w-1/3 rounded bg-gray-200" />
                <div className="h-3 w-1/2 rounded bg-gray-200" />
            </div>
        </div>
        <div className="mt-4 h-11 w-full rounded-lg bg-gray-200" />
    </div>
);

export default SkeletonCard;
