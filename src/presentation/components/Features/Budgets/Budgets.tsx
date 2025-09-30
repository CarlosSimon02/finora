import { FrontViewLayout } from "@/presentation/components/Layouts";
import { CreateBudgetDialog } from "./CreateBudgetDialog";

export const Budgets = () => {
  return (
    <FrontViewLayout title="Budgets" actions={<CreateBudgetDialog />}>
      Budgets content
    </FrontViewLayout>
  );
};
