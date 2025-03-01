import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export async function http<T>(request: AxiosRequestConfig): Promise<T> {
  const response: AxiosResponse<T> = await axios(request);
  return response.data;
}

/** The HTTP GET method requests a representation of the specified resource. */
export async function get<T>(url: string): Promise<T> {
  return await http<T>({
    method: "GET",
    url: url,
  });
}

/** Send data in the body of the HTTP Request */
export async function post<T>(url: string, body: any): Promise<T> {
  return await http<T>({
    data: body,
    headers: { "Content-Type": "application/json" },
    method: "POST",
    url: url,
  });
}

/**
 * The HTTP PUT request method creates a new resource or replaces
 * a representation of the target resource with the request payload.
 */
export async function put<T>(url: string, body: any): Promise<T> {
  return await http<T>({
    data: body,
    headers: { "Content-Type": "application/json" },
    method: "PUT",
    url: url,
  });
}

/** The HTTP DELETE request method deletes the specified resource. */
export async function remove<T>(url: string): Promise<T> {
  return await http<T>({
    method: "DELETE",
    url: url,
  });
}

/** Severless method to perform speech recognition*/
export async function transcribe(audioUrl: string) {
  try {
    const response = await fetch("/api/transcription", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        audioUrl: audioUrl,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      return result;
    } else {
      const error = await response.json();
      return error;
    }
  } catch (error) {
    console.error("Error during post request => ", error);
    // Handle the error
  }
}
