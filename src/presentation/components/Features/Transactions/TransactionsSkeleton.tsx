import { TRANSACTION_DEFAULT_PER_PAGE } from "@/core/constants";
import { Skeleton } from "@/presentation/components/Primitives";

export const TransactionsSkeleton = () => {
  return (
    <div className="@container/transactions">
      {/* Desktop View */}
      <div className="block @max-3xl/transactions:hidden">
        <table className="w-full">
          <thead>
            <tr className="border-grey-100 txt-preset-5 text-grey-500 border-b text-left [&>*]:pb-3 [&>*]:first:pl-4 [&>*]:last:pr-4">
              <th className="font-normal">
                <Skeleton className="h-4 w-32" />
              </th>
              <th className="font-normal">
                <Skeleton className="h-4 w-24" />
              </th>
              <th className="font-normal">
                <Skeleton className="h-4 w-32" />
              </th>
              <th className="font-normal">
                <Skeleton className="h-4 w-20" />
              </th>
              <th className="font-normal"></th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: TRANSACTION_DEFAULT_PER_PAGE }).map(
              (_, idx) => (
                <tr
                  key={idx}
                  className="border-grey-100 border-b last:border-b-0 [&>*]:py-3 [&>*]:first:pl-4 [&>*]:last:pr-4"
                >
                  <td>
                    <div className="flex items-center gap-4">
                      <Skeleton className="size-10 rounded-full" />
                      <Skeleton className="h-5 w-40" />
                    </div>
                  </td>
                  <td>
                    <Skeleton className="h-4 w-28" />
                  </td>
                  <td>
                    <Skeleton className="h-4 w-32" />
                  </td>
                  <td>
                    <Skeleton className="h-5 w-24" />
                  </td>
                  <td className="text-right">
                    <div className="flex justify-end">
                      <Skeleton className="size-8 rounded-lg" />
                    </div>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="hidden @max-3xl/transactions:block">
        {Array.from({ length: 10 }).map((_, idx) => (
          <div
            key={idx}
            className="border-grey-100 flex items-center gap-2 border-b py-4 first:pt-0 last:border-b-0 last:pb-0 @lg/transactions:gap-5"
          >
            <div className="flex shrink-0 items-center gap-3">
              <Skeleton className="size-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <div className="flex w-full flex-col items-end gap-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="size-8 shrink-0 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
};
