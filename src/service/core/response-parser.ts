import { ClientResponse,ResponseError } from "@/src/schema/response/index.type";
import {ZodType} from "zod";
import {BackendErrorResponseSchema} from "@/src/schema/response";

export async function parseResponse<T>(
    response: Response
): Promise<ClientResponse<T>> {
    if (!response.ok) {
        const error = (await response.json()) as ResponseError;
        return {
            success: false,
            data: null,
            error,
        } as unknown as ClientResponse<T>;
    }

    let data: T | null = null;

    try {
        data = await response.json();
    } catch (error) {}

    return {
        success: true,
        data,
        error: null,
    } as unknown as ClientResponse<T>;
}

const responseParser = <T>(
    rawData: unknown,
    schema: ZodType<T>,
    key?: string
): ClientResponse<T> => {
    const errorCheck = BackendErrorResponseSchema.safeParse(rawData);
    if (errorCheck.success && !errorCheck.data.success) {
        return {
            success: false,
            data: null,
            error: {
                message: errorCheck.data.message,
                error: errorCheck.data.message,
                statusCode: 500,
            },
        };
    }

    const payload =
        key && key.length > 0
            ? (rawData as Record<string, unknown>)?.[key]
            : rawData;
    const parsed = schema.safeParse(payload);
    if (parsed.success) {
        return {
            success: true,
            data: parsed.data,
            error: null,
        };
    }
    return {
        success: false,
        data: null,
        error: {
            message: "Failed to parse data",
            error: "Failed to parse data",
            statusCode: 500,
        },
    };
};
export { responseParser };