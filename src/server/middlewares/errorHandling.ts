import { t as tInstance } from "@/server/init";
import { TRPCErrorMapper, TRPCLogger } from "@/server/utils";

export const createErrorHandlingMiddleware = (t: typeof tInstance) => {
  return t.middleware(async ({ next, path, type }) => {
    const startTime = Date.now();
    TRPCLogger.logProcedureStart(type, path);

    try {
      const result = await next();
      const duration = Date.now() - startTime;
      TRPCLogger.logProcedureSuccess(type, path, duration);
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      TRPCLogger.logError(error, { path, type, duration });
      throw TRPCErrorMapper.toTRPCError(error);
    }
  });
};
