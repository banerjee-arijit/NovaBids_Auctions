import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/Authcontex";
import Router from "@/routes/Router";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Router />
        <Toaster position="top-center" />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
