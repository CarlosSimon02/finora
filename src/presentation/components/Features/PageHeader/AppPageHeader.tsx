import { PageHeader } from "./PageHeader";

type AppPageHeaderProps = {
  title: string;
  actions?: React.ReactNode;
};

export function AppPageHeader({ title, actions }: AppPageHeaderProps) {
  // const tokens = await getAuthTokens();

  // if (!tokens) {
  //   redirect("login");
  // }

  // const user = tokensToUser(tokens.decodedToken);

  return <PageHeader title={title} actions={actions} />;
}
