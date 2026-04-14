import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "src/data/registrations.json");

export function saveRegistration(data: any) {
  try {
    let existing = [];

    if (fs.existsSync(filePath)) {
      const file = fs.readFileSync(filePath, "utf-8");
      existing = JSON.parse(file || "[]");
    }

    existing.push(data);

    fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));
  } catch (err) {
    console.log("❌ DB ERROR:", err);
  }
}

export function getRegistrationByRef(ref: string) {
  if (!fs.existsSync(filePath)) return null;

  const file = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(file || "[]");

  return data.find((item: any) => item.reference === ref);
}

export function updateRegistrationStatus(ref: string, status: string) {
  if (!fs.existsSync(filePath)) return;

  const file = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(file || "[]");

  const updated = data.map((item: any) =>
    item.reference === ref ? { ...item, status } : item
  );

  fs.writeFileSync(filePath, JSON.stringify(updated, null, 2));
}