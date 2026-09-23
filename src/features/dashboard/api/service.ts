import { buildDashboard } from "@/mocks/handlers/dashboard";
import { mockResponse } from "@/mocks/mock-response";

// Real endpoint: GET /client-portal/dashboard (docs/api-needed.md).
export const getDashboard = async () => mockResponse(buildDashboard);
