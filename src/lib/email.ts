import nodemailer from "nodemailer";
import { format } from "date-fns";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

interface BookingEmailData {
  customerName: string;
  customerEmail: string;
  serviceName: string;
  scheduledDate: Date;
  address: string;
  locationType: "store" | "customer";
}

export async function sendRescheduleNotification(booking: BookingEmailData) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.warn("Gmail credentials not configured, skipping email");
    return;
  }

  const formattedDate = format(booking.scheduledDate, "EEEE, MMMM d, yyyy");
  const formattedTime = format(booking.scheduledDate, "h:mm a");
  const locationText =
    booking.locationType === "store"
      ? "at our store location"
      : `at ${booking.address}`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%); padding: 30px; border-radius: 8px;">
        <h1 style="color: #00f0ff; margin: 0 0 20px 0; font-size: 24px;">
          Booking Rescheduled
        </h1>

        <p style="color: #ffffff; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
          Hi ${booking.customerName},
        </p>

        <p style="color: #ffffff; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
          Your booking has been rescheduled. Here are the new details:
        </p>

        <div style="background: rgba(0, 240, 255, 0.1); padding: 20px; border-radius: 6px; border-left: 4px solid #00f0ff; margin: 20px 0;">
          <p style="color: #ffffff; margin: 0 0 10px 0;">
            <strong>Service:</strong> ${booking.serviceName}
          </p>
          <p style="color: #ffffff; margin: 0 0 10px 0;">
            <strong>Date:</strong> ${formattedDate}
          </p>
          <p style="color: #ffffff; margin: 0 0 10px 0;">
            <strong>Time:</strong> ${formattedTime}
          </p>
          <p style="color: #ffffff; margin: 0;">
            <strong>Location:</strong> ${locationText}
          </p>
        </div>

        <p style="color: #888888; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
          If you have any questions, please contact us.
        </p>

        <hr style="border: none; border-top: 1px solid #333; margin: 30px 0;" />

        <p style="color: #666666; font-size: 12px; margin: 0; text-align: center;">
          Refreshed by Revved - Miami's Premium Mobile Car Detailing
        </p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Refreshed by Revved" <${process.env.GMAIL_USER}>`,
      to: booking.customerEmail,
      subject: `Booking Rescheduled - ${formattedDate} at ${formattedTime}`,
      html,
    });
    console.log(`Reschedule email sent to ${booking.customerEmail}`);
  } catch (error) {
    console.error("Failed to send reschedule email:", error);
    throw error;
  }
}
