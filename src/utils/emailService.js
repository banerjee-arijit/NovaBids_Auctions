import { Resend } from "resend";

const resend = new Resend("re_TqFFVijs_GmjC2sMkPvkML5rKNywQmiCX");

export const sendAuctionWinEmail = async (
  winnerEmail,
  auctionDetails,
  bidAmount
) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Arijit Banerjee <arijitbanerjee873@gmail.com>",
      to: [winnerEmail],
      subject: `Congratulations! You've Won the Auction: ${auctionDetails.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #2563eb; text-align: center;">🎉 Congratulations! You've Won! 🎉</h1>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #1f2937; margin-top: 0;">Auction Details</h2>
            <p style="margin: 10px 0;"><strong>Auction Title:</strong> ${
              auctionDetails.title
            }</p>
            <p style="margin: 10px 0;"><strong>Winning Bid:</strong> $${bidAmount.toLocaleString()}</p>
            <p style="margin: 10px 0;"><strong>End Date:</strong> ${new Date(
              auctionDetails.end_time
            ).toLocaleString()}</p>
          </div>

          <div style="background-color: #e0f2fe; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #0369a1; margin-top: 0;">Next Steps</h3>
            <p>Please contact the seller to arrange for payment and item collection.</p>
            <p>If you have any questions, please don't hesitate to contact us.</p>
          </div>

          <div style="text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px;">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>© ${new Date().getFullYear()} Nova Auctions. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Error sending email:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Failed to send auction win email:", error);
    throw error;
  }
};
