import { Resend } from "resend";

const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY);

export const sendAuctionWinEmail = async (
  winnerEmail,
  auction,
  winningAmount
) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Nova Auctions <arijitbanerjee8@gmail.com>",
      to: winnerEmail,
      subject: `Congratulations! You won the auction for ${auction.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; text-align: center;">🎉 Congratulations! You Won! 🎉</h1>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #2c3e50;">Auction Details</h2>
            <p><strong>Item:</strong> ${auction.name}</p>
            <p><strong>Winning Bid:</strong> ₹${winningAmount.toLocaleString()}</p>
            <p><strong>Category:</strong> ${auction.category}</p>
          </div>

          <div style="background-color: #e8f5e9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2c3e50;">Next Steps</h3>
            <ol>
              <li>Log in to your Nova Auctions account</li>
              <li>Go to "My Bids" section</li>
              <li>Complete the payment process</li>
              <li>Arrange for item pickup or delivery</li>
            </ol>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <a href="${window.location.origin}/dashboard/my-bids" 
               style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
              View Auction Details
            </a>
          </div>

          <div style="margin-top: 30px; text-align: center; color: #666; font-size: 14px;">
            <p>Thank you for participating in Nova Auctions!</p>
            <p>If you have any questions, please contact our support team.</p>
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
    console.error("Failed to send winner email:", error);
    throw error;
  }
};
