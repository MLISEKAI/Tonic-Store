import { prisma } from "./prisma";

describe("Prisma instance", () => {
  it("should be defined", () => {
    expect(prisma).toBeDefined();
  });
});
