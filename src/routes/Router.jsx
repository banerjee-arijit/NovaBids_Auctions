import { createBrowserRouter } from "react-router-dom";
import Homepage from "../pages/homepage/Homepage";
import MeetOurTeam from "@/pages/ourTeam/MeetOurTeam";
import DashboardLayout from "@/pages/dashboard/DashboardLayout";
import DashboardHomePage from "@/pages/dashboard/dashboardIndexPage/DashboardHomePage";
import LiveAuction from "@/pages/dashboard/liveAuction/LiveAuction";
import Mybids from "@/pages/dashboard/mybids/Mybids";
import UserProfile from "@/pages/dashboard/userProfile/UserProfile";
import Notification from "@/pages/dashboard/notifications/Notification";
import Setting from "@/pages/dashboard/settings/Setting";
import Auth from "@/pages/auth/components/Auth";

const router = createBrowserRouter([
  { path: "/", element: <Homepage /> },
  { path: "/meet_Team", element: <MeetOurTeam /> },
  { path: "/auth", element: <Auth /> },

  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <DashboardHomePage />,
      },
      { path: "live-auctions", element: <LiveAuction /> },
      { path: "my-bids", element: <Mybids /> },
      { path: "profile", element: <UserProfile /> },
      { path: "notifications", element: <Notification /> },
      { path: "settings", element: <Setting /> },
    ],
  },
]);

export default router;
