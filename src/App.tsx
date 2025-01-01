import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import Routes from "./Routes";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Routes />
        <Toaster />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;