import { env } from "@/utils/env";
import axios from "axios";

export class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const BASE_URL = "https://api.tmdb.org/3";

export async function apiGet<T>(
  path: string,
  params: Record<string, string | number> = {},
  signal?: AbortSignal,
): Promise<T> {
  try {
    const response = await axios.get<T>(BASE_URL + path, {
      params: {
        api_key: env.tmdbKey,
        ...params,
      },
      signal,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new ApiError(
        `Request failed: ${error.response?.statusText ?? error.message}`,
        error.response?.status,
      );
    }
    throw error;
  }
}
