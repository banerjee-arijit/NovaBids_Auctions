const topics = [
  {
    id: "login",
    title: "How to Login",
    content:
      "Securely log in to your Novabid account using email/password or Google.",
    process: [
      { step: "Go to the Novabid homepage." },
      { step: "Click the 'Login' button." },
      { step: "Enter your registered email address." },
      { step: "Type your password correctly." },
      { step: "Click on the 'Submit' button." },
      { step: "Or choose 'Login with Google' if preferred." },
      { step: "Grant access if using Google login." },
      { step: "You'll be redirected to your dashboard." },
      { step: "If needed, click 'Forgot Password' to reset it." },
      { step: "Use a strong internet connection for a smooth experience." },
    ],
  },
  {
    id: "register",
    title: "How to Register",
    content: "Create a new Novabid account to start participating in auctions.",
    process: [
      { step: "Open the Novabid website." },
      { step: "Click the 'Sign Up' button." },
      { step: "Enter your full name and email address." },
      { step: "Create and confirm a strong password." },
      { step: "Agree to the terms and conditions." },
      { step: "Click on the 'Register' button." },
      { step: "Check your email for a verification link." },
      { step: "Click the link to verify your account." },
      { step: "Log in using your new credentials." },
      { step: "Complete your profile for a better experience." },
    ],
  },
  {
    id: "place-bid",
    title: "How to Place a Bid",
    content: "Learn how to participate in auctions and place bids confidently.",
    process: [
      { step: "Log in to your Novabid account." },
      { step: "Browse available auctions." },
      { step: "Select the item you want to bid on." },
      { step: "Review the item details and bid rules." },
      { step: "Enter your bid amount." },
      { step: "Click the 'Place Bid' button." },
      { step: "Confirm your bid in the popup." },
      { step: "Monitor the auction to track your bid." },
      { step: "Increase your bid if you're outbid." },
      { step: "Wait for the auction to end to see if you win." },
    ],
  },
];

export default topics;
