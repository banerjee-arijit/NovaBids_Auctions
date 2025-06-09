import { createBrowserRouter } from "react-router-dom";
import Homepage from "../pages/homepage/Homepage";
import Auth from "@/pages/auth/components/Auth";
import Dashboard from "@/pages/dashboard/Dashboard";

const router = createBrowserRouter([
  { path: "/", element: <Homepage /> },
  { path: "/auth", element: <Auth /> },
  { path: "/dashboard", element: <Dashboard /> },

  // {
  //   path: "/dashboard",
  //   element: <DashboardLayout />,
  //   children: [
  //     {
  //       index: true,
  //       element: <DashboardHomePage />,
  //     },
  //     { path: "live-auctions", element: <LiveAuction /> },
  //     { path: "my-bids", element: <Mybids /> },
  //     { path: "profile", element: <UserProfile /> },
  //     { path: "notifications", element: <Notification /> },
  //     { path: "settings", element: <Setting /> },
  //   ],
  // },
]);

export default router;
