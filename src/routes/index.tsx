import { createFileRoute, Link } from '@tanstack/react-router'
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Main Content Section */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              <span className="block text-blue-600">HealthCare+</span>
              <span className="block">Your Gateway to Optimal</span>
              <span className="block">Health Solutions</span>
            </h1>

            <p className="text-xl text-gray-600 max-w-2xl">
              Our platform serves as your gateway to a healthier life, offering
              personalized guidance, valuable insights, and support for your
              well-being.
            </p>

            <div className="pt-4">
              <Link
                to="/login"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition duration-300 shadow-md hover:shadow-lg"
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="relative h-100 lg:h-full">
            <img
              className="absolute inset-0 w-full h-full object-cover rounded-xl shadow-lg"
              src="https://i.pinimg.com/736x/1e/c3/63/1ec363db9598a75130f66966aacbc810.jpg"
              alt="Happy doctor with patient"
            />
          </div>
        </div>
      </div>

      {/* Why Choose HealthCare+ Section */}
      <section className="py-16 bg-gray-50 w-full min-h-[600px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Why Choose <span className="text-blue-600">HealthCare+</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the features that make healthcare management simple and
              effective
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-blue-600 text-4xl mb-4">📅</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Easy Scheduling
              </h3>
              <p className="text-gray-600">
                Book appointments with your preferred healthcare providers in
                just a few clicks.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-blue-600 text-4xl mb-4">👨‍⚕️</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Expert Care
              </h3>
              <p className="text-gray-600">
                Connect with certified healthcare professionals and specialists.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-blue-600 text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Health Tracking
              </h3>
              <p className="text-gray-600">
                Monitor your health metrics and track your wellness progress
                over time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white w-full min-h-[400px]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Healthcare Plus</h3>
              <p className="text-gray-400">
                Providing exceptional healthcare services since 2005. Our
                commitment to quality care is unmatched.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="text-gray-400 hover:text-white transition"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Services
                  </a>
                </li>
                <li>
                  <Link
                    to="/dashboard/patient/doctors"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Doctors
                  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <address className="text-gray-400 not-italic">
                <p>123 Medical Center Drive</p>
                <p>Nairobi, Kenya</p>
                <p className="mt-2">Phone: +254 712 345 678</p>
                <p>Email: info@healthcareplus.com</p>
              </address>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition"
                >
                  <FaFacebook size={20} />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition"
                >
                  <FaTwitter size={20} />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition"
                >
                  <FaInstagram size={20} />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition"
                >
                  <FaLinkedin size={20} />
                </a>
              </div>
              <div className="mt-6">
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="px-3 py-2 text-gray-900 rounded-l focus:outline-none w-full"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-400 text-sm">
            <p>
              &copy; {new Date().getFullYear()} Healthcare Plus. All rights
              reserved.
            </p>
            <div className="mt-2">
              <a href="#" className="hover:text-white transition">
                Privacy Policy
              </a>
              <span className="mx-2">|</span>
              <a href="#" className="hover:text-white transition">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
