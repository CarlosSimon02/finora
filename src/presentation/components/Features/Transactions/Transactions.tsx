import { FrontViewLayout } from "@/presentation/components/Layouts";
import { CreateTransactionDialog } from "./CreateTransaction";

export const Transactions = () => {
  return (
    <FrontViewLayout title="Transactions" actions={<CreateTransactionDialog />}>
      Transactions content
    </FrontViewLayout>
  );
};
