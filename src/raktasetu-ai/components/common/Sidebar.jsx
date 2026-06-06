import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="w-64 bg-red-600 min-h-screen text-white p-5">

      <h2 className="text-2xl font-bold mb-6">
        Dashboard
      </h2>

      <div className="flex flex-col gap-4">

        <Link to="#">Overview</Link>
        <Link to="#">Requests</Link>
        <Link to="#">Predictions</Link>
        <Link to="#">Profile</Link>

      </div>

    </div>
  );
}

export default Sidebar;