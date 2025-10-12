export const TransactionsTableHeader = () => {
  return (
    <thead>
      <tr className="text-grey-500 !font-regular border-grey-100 border-b [&>*]:py-3 [&>*]:first:pl-4 [&>*]:last:pr-4">
        <th className="!txt-preset-5 text-left font-normal">
          Recipient / Sender
        </th>
        <th className="!txt-preset-5 text-left font-normal">Category</th>
        <th className="!txt-preset-5 text-left font-normal">
          Transaction Date
        </th>
        <th className="!txt-preset-5 text-left font-normal">Amount</th>
        <th className="!txt-preset-5 text-right font-normal"></th>
      </tr>
    </thead>
  );
};
