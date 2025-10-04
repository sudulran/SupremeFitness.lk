import React from 'react'
import { Link } from 'react-router-dom'
import {
  DumbbellIcon,
  ClockIcon,
  UsersIcon,
  HeartIcon,
  StarIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  XIcon,
} from 'lucide-react'
import Footer from '../components/Footer'

import '../tailwind.css'

const HomePage = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section
        className="w-full h-screen flex items-center justify-center bg-black text-white"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')",
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
          <div className="text-center">
            <div className="inline-block bg-red-600 text-white text-xs font-bold uppercase px-3 py-1 mb-6 rounded-sm tracking-wider">
              Premium Fitness Center
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-shadow">
              UNLEASH YOUR <span className="text-red-500">POTENTIAL</span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto font-light">
              Join the elite fitness experience with state-of-the-art equipment
              and expert training
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link
                to="/signin"
                className="px-8 py-4 bg-red-600 text-white text-lg font-bold uppercase rounded-sm hover:bg-red-700 transition-colors tracking-wider shadow-lg transform hover:-translate-y-1 hover:shadow-xl duration-300"
              >
                Start Today
              </Link>
              <Link
                to="/workoutplans"
                className="px-8 py-4 bg-transparent border-2 border-white text-white text-lg font-bold uppercase rounded-sm hover:bg-white hover:text-black transition-colors tracking-wider shadow-lg transform hover:-translate-y-1 hover:shadow-xl duration-300"
              >
                View Plans
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      {/* ... truncated for brevity, same as pasted content ... */}

      {/* Testimonials Section */}
      <section className="py-24 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 uppercase">
              Success <span className="text-red-600">Stories</span>
            </h2>
            <div className="w-24 h-1 bg-red-600 mx-auto mb-6"></div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Real results from real members who transformed their bodies and
              lives
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-900 p-6 rounded-lg relative">
              <div className="text-yellow-500 text-4xl font-serif absolute top-4 left-4 leading-none">
                "
              </div>
              <div className="flex items-center mb-4 pt-4">
                {Array(5).fill().map((_, i) => (
                  <StarIcon
                    key={i}
                    className="h-5 w-5 text-yellow-500 fill-yellow-500"
                  />
                ))}
              </div>
              <p className="mb-6 text-gray-300 italic">
                "PowerGym transformed my fitness journey. I've lost 30 pounds
                and gained so much strength and confidence. The trainers push
                you to your limits but in the best way possible!"
              </p>
              <div className="flex items-center">
                <img
                  src="https://randomuser.me/api/portraits/women/44.jpg"
                  alt="Member"
                  className="h-12 w-12 rounded-full object-cover mr-4 border-2 border-red-500"
                />
                <div>
                  <p className="font-semibold">Sarah M.</p>
                  <p className="text-sm text-gray-400">Member for 1 year</p>
                </div>
              </div>
            </div>
            {/* Additional testimonial cards follow same structure */}
          </div>
          <div className="text-center mt-14">
            <Link
              to="/feedbacks"
              className="inline-flex items-center px-8 py-4 bg-red-600 text-white font-bold uppercase rounded-sm hover:bg-red-700 transition-all duration-300 tracking-wider shadow-lg"
            >
              Read All Testimonials <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-24 text-white relative"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url('https://images.unsplash.com/photo-1593079831268-3381b0db4a77?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80')",
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6 uppercase">
            Start Your Fitness Journey{' '}
            <span className="text-red-600">Today</span>
          </h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto text-gray-300">
            Join our community of fitness enthusiasts and transform your body
            with our expert guidance and support
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link
              to="/signin"
              className="px-10 py-4 bg-red-600 text-white text-lg font-bold uppercase rounded-sm hover:bg-red-700 transition-colors tracking-wider shadow-lg"
            >
              Join Now
            </Link>
            <Link
              to="/plans"
              className="px-10 py-4 bg-transparent border-2 border-white text-white text-lg font-bold uppercase rounded-sm hover:bg-white hover:text-black transition-colors tracking-wider shadow-lg"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default HomePage