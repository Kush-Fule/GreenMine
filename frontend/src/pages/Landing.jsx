import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-bold text-green-700 mb-4">
        GreenMine
      </h1>

      <p className="text-gray-600 max-w-xl mb-8">
        A web-based platform to calculate and manage carbon footprint
        of coal mines using industry-standard emission factors.
      </p>

      <div className="flex gap-4">
        <Link
          to="/login"
          className="px-6 py-2 bg-green-700 text-white rounded hover:bg-green-800"
        >
          Login
        </Link>

        <Link
          to="/register"
          className="px-6 py-2 border border-green-700 text-green-700 rounded hover:bg-green-50"
        >
          Register
        </Link>
      </div>
    </div>
  );
};

export default Landing;
