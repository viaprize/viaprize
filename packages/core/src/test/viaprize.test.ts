import { nanoid } from "nanoid";
import { assert, describe, expect, test } from "vitest";
import { Viaprize } from "../viaprize";

test("viaprize init test", () => {
  const viaprize = new Viaprize({
    config: {
      mode: "development",
      inMemoryDb: false,
      databaseUrl:
        "postgresql://viaprize-dev_owner:somepassword@localhost:5432/viaprize?sslmode=require",
    },
  });
  expect(viaprize.config.mode).toBe("development");
  expect(viaprize.config.databaseUrl).toBe(
    "postgresql://viaprize-dev_owner:somepassword@localhost:5432/viaprize?sslmode=require"
  );
});

test("viaprize  init fail test", () => {
  assert.throws(
    () =>
      new Viaprize({
        config: {
          mode: "development",
          inMemoryDb: false,
          databaseUrl: "",
        },
      }),
    Error
  );
});

describe("viaprize donation tests", async () => {
  const viaprize = new Viaprize({
    config: {
      databaseUrl: process.env.DATABASE_URL ?? "",
      inMemoryDb: false,
      mode: "development",
    },
  });

  describe("add donation success and check if donation can fetch ", async () => {
    const length = await viaprize.donations.count();
    const txId = nanoid(10);

    test("add donation", async () => {
      await viaprize.donations.addDonation({
        donor: "donor",
        recipientAddress: "recipientAddress",
        token: "USDC",
        recipientType: "PRIZE",
        transactionId: txId,
      });

      const newLength = await viaprize.donations.count();
      expect(newLength).toBeGreaterThan(length);
    });

    test("get donation by transaction id", async () => {
      const donation =
        await viaprize.donations.getDonationByTransactionId(txId);
      expect(donation).toBeTruthy();
    });
  });
  test("get prize donations from table", async () => {
    const donations = await viaprize.donations.getDonationsByPrize();
    expect(donations).toBeTruthy();
  });
});
