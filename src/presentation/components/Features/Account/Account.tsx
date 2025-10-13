import { getAuthTokens, tokensToUser } from "@/lib/auth/authTokens";
import { FrontViewLayout } from "@/presentation/components/Layouts";
import { AccountActions } from "./AccountActions";
import { AccountProfile } from "./AccountProfile";

export const Account = async () => {
  const tokens = await getAuthTokens();
  const user = tokens ? tokensToUser(tokens.decodedToken) : null;

  const isGuest = user?.customClaims?.role === "guest";

  return (
    <FrontViewLayout title="Account">
      <div className="space-y-6">
        <AccountProfile user={user} isGuest={isGuest} />
        <AccountActions isGuest={isGuest} />
      </div>
    </FrontViewLayout>
  );
};
