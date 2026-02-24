import { NextResponse } from "next/server"
import { ADMIN_EMAIL } from "@/lib/constants"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, data } = body

    // In production, use Nodemailer with real SMTP config.
    // For demo purposes, we log the email and return success.
    // To enable real email sending, configure SMTP credentials
    // and uncomment the nodemailer code below.

    /*
    const nodemailer = require("nodemailer")
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
    */

    let subject = ""
    let html = ""

    if (type === "registration") {
      subject = "Нова реєстрація на EnergyStore"
      html = `
        <h2>Нова реєстрація користувача</h2>
        <p><strong>Ім'я:</strong> ${data.firstName} ${data.lastName}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Телефон:</strong> ${data.phone}</p>
        <p><strong>Дата реєстрації:</strong> ${new Date().toLocaleString("uk-UA")}</p>
      `
    } else if (type === "order") {
      const itemsHtml = data.items
        .map(
          (item: { name: string; quantity: number; price: number }) =>
            `<tr>
              <td style="padding:8px;border:1px solid #ddd">${item.name}</td>
              <td style="padding:8px;border:1px solid #ddd;text-align:center">${item.quantity}</td>
              <td style="padding:8px;border:1px solid #ddd;text-align:right">${item.price.toLocaleString("uk-UA")} ₴</td>
            </tr>`
        )
        .join("")

      subject = `Нове замовлення на EnergyStore - ${data.totalPrice.toLocaleString("uk-UA")} ₴`
      html = `
        <h2>Нове замовлення</h2>
        <h3>Інформація про клієнта:</h3>
        <p><strong>Ім'я:</strong> ${data.fullName}</p>
        <p><strong>Телефон:</strong> ${data.phone}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Адреса доставки:</strong> ${data.address}</p>
        <p><strong>Коментар:</strong> ${data.comment || "---"}</p>
        <p><strong>Спосіб оплати:</strong> ${data.paymentMethod === "cash" ? "Накладений платіж" : "Оплата картою"}</p>
        <h3>Замовлені товари:</h3>
        <table style="border-collapse:collapse;width:100%">
          <thead>
            <tr style="background:#f5f5f5">
              <th style="padding:8px;border:1px solid #ddd;text-align:left">Товар</th>
              <th style="padding:8px;border:1px solid #ddd;text-align:center">Кількість</th>
              <th style="padding:8px;border:1px solid #ddd;text-align:right">Ціна</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        <h3>Загальна сума: ${data.totalPrice.toLocaleString("uk-UA")} ₴</h3>
        <p><strong>Дата замовлення:</strong> ${new Date().toLocaleString("uk-UA")}</p>
      `
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 })
    }

    // Log email for demo
    console.log("=== EMAIL NOTIFICATION ===")
    console.log("To:", ADMIN_EMAIL)
    console.log("Subject:", subject)
    console.log("HTML:", html)
    console.log("=========================")

    /*
    await transporter.sendMail({
      from: `"EnergyStore" <${process.env.SMTP_USER}>`,
      to: ADMIN_EMAIL,
      subject,
      html,
    })
    */

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Email send error:", error)
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    )
  }
}
