import { NextRequest, NextResponse } from "next/server";
import { getRegistrationByRef, updateRegistrationStatus } from "@/lib/db";
import { sendTelegramMessage } from "@/lib/telegram";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

// ✅ FIXED TYPE
interface RegistrationData {
  fullName: string;
  fatherName: string;
  dob: string;
  studentMobile: string;
  parentMobile: string;
  email: string;
  qualification: string;
  city: string;
  skillInterest: string;
  hasLaptop: string;
  experience: string;
  whyJoin: string;
  photo: string; // ✅ FIX (File nahi, string URL)
  course?: string;
  amount?: number;
}

// ✅ MAIN API
export async function GET(req: NextRequest) {
  const ref = req.nextUrl.searchParams.get("ref");

  if (!ref) {
    return NextResponse.json({ success: false, message: "No ref" });
  }

  const data = getRegistrationByRef(ref) as RegistrationData;

  if (!data) {
    return NextResponse.json({ success: false, message: "Not found" });
  }

  // ✅ Update status
  updateRegistrationStatus(ref, "approved");

  // 📄 Generate PDF
  const pdfPath = await generateReceiptPDF(data, ref);

  // 📧 Send Email
  await sendEmail(pdfPath, ref);

  // 📱 Telegram
  const message = `
🎉 Registration Confirmed!

🆔 ID: ${ref}
👤 Name: ${data.fullName}
📚 Course: ${data.course || "-"}
💰 Amount: Rs. ${data.amount || "-"}

✅ Approved!
`;

  await sendTelegramMessage(message);

  console.log("✅ APPROVED + DONE:", ref);

  return NextResponse.redirect(
  `http://localhost:3000/success?ref=${ref}`
);
}

// ✅ PDF FUNCTION
async function generateReceiptPDF(
  data: RegistrationData,
  reference: string
): Promise<string> {
  const dir = path.join(process.cwd(), "data");

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const filePath = path.join(dir, `ADMIN-${reference}.pdf`);

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const { height } = page.getSize();

  // TITLE
  page.drawText("SLP REGISTRATION RECEIPT", {
    x: 150,
    y: height - 50,
    size: 18,
    font,
    color: rgb(0, 0, 0),
  });

  // ✅ PHOTO FIX
  if (data.photo) {
    try {
      const imagePath = path.join(process.cwd(), "public", data.photo);
      const imageBytes = fs.readFileSync(imagePath);

      let image;

      if (data.photo.endsWith(".png")) {
        image = await pdfDoc.embedPng(imageBytes);
      } else {
        image = await pdfDoc.embedJpg(imageBytes);
      }

      page.drawImage(image, {
        x: 400,
        y: height - 180,
        width: 120,
        height: 120,
      });
    } catch (err) {
      console.log("❌ Image load error:", err);
    }
  }

  // TEXT
  let y = height - 100;

  const drawLine = (label: string, value?: string | number) => {
    page.drawText(`${label}: ${value || "-"}`, {
      x: 50,
      y,
      size: 12,
      font,
    });
    y -= 20;
  };

  drawLine("Ref", reference);
  drawLine("Student Name", data.fullName);
  drawLine("Father Name", data.fatherName);
  drawLine("Student Mobile", data.studentMobile);
  drawLine("Parent Mobile", data.parentMobile);
  drawLine("Email", data.email);
  drawLine("DOB", data.dob);
  drawLine("Qualification", data.qualification);
  drawLine("City", data.city);
  drawLine("Skill Interest", data.skillInterest);
  drawLine("Has Laptop", data.hasLaptop);
  drawLine("Experience", data.experience);
  drawLine("Why Join", data.whyJoin);

  // FOOTER
  page.drawText("Thank you for registering with Techie Thrives!", {
    x: 150,
    y: 80,
    size: 10,
    font,
  });

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(filePath, pdfBytes);

  console.log("📄 PDF Created:", filePath);

  return filePath;
}

// ✅ EMAIL FUNCTION
async function sendEmail(pdfPath: string, ref: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "techietrives@gmail.com",
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: "SLP System",
    to: "techietrives@gmail.com", // ✅ FIX (placeholder hata diya)
    subject: `Approved Registration ${ref}`,
    text: "Receipt attached",
    attachments: [
      {
        filename: `receipt-${ref}.pdf`,
        path: pdfPath,
      },
    ],
  });
}