import EmailConfirmTem from "@/components/emails/EmailConfirmationTemplate";
import { render } from "@react-email/render";
import { NextRequest, NextResponse } from "next/server";

const brevoApiKey = process.env.NEXT_BREVO_API_KEY!;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { user, url, token } = body;

  if (!user || !url || !token) {
    return NextResponse.json(
      { data: null, error: "Missing required fields" },
      { status: 400 }
    );
  }

  const newHtml = EmailConfirmTem({
    user,
    url,
    token,
  });
  const htmlContent = await render(newHtml);
  const data = {
    sender: {
      email: process.env.ADMIN_EMAIL,
      name: "shalom-radio",
    },
    to: [
      {
        email: user?.email,
        name: user?.name,
      },
      // {
      //   email,
      //   name,
      // },
    ],
    subject: "Confirm your email address",
    htmlContent: htmlContent,
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
    console.log("Email sent successfully");
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
