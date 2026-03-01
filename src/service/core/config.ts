/**
 * A client for making API requests.
 */
export class APIClient {
    /**
     * Creates a new APIClient instance.
     *
     * @param baseUrl - The base URL for all API requests
     */
    constructor(private readonly baseUrl: string) {}

    /**
     * Sends a request to the specified URL with the provided options.
     *
     * @param url - The URL to send the request to
     * @param options - The request options
     * @returns A Promise that resolves to the response
     */
    async request(url: string, options: RequestInit): Promise<Response> {
        return await fetch(`${this.baseUrl}${url}`, options);
    }

    /**
     * Sends a GET request to the specified URL and returns a Promise that resolves to the response data.
     *
     * @param url - The URL to send the GET request to
     * @param headers - Optional headers to include in the request
     * @returns A Promise that resolves to the response
     */
    get(url: string, headers?: Record<string, string>): Promise<Response> {
        return this.request(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...headers,
            },
            // credentials: "include",
        });
    }

    /**
     * Sends a POST request to the specified URL with the provided data.
     *
     * @param url - The URL to send the request to
     * @param data - The data to send in the request body
     * @param headers - Optional headers to include in the request
     * @returns A Promise that resolves to the response
     */
    post(
        url: string,
        data: unknown,
        headers?: Record<string, string>
    ): Promise<Response> {
        return this.request(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...headers,
            },
            body: JSON.stringify(data),
            // credentials: "include",
        });
    }

    /**
     * Uploads a file or multiple files using multipart/form-data.
     *
     * @param url - The URL to send the request to
     * @param formData - The FormData object containing files and other form fields
     * @param headers - Optional headers to include in the request
     * @returns A Promise that resolves to the response
     */
    upload(url: string, formData: FormData, headers?: Record<string, string>): Promise<Response> {
        return this.request(url, {
            method: "POST",
            headers: {
                ...headers,
            },
            body: formData,
            // credentials: "include",
        })
    }

    /**
     * Sends a PUT request to the specified URL with the provided data.
     *
     * @param url - The URL to send the request to
     * @param data - The data to be sent in the request body
     * @param headers - Optional headers to include in the request
     * @returns A Promise that resolves to the response
     */
    put(
        url: string,
        data: unknown,
        headers?: Record<string, string>
    ): Promise<Response> {
        return this.request(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                ...headers,
            },
            body: JSON.stringify(data),
            // credentials: "include",
        });
    }

    /**
     * Sends a DELETE request to the specified URL and returns a Promise that resolves to the response data.
     *
     * @param url - The URL to send the DELETE request to
     * @param headers - Optional headers to include in the request
     * @returns A Promise that resolves to the response
     */
    delete(url: string, headers?: Record<string, string>): Promise<Response> {
        return this.request(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                ...headers,
            },
            // credentials: "include",
        });
    }
    patch(url: string, data: unknown, headers?: Record<string, string>): Promise<Response> {
        return this.request(url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                ...headers,
            },
            body: JSON.stringify(data),
        })
    }
}