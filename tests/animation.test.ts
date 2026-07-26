import { test, expect } from "@playwright/test";
import path from "path";

const baseUrl = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";

test("loads and analyzes a valid Lottie JSON file", async ({ page }) => {
  await page.goto(baseUrl);
  const filePath = path.join(__dirname, "/sample.json");
  await page.locator('input[type="file"]').setInputFiles(filePath);

  await page.waitForFunction(
    () => {
      const sizeText = document.querySelector(".animation-size")?.textContent;
      return sizeText && !sizeText.includes("0 x 0");
    },
    { timeout: 10000 }
  );

  await expect(page.locator(".animation-size")).toContainText("1000 x 1000");
  await expect(
    page.getByRole("heading", { name: "Performance Score" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Platform Compatibility" }),
  ).toBeVisible();
});
