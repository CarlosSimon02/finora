type KnownAuthError = {
  code?: string;
  message?: string;
};

export const getAuthErrorCode = (err: unknown): string | undefined => {
  const e = err as KnownAuthError | undefined;
  return e?.code;
};

export const normalizeAuthError = (err: unknown): string => {
  const e = err as KnownAuthError | undefined;

  switch (e?.code) {
    case "auth/invalid-credential":
    case "auth/invalid-email":
    case "auth/wrong-password":
      return "Invalid email or password.";
    case "auth/email-already-in-use":
      return "Email is already in use.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";
    default:
      break;
  }

  if (e && typeof e === "object" && e.message) {
    return String(e.message);
  }
  try {
    return JSON.stringify(err);
  } catch {
    return "Something went wrong. Please try again.";
  }
};

export const sanitizeRedirect = (value: string | null) => {
  if (!value) return "/";
  return value.startsWith("/") ? value : "/";
};

export const isIgnorableAuthError = (err: unknown): boolean => {
  const code = getAuthErrorCode(err);
  return (
    code === "auth/popup-closed-by-user" ||
    code === "auth/cancelled-popup-request" ||
    code === "auth/popup-blocked"
  );
};
