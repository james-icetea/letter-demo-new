import "./App.css";
// Import your components/pages
import { Loader } from "lucide-react";
import { Suspense } from "react";
import { cn } from "./lib/utils";
import LetterDemo from "./pages/LetterDemo";

function App() {
  return (
    <>
      <Suspense fallback={<LoadingSpinner />}>
        <LetterDemo />
      </Suspense>
    </>
  );
}

export const LoadingSpinner = ({ className }: { className?: string }) => {
  return (
    <div className="flex justify-center items-center w-full h-screen">
      <Loader className={cn("animate-spin w-15 h-15", className)} />
    </div>
  );
};

export default App;
