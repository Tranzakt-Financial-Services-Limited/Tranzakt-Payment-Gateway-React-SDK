import { BASE_URL } from "../config";
import { ApiError } from "../types";

type IRequestParam<T = any> = {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  data?: T;
  headers?: Record<string, string>;
};

export async function requestProcessor<T>({
  url,
  method,
  data,
  headers,
}: IRequestParam): Promise<T> {
  const config: RequestInit = {
    method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(data),
  };
  try {
    const response = await fetch(`${BASE_URL}${url}`, config);

    if (!response.ok) {
      const errorResponse = (await response.json().catch(() => ({
        status: response.status,
        message: response.statusText,
        type: "UnknownError",
        errors: [response.statusText],
      }))) as ApiError;

      return Promise.reject(errorResponse);
    }

    const responseData = (await response.json()) as T;
    return responseData;
  } catch (error: any) {
    console.log("here", error);

    // Handle network errors or unexpected issues
    return Promise.reject({
      status: 500,
      message: error?.message ?? "NetworkError",
      type: "NetworkError",
      errors: [error instanceof Error ? error.message : "Unknown error"],
    } as ApiError);
  }
}
