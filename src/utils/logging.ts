export const debugLog = (context: string, message: string, data?: unknown) => {
  // Always log in development and when NODE_ENV is not production
  if (process.env.NODE_ENV !== "production") {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${context}]: ${message}`;

    if (data) {
      // Pretty print errors with full stack traces
      if (data instanceof Error) {
        console.error(logMessage);
        console.error("Error Name:", data.name);
        console.error("Error Message:", data.message);
        console.error("Stack Trace:", data.stack);
        if ("cause" in data && data.cause) {
          console.error("Cause:", data.cause);
        }
      } else {
        console.log(logMessage, data);
      }
    } else {
      console.log(logMessage);
    }
  }
};
