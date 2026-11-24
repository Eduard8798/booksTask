interface BooksSkeletonProps {
    count?: number;
}

export default function BooksSkeleton({
                                          count = 8,
                                      }: BooksSkeletonProps) {
    return (
        <div
            role="status"
            className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6"
        >
      <span className="sr-only">
        Завантаження книг...
      </span>

            {Array.from({ length: count }, (_, index) => (
                <div
                    key={index}
                    aria-hidden="true"
                    className="animate-pulse overflow-hidden rounded-2xl border border-gray-200 bg-white"
                >
                    <div className="aspect-[3/4] bg-gray-200" />

                    <div className="space-y-3 p-4">
                        <div className="h-4 w-4/5 rounded bg-gray-200" />

                        <div className="h-3 w-3/5 rounded bg-gray-100" />

                        <div className="mt-6 h-3 w-1/2 rounded bg-gray-100" />

                        <div className="h-8 rounded bg-gray-100" />
                    </div>
                </div>
            ))}
        </div>
    );
}