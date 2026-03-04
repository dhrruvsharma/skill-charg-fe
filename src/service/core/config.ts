import { getCookieAction, setCookieAction, deleteCookieAction } from "@/src/actions/auth";

type RequestOptions = RequestInit & {
    _retry?: boolean;
    skipAuth?: boolean;
};

let isRefreshing = false;
let queue: Array<{
    resolve: (token: string) => void;
    reject: (err: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null) => {
    queue.forEach((p) => (token ? p.resolve(token) : p.reject(error)));
    queue = [];
};

const refreshAccessToken = async (): Promise<string> => {
    const refreshToken = await getCookieAction("refresh_token");
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/refresh`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${refreshToken}`,
            },
        }
    );

    if (!res.ok) throw new Error("Refresh failed");

    const json = await res.json();
    const newToken: string = json.data.access_token;
    await setCookieAction("access_token", newToken, 60 * 60 * 2);
    return newToken;
};

/**
 * A client for making API requests.
 * Automatically injects the access token into every request and handles
 * transparent token refresh on 401 responses.
 * Pass skipAuth = true for public routes (login, signup, etc.) to bypass
 * token injection and refresh logic entirely.
 */
export class APIClient {
    constructor(private readonly baseUrl: string) {}

    async request(url: string, options: RequestOptions): Promise<Response> {
        if (!options.skipAuth) {
            const token = await getCookieAction("access_token");
            if (token) {
                options.headers = {
                    ...options.headers,
                    Authorization: `Bearer ${token}`,
                };
            }
        }

        const response = await fetch(`${this.baseUrl}${url}`, options);

        // Public routes — skip refresh logic entirely
        if (options.skipAuth) return response;

        // Not a 401 or already retried — return as-is
        if (response.status !== 401 || options._retry) return response;

        // Another refresh is already in flight — queue this request
        if (isRefreshing) {
            return new Promise<Response>((resolve, reject) => {
                queue.push({
                    resolve: async (newToken) => {
                        options.headers = {
                            ...options.headers,
                            Authorization: `Bearer ${newToken}`,
                        };
                        options._retry = true;
                        resolve(await fetch(`${this.baseUrl}${url}`, options));
                    },
                    reject,
                });
            });
        }

        // This request leads the refresh
        isRefreshing = true;
        options._retry = true;

        try {
            const newToken = await refreshAccessToken();
            processQueue(null, newToken);
            options.headers = {
                ...options.headers,
                Authorization: `Bearer ${newToken}`,
            };
            return await fetch(`${this.baseUrl}${url}`, options);
        } catch (err) {
            processQueue(err, null);
            return response; // return original 401 so callers don't hang
        } finally {
            isRefreshing = false;
        }
    }

    /**
     * Sends a GET request.
     * @param url - Relative URL
     * @param headers - Optional extra headers
     * @param skipAuth - Set true for public routes that don't need a token
     */
    get(
        url: string,
        headers?: Record<string, string>,
        skipAuth = false
    ): Promise<Response> {
        return this.request(url, {
            method: "GET",
            headers: { "Content-Type": "application/json", ...headers },
            skipAuth,
        });
    }

    /**
     * Sends a POST request.
     * @param url - Relative URL
     * @param data - Request body
     * @param headers - Optional extra headers
     * @param skipAuth - Set true for public routes that don't need a token
     */
    post(
        url: string,
        data: unknown,
        headers?: Record<string, string>,
        skipAuth = false
    ): Promise<Response> {
        return this.request(url, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...headers },
            body: JSON.stringify(data),
            skipAuth,
        });
    }

    /**
     * Sends a PUT request.
     * @param url - Relative URL
     * @param data - Request body
     * @param headers - Optional extra headers
     * @param skipAuth - Set true for public routes that don't need a token
     */
    put(
        url: string,
        data: unknown,
        headers?: Record<string, string>,
        skipAuth = false
    ): Promise<Response> {
        return this.request(url, {
            method: "PUT",
            headers: { "Content-Type": "application/json", ...headers },
            body: JSON.stringify(data),
            skipAuth,
        });
    }

    /**
     * Sends a PATCH request.
     * @param url - Relative URL
     * @param data - Request body
     * @param headers - Optional extra headers
     * @param skipAuth - Set true for public routes that don't need a token
     */
    patch(
        url: string,
        data: unknown,
        headers?: Record<string, string>,
        skipAuth = false
    ): Promise<Response> {
        return this.request(url, {
            method: "PATCH",
            headers: { "Content-Type": "application/json", ...headers },
            body: JSON.stringify(data),
            skipAuth,
        });
    }

    /**
     * Sends a DELETE request.
     * @param url - Relative URL
     * @param headers - Optional extra headers
     * @param skipAuth - Set true for public routes that don't need a token
     */
    delete(
        url: string,
        headers?: Record<string, string>,
        skipAuth = false
    ): Promise<Response> {
        return this.request(url, {
            method: "DELETE",
            headers: { "Content-Type": "application/json", ...headers },
            skipAuth,
        });
    }

    /**
     * Uploads a file or multiple files using multipart/form-data.
     * @param url - Relative URL
     * @param formData - FormData object containing files and fields
     * @param headers - Optional extra headers
     * @param skipAuth - Set true for public routes that don't need a token
     */
    upload(
        url: string,
        formData: FormData,
        headers?: Record<string, string>,
        skipAuth = false
    ): Promise<Response> {
        return this.request(url, {
            method: "POST",
            headers: { ...headers },
            body: formData,
            skipAuth,
        });
    }
}