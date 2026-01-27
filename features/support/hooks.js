const { setDefaultTimeout, After } = require("@cucumber/cucumber");
const fs = require("fs");
const path = require("path");

setDefaultTimeout(3600000);

After(async function (scenario) {
  if (scenario.result.status !== "FAILED" || !this.page) return;

  const dir = "reports/screenshots";
  try {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  } catch (e) {
    console.warn("Could not create screenshots dir:", e.message);
    return;
  }

  const fileName = scenario.pickle.name.replace(/[^a-zA-Z0-9_-]/g, "_") + ".png";
  const filePath = path.join(dir, fileName);

  try {
    const screenshot = await this.page.screenshot({ fullPage: true });
    fs.writeFileSync(filePath, screenshot);
    console.log(`Saved failure screenshot: ${filePath}`);
    if (this.attach) await this.attach(screenshot, "image/png");
  } catch (e) {
    console.warn("Could not save failure screenshot:", e.message);
  }
});
