# NOVAbids - Modern Auction Platform

NOVAbids is a modern, real-time auction platform built with React and Supabase, offering a seamless experience for both buyers and sellers.

## 🌟 Features

- **Live Bidding**: Real-time auction updates with instant bid tracking
- **Secure Authentication**: Advanced security with multi-factor authentication
- **Modern Interface**: Clean, responsive design with intuitive user experience
- **Real-time Updates**: Instant notifications for bids and auction status
- **User Dashboard**: Comprehensive dashboard for managing auctions and bids
- **Email Notifications**: Automated email alerts for auction events

## 🚀 Tech Stack

- **Frontend**:

  - React 19
  - Vite
  - TailwindCSS
  - Radix UI Components
  - Framer Motion
  - React Router DOM
  - React Hook Form with Zod validation

- **Backend**:

  - Supabase (Authentication, Database, Real-time)
  - Express.js (Server)
  - Resend (Email Service)

## 📦 Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/nova_official.git
   cd nova_official
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:

   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_RESEND_API_KEY=your_resend_api_key
   ```

4. Start the development server:
   ```bash
   pnpm dev
   ```

## 🏗️ Project Structure

```
src/
├── components/          # Reusable components
│   ├── common/         # Shared components
│   ├── layout/         # Layout components
│   └── ui/             # UI components
├── pages/              # Page components
│   ├── auth/          # Authentication pages
│   ├── dashboard/     # Dashboard pages
│   └── homepage/      # Homepage
├── services/          # API and external services
├── hooks/             # Custom React hooks
├── context/           # React Context providers
├── utils/             # Utility functions
└── styles/            # Global styles
```

## 🛠️ Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint
- `pnpm server` - Start Express server
- `pnpm dev:all` - Run both frontend and backend servers

## 🔒 Environment Variables

Required environment variables:

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `VITE_RESEND_API_KEY`: Your Resend API key for email service

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Supabase for the backend infrastructure
- Radix UI for the component library
- TailwindCSS for the styling framework
