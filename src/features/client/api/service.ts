import { mockResponse } from "@/mocks/mock-response";
import { db } from "@/mocks/store";

// Real endpoint: GET /client-portal/me (docs/api-needed.md).
export const getMe = async () => mockResponse(() => db.client);
