import { NextRequest, NextResponse } from "next/server";
import { saveRegistration } from "@/lib/db";
import { sendTelegramMessage } from "@/lib/telegram";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    // ✅ FormData read karo (JSON nahi)
    const formData = await req.formData();

    const data = Object.fromEntries(formData.entries()) as {
      fullName: string;
      fatherName: string;
      dob: string; // ✅ ADD THIS
      studentMobile: string;
      parentMobile: string;
      email: string;
      qualification: string;
      city: string;
      skillInterest: string;
      hasLaptop: string;
      experience: string;
      whyJoin: string;
      totalPayable: string;
    };
    // 👉 photo file
    const photoFile = formData.get("photo") as File;

    let photoUrl = "";

    // ✅ file save
    if (photoFile && photoFile.size > 0) {
      const bytes = await photoFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const fileName = `${Date.now()}-${photoFile.name}`;
      const filePath = path.join(process.cwd(), "public/uploads", fileName);

      // folder ensure
      fs.mkdirSync(path.dirname(filePath), { recursive: true });

      fs.writeFileSync(filePath, buffer);

      photoUrl = `/uploads/${fileName}`;
    }

    // ✅ reference id
    const reference = `SLP${Date.now()}`;

    const registration = {
      reference,
      ...data,
      photo: photoUrl, // 👈 IMPORTANT
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    // ✅ DB save
    await saveRegistration(registration);

    // ✅ approval link
    const approveLink = `http://localhost:3000/api/approve?ref=${reference}`;

    // ✅ telegram message
    const message = `
🆕 New Registration

👤 Name: ${registration.fullName}
📱 Student: ${registration.studentMobile}
📱 Parent: ${registration.parentMobile}
📧 Email: ${registration.email}
📚 Interest: ${registration.skillInterest}
💰 Amount: ₹${registration.totalPayable}

🆔 Ref: ${reference}

⏳ Status: Pending

👉 Approve:
${approveLink}
`;

    await sendTelegramMessage(message);

    return NextResponse.json({
      success: true,
      reference,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}