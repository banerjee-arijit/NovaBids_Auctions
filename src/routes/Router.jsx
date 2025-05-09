import { createBrowserRouter } from "react-router-dom";
import Homepage from "../pages/homepage/Homepage";
import MeetOurTeam from "@/pages/ourTeam/MeetOurTeam";
import LoginForm from "@/pages/Auth/login/LoginForm";
import TurorialDemo from "@/pages/Tutorial/TutorialDemo";
import RegisterForm from "@/pages/Auth/register/RegisterForm";
import DashboardLayout from "@/pages/dashboard/DashboardLayout";
import DashboardHomePage from "@/pages/dashboard/DashboardHomePage/DashboardHomePage";

const router = createBrowserRouter([
  { path: "/", element: <Homepage /> },
  { path: "/meet_Team", element: <MeetOurTeam /> },
  { path: "/docs", element: <TurorialDemo /> },
  { path: "/auth", element: <LoginForm /> },
  { path: "/auth/register", element: <RegisterForm /> },

  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <DashboardHomePage />,
      },
    ],
  },
]);

export default router;
