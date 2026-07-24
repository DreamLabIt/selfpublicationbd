import { API_KEY, BACKEND_URL } from "@/utils/api";
import { FetchOptions } from "@/types";

// fetch fetch function
export async function fetchData<T>({
  endpoint,
  revalidate = 600,
  tags,
  headers = {},
}: FetchOptions): Promise<T> {
  const res = await fetch(`${BACKEND_URL}/api/${endpoint}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-API-key": API_KEY,
      ...headers,
    },
    credentials: "include",
    next: {
      revalidate,
      tags,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch ${endpoint}`);
  }

  return res.json();
}

export async function postData<T>(
  endpoint: string,
  body: unknown
): Promise<T> {
  const res = await fetch(`${BACKEND_URL}/api/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-API-key": API_KEY,
    },
    credentials: "include",
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "POST Failed");
  }

  const text = await res.text();
  return text ? JSON.parse(text) : ({} as T);
}

// patch Data fetch function
export async function patchData<T>(
  endpoint: string,
  body: unknown
): Promise<T> {
  const res = await fetch(`${BACKEND_URL}/api/${endpoint}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "x-API-key": API_KEY,
    },
    credentials: "include",
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error("PATCH Failed");
  }

  return res.json();
}

// put Data fetch function
export async function putData<T>(
  endpoint: string,
  body: unknown
): Promise<T> {
  const res = await fetch(`${BACKEND_URL}/api/${endpoint}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-API-key": API_KEY,
    },
    credentials: "include",
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error("PUT Failed");
  }

  return res.json();
}

// delete Data fetch function
export async function deleteData(endpoint: string) {
  const res = await fetch(`${BACKEND_URL}/api/${endpoint}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-API-key": API_KEY,
    },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Delete Failed");
  }

  return res.json();
}