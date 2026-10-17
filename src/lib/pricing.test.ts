import { describe, expect, it } from "vitest";
import { computeTotals, lineTotal } from "./pricing";

describe("pricing", () => {
  it("adds selected extras to the service price", () => {
    expect(lineTotal({ serviceId: "revisao-oleo", addons: ["polen", "injecao"], qty: 1 })).toBe(188);
  });
  it("PROAUTO24 gives 10% off services", () => {
    expect(computeTotals([{ serviceId: "revisao-oleo", addons: [], qty: 1 }], "PROAUTO24").discount).toBe(12.9);
  });
  it("pickup adds 15 € and eco fee 4.50 €", () => {
    expect(computeTotals([{ serviceId: "diagnostico-obd", addons: [], qty: 1 }], null, 15).total).toBe(64.5);
  });
});
