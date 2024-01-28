const devEndpoint = "http://localhost:8000/";
const prodEndpoint = "https://csci-1951v-assignment-4.onrender.com/";

const isProduction = process.env.NODE_ENV === "production";
export const endpoint = isProduction ? prodEndpoint : devEndpoint;
