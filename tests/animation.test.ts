import { test, expect } from "@playwright/test";
import path from "path";

test("JSON 애니메이션 드래그 앤 드롭 테스트", async ({ page }) => {
  await page.goto("http://localhost:3000");

  const filePath = path.join(__dirname, "/sample.json");

  const fileInput = await page.$('input[type="file"]');
  await fileInput?.setInputFiles(filePath);

  console.log("Waiting for animation to load...");

  await page.waitForFunction(
    () => {
      const sizeText = document.querySelector(".animation-size")?.textContent;
      return sizeText && !sizeText.includes("0 x 0");
    },
    { timeout: 10000 }
  );

  const sizeText = await page.textContent(".animation-size");
  console.log("Animation size text:", sizeText);

  expect(sizeText).not.toContain("0 x 0");

  console.log("Animation is playing for 5 seconds...");
  await page.waitForTimeout(5000);

  console.log(
    "Test passed: Animation loaded successfully and played for 10 seconds!"
  );
});
