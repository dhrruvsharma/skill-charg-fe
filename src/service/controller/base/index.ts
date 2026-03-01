import {APIClient} from "@/src/service/core/config";
import {ClientResponse} from "@/src/schema/response/index.type";
import {responseParser} from "@/src/service/core/response-parser";
import {ZodType} from "zod";

export abstract class BaseController {
    protected apiClient: APIClient;
    protected constructor(
        private readonly backendUrl: string,
    ) {
        this.apiClient = new APIClient(backendUrl);
    }
    protected async safeJson(response: Response) {
        try {
            return await response.json();
        } catch (error) {
            return {
                success: false,
                message: "Malformed JSON from server",
                error: String(error),
            };
        }
    }
    protected async safeRequest<T>(
        reqFn: () => Promise<Response>,
        schema: ZodType<T>,
        key?: string,
    ): Promise<ClientResponse<T>> {
        try {
            const response = await reqFn();
            const json = await this.safeJson(response);
            return responseParser<T>(json, schema, key);
        } catch (error) {
            return {
                success: false,
                data: null,
                error: {
                    message: "Network or connection error",
                    error: String(error),
                    statusCode: 500,
                },
            };
        }
    }
    protected async get<T>(
        url: string,
        schema: ZodType<T>,
        key?: string,
        headers?: Record<string, string>,
    ): Promise<ClientResponse<T>> {
        return this.safeRequest(
            () => this.apiClient.get(url, headers),
            schema,
            key,
        );
    }
    protected async post<T>(
        url: string,
        body: unknown,
        schema: ZodType<T>,
        key?: string,
        headers?: Record<string, string>,
    ): Promise<ClientResponse<T>> {
        return this.safeRequest(
            () => this.apiClient.post(url, body, headers),
            schema,
            key,
        );
    }
    protected async put<T>(
        url: string,
        body: unknown,
        schema: ZodType<T>,
        key?: string,
        headers?: Record<string, string>,
    ): Promise<ClientResponse<T>> {
        return this.safeRequest(
            () => this.apiClient.put(url, body, headers),
            schema,
            key,
        );
    }
    protected async patch<T>(
        url: string,
        body: unknown,
        schema: ZodType<T>,
        key?: string,
        headers?: Record<string, string>,
    ): Promise<ClientResponse<T>> {
        return this.safeRequest(
            () => this.apiClient.patch(url, body, headers),
            schema,
            key,
        );
    }
    protected async delete<T>(
        url: string,
        schema: ZodType<T>,
        key?: string,
        headers?: Record<string, string>,
    ): Promise<ClientResponse<T>> {
        return this.safeRequest(
            () => this.apiClient.delete(url, headers),
            schema,
            key,
        );
    }
}
