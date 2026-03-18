import { connectDB } from "@/lib/mongodb";
import { ApiError } from "next/dist/server/api-utils";
import { z, ZodError } from "zod";

type Handler<TQuery, TBody, TParams> = (ctx: {
  query: TQuery;
  body: TBody;
  params: TParams;
  req: Request;
}) => Promise<Response>;

export function withWrapper<
  TQuerySchema extends z.ZodTypeAny | undefined,
  TBodySchema extends z.ZodTypeAny | undefined,
  TParamsSchema extends z.ZodTypeAny | undefined,
>(
  options: {
    querySchema?: TQuerySchema;
    bodySchema?: TBodySchema;
    paramsSchema?: TParamsSchema;
  },
  handler: Handler<
    TQuerySchema extends z.ZodTypeAny ? z.infer<TQuerySchema> : undefined,
    TBodySchema extends z.ZodTypeAny ? z.infer<TBodySchema> : undefined,
    TParamsSchema extends z.ZodTypeAny ? z.infer<TParamsSchema> : undefined
  >,
) {
  return async function (
    req: Request,
    ctx?: { params?: unknown }, // 👈 Next.js params
  ) {
    try {
      let query = undefined as TQuerySchema extends z.ZodTypeAny
        ? z.infer<TQuerySchema>
        : undefined;

      let body = undefined as TBodySchema extends z.ZodTypeAny
        ? z.infer<TBodySchema>
        : undefined;

      let params = undefined as TParamsSchema extends z.ZodTypeAny
        ? z.infer<TParamsSchema>
        : undefined;

      // 🔹 Query
      if (options.querySchema) {
        const rawQuery = Object.fromEntries(
          new URL(req.url).searchParams.entries(),
        );

        query = options.querySchema.parse(
          rawQuery,
        ) as TQuerySchema extends z.ZodTypeAny
          ? z.infer<TQuerySchema>
          : undefined;
      }

      // 🔹 Body
      if (options.bodySchema) {
        const rawBody = await req.json();
        body = options.bodySchema.parse(
          rawBody,
        ) as TBodySchema extends z.ZodTypeAny
          ? z.infer<TBodySchema>
          : undefined;
      }

      // 🔹 Params
      if (options.paramsSchema) {
        const awaitedParams = await ctx?.params;

        console.log(awaitedParams);

        if (awaitedParams) {
          params = options.paramsSchema.parse(
            awaitedParams,
          ) as TParamsSchema extends z.ZodTypeAny
            ? z.infer<TParamsSchema>
            : undefined;
        }
      }

      await connectDB();

      return await handler({
        query,
        body,
        params,
        req,
      });
    } catch (error: unknown) {
      console.error(error);

      if (error instanceof ApiError) {
        return Response.json(
          {
            success: false,
            error: error.message,
          },
          { status: error.statusCode },
        );
      }

      if (error instanceof ZodError) {
        return Response.json(
          {
            success: false,
            error: error.issues,
          },
          { status: 400 },
        );
      }

      return Response.json(
        {
          success: false,
          error:
            error instanceof Error ? error.message : "Internal server error",
        },
        { status: 500 },
      );
    }
  };
}
