export type MockScenario = "default" | "empty" | "error";

const SCENARIOS: MockScenario[] = ["default", "empty", "error"];

const requested = import.meta.env.VITE_MOCK_SCENARIO as string | undefined;

/**
 * Which fixture set the mocked services serve:
 * - `default` — a client with history: overdue, part-paid and refunded
 *   invoices, a cancelled booking, a package in progress.
 * - `empty` — a client who has just been added and has nothing yet.
 * - `error` — every request fails, to exercise the retry states.
 */
export const mockScenario: MockScenario = SCENARIOS.includes(
  requested as MockScenario,
)
  ? (requested as MockScenario)
  : "default";

export const demoSignInEnabled =
  import.meta.env.VITE_ENABLE_DEMO_SIGN_IN !== "false";

export const DEMO_ACCESS_TOKEN = "demo-access-token";
