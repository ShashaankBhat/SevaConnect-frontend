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
            <li><a href="#home" className="hover:text-blue-600">Home</a></li>
            <li><a href="#about" className="hover:text-blue-600">About Us</a></li>
            <li><a href="#mission" className="hover:text-blue-600">Our Mission</a></li>
            <li><a href="#whatwedo" className="hover:text-blue-600">What We Do</a></li>
            <li><button onClick={() => navigate("/auth")} className="text-blue-600">NGO Register</button></li>
            <li><button onClick={() => navigate("/donor/auth")} className="text-green-600">Donor Register</button></li>
          </ul>
        </div>
      </nav>

      {/* Hero Section with Full Background */}
      <section
        id="home"
        className="relative h-screen w-full bg-cover bg-center flex flex-col items-center justify-center text-white px-4"
        style={{ backgroundImage: "url('/images/landing.jpg')" }}
      >
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 text-center max-w-3xl space-y-6">
          <h1 className="text-5xl font-bold">Connecting Donors with NGOs</h1>
          <p className="text-xl">
            Seamless donations, real-time updates, and transparent impact. Join thousands of donors and NGOs making a difference every day.
          </p>

          <div className="space-x-4 flex flex-wrap justify-center gap-3">
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
              onClick={() => document.getElementById("nearby")?.scrollIntoView({ behavior: "smooth" })}
              className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-green-600 transition"
            >
              Explore Nearby NGOs
            </button>
          </div>
        </div>
      </section>

      {/* About Us */}
      <section id="about" className="py-20 px-6 text-center bg-gray-50">
        <h2 className="text-3xl font-bold mb-6">About Us</h2>
        <p className="max-w-3xl mx-auto text-lg text-gray-600">
          <b>SevaConnect</b> bridges the gap between donors and NGOs. We make sure
          food, clothes, medicines, and other essentials reach the right place at the right time.
        </p>
      </section>

      {/* Mission */}
      <section id="mission" className="py-20 px-6 text-center">
        <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
        <p className="max-w-3xl mx-auto text-lg text-gray-600">
          To ensure no resource goes wasted, every donation finds purpose,
          and every NGO gets the right support — building a transparent and caring society.
        </p>
      </section>

      {/* What We Do */}
      <section id="whatwedo" className="py-20 px-6 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-12">What We Do</h2>
        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg">
            <h3 className="font-bold text-xl mb-2">Real-time NGO Needs</h3>
            <p className="text-gray-600">Donors see live NGO requirements and donate instantly.</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg">
            <h3 className="font-bold text-xl mb-2">Expiry Alerts</h3>
            <p className="text-gray-600">System alerts for perishable goods to avoid waste.</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg">
            <h3 className="font-bold text-xl mb-2">Donation Tracking</h3>
            <p className="text-gray-600">Track every contribution with full transparency.</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg">
            <h3 className="font-bold text-xl mb-2">Donor–NGO Matching</h3>
            <p className="text-gray-600">Smart matching ensures donations reach the right NGO.</p>
          </div>
        </div>
      </section>

      {/* Nearby NGOs */}
      <section id="nearby" className="py-20 px-6 text-center bg-gray-50">
        <h2 className="text-3xl font-bold mb-6">Nearby NGOs in Chh. Sambhajinagar</h2>
        <p className="text-gray-600 mb-8">Click on any NGO to visit their website.</p>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <a
            href="https://www.chetana.ngo/"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1"
          >
            <h3 className="font-bold text-xl mb-2">Chetana Empowerment Foundation</h3>
            <p className="text-gray-600">Education, mental health, and environmental sustainability.</p>
          </a>

          <a
            href="https://www.justdial.com/Aurangabad-Maharashtra/Aastha-Foundation-Aurangabad/nct-10337253"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1"
          >
            <h3 className="font-bold text-xl mb-2">Aastha Foundation Aurangabad</h3>
            <p className="text-gray-600">Senior citizen welfare and community development.</p>
          </a>

          <a
            href="https://www.justdial.com/Aurangabad-Maharashtra/Parivartan-Multi-Purpose-Educational-Society/nct-10337253"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1"
          >
            <h3 className="font-bold text-xl mb-2">Parivartan Multi Purpose Educational Society</h3>
            <p className="text-gray-600">Upliftment of marginalized communities through education.</p>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-6">
        <p>© 2025 SevaConnect. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
