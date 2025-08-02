import { OpenForWork } from "@/ui/open-for-work";
import TiptapEditor from "@/ui/tiptap-editor";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="max-w-4xl mx-auto px-2 relative">
      <div className="mb-4 text-center space-x-4">
        <Link 
          to="/letter" 
          className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Letter Editor Demo
        </Link>
        <Link 
          to="/letter-tiptap" 
          className="inline-block bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          TipTap with Page Backgrounds
        </Link>
      </div>
      <TiptapEditor />
      <OpenForWork />
    </div>
  );
}

export default Home;
