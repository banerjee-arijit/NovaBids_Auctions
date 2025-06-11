import { createBrowserRouter } from "react-router-dom";
import Homepage from "../pages/homepage/Homepage";
import Auth from "@/pages/auth/components/Auth";
import Dashboard from "@/pages/dashboard/Dashboard";

// Pages inside Dashboard
import CreateAuction from "@/pages/dashboard/CreateAuction";
import LiveAuctions from "@/pages/dashboard/LiveAuctions";
import AllAuctions from "@/pages/dashboard/AllAuctions";
import MyAuctions from "@/pages/dashboard/MyAuctions";
import Settings from "@/pages/dashboard/Settings";
import IndexPage from "@/pages/dashboard/Indexpage";
import AuctionDetails from "@/pages/dashboard/AuctionDetails";

const router = createBrowserRouter([
  { path: "/", element: <Homepage /> },
  { path: "/auth", element: <Auth /> },
  {
    path: "/dashboard",
    element: <Dashboard />,
    children: [
      { index: true, element: <IndexPage /> },
      { path: "create-auction", element: <CreateAuction /> },
      { path: "live-auctions", element: <LiveAuctions /> },
      { path: "all-auctions", element: <AllAuctions /> },
      { path: "my-auctions", element: <MyAuctions /> },
      { path: "settings", element: <Settings /> },
      { path: "auction/:id", element: <AuctionDetails /> },
    ],
  },
]);

export default router;
