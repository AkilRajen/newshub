export default function About() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          About NewsHub
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Your trusted source for breaking news, in-depth analysis, and stories that matter. 
          We're committed to delivering accurate, timely, and unbiased journalism.
        </p>
      </div>

      {/* Mission Section */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Mission</h2>
        <p className="text-lg text-gray-700 mb-4">
          At NewsHub, we believe that informed citizens are the foundation of a healthy democracy. 
          Our mission is to provide comprehensive, accurate, and accessible news coverage that 
          empowers people to make informed decisions about their lives and communities.
        </p>
        <p className="text-lg text-gray-700">
          We strive to maintain the highest standards of journalistic integrity while embracing 
          innovative technologies to deliver news in ways that are engaging and relevant to our 
          diverse global audience.
        </p>
      </div>

      {/* Values Section */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-3 text-gray-900">Accuracy</h3>
          <p className="text-gray-600">
            We verify facts rigorously and correct errors promptly. Our commitment to accuracy 
            is unwavering in everything we publish.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-3 text-gray-900">Independence</h3>
          <p className="text-gray-600">
            Our editorial decisions are made independently, free from political or commercial 
            influence. We serve our readers, not special interests.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-3 text-gray-900">Diversity</h3>
          <p className="text-gray-600">
            We embrace diverse perspectives and voices, ensuring our coverage reflects the 
            rich tapestry of human experience and opinion.
          </p>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold mb-8 text-gray-900 text-center">Our Team</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { name: "Sarah Johnson", role: "Editor-in-Chief", specialty: "Technology" },
            { name: "Michael Chen", role: "Senior Reporter", specialty: "Environment" },
            { name: "Emily Rodriguez", role: "Financial Analyst", specialty: "Finance" },
            { name: "David Kim", role: "Science Correspondent", specialty: "Science" }
          ].map((member) => (
            <div key={member.name} className="text-center">
              <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-xl font-bold text-gray-600">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
              <p className="text-blue-600 font-medium">{member.role}</p>
              <p className="text-sm text-gray-600">{member.specialty}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-gray-100 rounded-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 text-center">Get in Touch</h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="text-lg font-semibold mb-2">Editorial</h3>
            <p className="text-gray-600">editorial@newshub.com</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Tips & News</h3>
            <p className="text-gray-600">tips@newshub.com</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Support</h3>
            <p className="text-gray-600">support@newshub.com</p>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            Follow us on social media for the latest updates
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Twitter
            </button>
            <button className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900">
              Facebook
            </button>
            <button className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800">
              LinkedIn
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}