import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center py-16">
        <h1 className="text-5xl font-bold mb-4">Welcome to SevaConnect</h1>
        <p className="text-lg mb-6">
          Bridging the gap between Donors and NGOs for a better tomorrow.
        </p>
        <button
          className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-gray-100"
          onClick={() => navigate("/donor/auth")}
        >
          Get Started as Donor
        </button>
        <button
          className="ml-4 bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-yellow-300"
          onClick={() => navigate("/auth")}
        >
          Get Started as NGO
        </button>
      </section>

      {/* About Us Section */}
      <section className="py-16 px-8 text-center">
        <h2 className="text-3xl font-bold mb-6">About Us</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          <b>SevaConnect</b> connects donors with NGOs, ensuring donations like food,
          clothes, and medicines reach where they are needed most. With real-time
          tracking, expiry alerts, and transparent reporting, we make giving simple
          and effective.
        </p>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-6">
        <p>© 2025 SevaConnect. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
