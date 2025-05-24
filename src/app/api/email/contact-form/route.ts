import EmailContactTemplate from "@/components/emails/EmailContactTemplate";
import { render } from "@react-email/render";
import { NextRequest, NextResponse } from "next/server";

const brevoApiKey = process.env.NEXT_BREVO_API_KEY!;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, message } = body;

  if (!name || !email || !message) {
    return NextResponse.json(
      { data: null, error: "Missing required fields" },
      { status: 400 }
    );
  }

  const newHtml = EmailContactTemplate({
    name,
    email,
    message,
  });
  const htmlContent = await render(newHtml);
  const data = {
    sender: {
      email: process.env.ADMIN_EMAIL,
      name: "shalom-radio",
    },
    to: [
      {
        email: process.env.ADMIN_EMAIL || "admin@shalom-radio.com",
        name: "Shalom Radio Admin",
      },
    ],
    subject: "New Contact Form Submission",
    htmlContent: htmlContent,
    replyTo: {
      email: email,
      name: name,
    },
  };

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": brevoApiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (res.ok) {
    console.log("Contact form email sent successfully");
    return NextResponse.json(
      { data: await res.json(), error: null },
      { status: res.status }
    );
  }
  return NextResponse.json(
    { data: null, error: await res.json() },
    { status: res.status }
  );
}
