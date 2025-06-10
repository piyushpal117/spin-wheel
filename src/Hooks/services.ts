// src/api.ts

export type Sections = {
  label: string;
  color: string;
};

const RESULT_URL = "http://3.89.172.85:8004/api/v1/spin-wheel-configuration/generate-index";

export interface RawWheelItem {
  sc: number;      // score
  gc: number;      // game coins
  priority: number;
}

export interface WheelAPIResponse {
  data: {
    wheelConfiguration: RawWheelItem[];
  };
  errors: any[];
}

// FIXED FUNCTION
export async function fetchWheelConfig(): Promise<WheelAPIResponse | null> {
  try {
    const res = await fetch("http://3.89.172.85:8004/api/v1/spin-wheel-configuration/get-list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: 5 }),
    });
    const json = await res.json();
    return json as WheelAPIResponse;
  } catch (error) {
    console.error("Error fetching wheel config:", error);
    return null;
  }
}


// Fetch result index from server
export async function fetchResultIndex(): Promise<number | null> {
  try {
    const res = await fetch(RESULT_URL);
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error("Error fetching result index:", error);
    return null;
  }
}
