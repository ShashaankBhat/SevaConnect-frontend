import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="font-sans">
      {/* Navbar */}
      <nav className="bg-white shadow-md fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">SevaConnect</h1>
          <ul className="hidden md:flex space-x-6 font-medium text-gray-700">
            <li><a href="#home" className="hover:text-blue-600 transition">Home</a></li>
            <li><a href="#about" className="hover:text-blue-600 transition">About Us</a></li>
            <li><a href="#mission" className="hover:text-blue-600 transition">Our Mission</a></li>
            <li><a href="#whatwedo" className="hover:text-blue-600 transition">What We Do</a></li>
            <li><button onClick={() => navigate("/auth")} className="text-blue-600 transition">NGO Register</button></li>
            <li><button onClick={() => navigate("/donor/auth")} className="text-green-600 transition">Donor Register</button></li>
            <li><button onClick={() => navigate("/admin/auth")} className="text-purple-600 transition">Admin Login</button></li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="relative h-screen w-full bg-cover bg-center flex flex-col items-center justify-center text-white px-4"
        style={{ backgroundImage: "url('/images/landing.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 text-center max-w-3xl space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">Connecting Donors with NGOs</h1>
          <p className="text-lg md:text-xl text-gray-200">
            Seamless donations, real-time updates, and transparent impact. Join thousands of donors and NGOs making a difference every day.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <button
              onClick={() => navigate("/donor/auth")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
            >
              Register as Donor
            </button>
            <button
              onClick={() => navigate("/auth")}
              className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold shadow hover:bg-yellow-300 transition"
            >
              Register as NGO
            </button>
            <button
              onClick={() => navigate("/admin/auth")}
              className="bg-purple-500 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-purple-600 transition"
            >
              Admin Panel
            </button>
          </div>
        </div>
      </section>

      {/* About Us */}
      <section id="about" className="py-24 px-6 text-center bg-gray-50">
        <h2 className="text-4xl font-bold mb-6 text-gray-800">About Us</h2>
        <p className="max-w-3xl mx-auto text-lg text-gray-600 leading-relaxed">
          <b>SevaConnect</b> bridges the gap between donors and NGOs. We ensure that food, clothing, medicines, and other essentials reach the right place at the right time, empowering communities efficiently and transparently.
        </p>
      </section>

      {/* Mission */}
      <section id="mission" className="py-24 px-6 text-center">
        <h2 className="text-4xl font-bold mb-6 text-gray-800">Our Mission</h2>
        <p className="max-w-3xl mx-auto text-lg text-gray-600 leading-relaxed">
          To ensure no resource goes wasted, every donation finds purpose, and every NGO gets the right support — building a transparent and caring society.
        </p>
      </section>

      {/* What We Do */}
      <section id="whatwedo" className="py-24 px-6 bg-gray-50">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">What We Do</h2>
        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <div className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1">
            <h3 className="font-bold text-xl mb-2">Real-time NGO Needs</h3>
            <p className="text-gray-600">Donors see live NGO requirements and donate instantly.</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1">
            <h3 className="font-bold text-xl mb-2">Expiry Alerts</h3>
            <p className="text-gray-600">System alerts for perishable goods to avoid waste.</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1">
            <h3 className="font-bold text-xl mb-2">Donation Tracking</h3>
            <p className="text-gray-600">Track every contribution with full transparency.</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1">
            <h3 className="font-bold text-xl mb-2">Donor–NGO Matching</h3>
            <p className="text-gray-600">Smart matching ensures donations reach the right NGO.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center py-8">
        <p className="text-gray-400">© 2025 SevaConnect. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
