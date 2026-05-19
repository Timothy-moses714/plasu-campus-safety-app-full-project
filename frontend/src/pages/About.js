import StudentLayout from "../components/layout/StudentLayout";

const features = [
  { icon: "🚨", title: "Emergency Panic Button", desc: "One-tap emergency alert that instantly notifies campus security with the student's real-time GPS location." },
  { icon: "🗺", title: "Safe Route Navigation", desc: "GPS-powered route planner using real PLASU campus coordinates, with ML risk zone overlay to guide students safely." },
  { icon: "📋", title: "Incident Reporting", desc: "Students can report theft, assault, suspicious activity, fire and other incidents directly from the app." },
  { icon: "🤖", title: "ML Risk Zone Classification", desc: "Random Forest-inspired algorithm classifies campus locations as High, Medium or Low risk based on incident history and environmental factors." },
  { icon: "🔔", title: "Real-time Alerts", desc: "Campus security can broadcast emergency alerts to all students instantly. Admin dashboard auto-refreshes every 10 seconds." },
  { icon: "👤", title: "Student Profiles", desc: "Students register with matric number, department, phone and home address — enabling security to locate them in emergencies." },
];

const techStack = [
  { name: "React.js", role: "Frontend", color: "bg-blue-900 text-blue-300" },
  { name: "Node.js / Express", role: "Backend API", color: "bg-green-900 text-green-300" },
  { name: "MongoDB Atlas", role: "Database", color: "bg-green-900 text-green-300" },
  { name: "Google Maps API", role: "Navigation", color: "bg-yellow-900 text-yellow-300" },
  { name: "Tailwind CSS", role: "Styling", color: "bg-blue-900 text-blue-300" },
  { name: "Framer Motion", role: "Animations", color: "bg-purple-900 text-purple-300" },
  { name: "JWT Auth", role: "Security", color: "bg-red-900 text-red-300" },
  { name: "Random Forest ML", role: "Risk AI", color: "bg-orange-900 text-orange-300" },
];

const About = () => (
  <StudentLayout>
    <div className="p-4 sm:p-6 space-y-6 max-w-3xl mx-auto">

      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg h-44 sm:h-52">
        <img src="/images/campus-gate-2.jpg" alt="PLASU" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent flex items-center px-6">
          <div>
            <p className="text-red-400 text-xs font-semibold uppercase tracking-widest">Final Year Project</p>
            <h1 className="text-white text-2xl sm:text-3xl font-bold mt-1">PLASU SafeApp</h1>
            <p className="text-gray-300 text-sm mt-1">A Mobile-Based Campus Safety System</p>
            <p className="text-gray-400 text-xs mt-1">Plateau State University, Bokkos</p>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="bg-white rounded-2xl shadow p-5">
        <h2 className="text-gray-800 font-bold text-base mb-3">📖 About This Project</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          PLASU SafeApp is a mobile-focused web application developed as a final year capstone project
          for the Department of Computer Science, Plateau State University Bokkos. The system addresses
          campus insecurity by providing students and security personnel with real-time emergency response tools.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed mt-3">
          The application features a GPS panic button, smart route navigation that avoids risk zones,
          incident reporting, and an admin dashboard for security personnel — all backed by a machine
          learning model that classifies campus locations by risk level.
        </p>
      </div>

      {/* Features */}
      <div>
        <h2 className="text-gray-800 font-bold text-base mb-3">⚡ Key Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {features.map((f, i) => (
            <div key={i} className="bg-white rounded-2xl shadow p-4">
              <span className="text-2xl">{f.icon}</span>
              <h3 className="text-gray-800 font-bold text-sm mt-2">{f.title}</h3>
              <p className="text-gray-500 text-xs mt-1 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="bg-white rounded-2xl shadow p-5">
        <h2 className="text-gray-800 font-bold text-base mb-3">🛠 Technology Stack</h2>
        <div className="flex flex-wrap gap-2">
          {techStack.map(({ name, role, color }) => (
            <div key={name} className={`${color} rounded-xl px-3 py-2`}>
              <p className="font-bold text-xs">{name}</p>
              <p className="text-xs opacity-70">{role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Project Info */}
      <div className="bg-white rounded-2xl shadow p-5">
        <h2 className="text-gray-800 font-bold text-base mb-3">🎓 Project Information</h2>
        <div className="space-y-2">
          {[
            ["Institution", "Plateau State University, Bokkos (PLASU)"],
            ["Department", "Computer Science"],
            ["Project Title", "Development of a Mobile-Based Campus Safety System"],
            ["Year", new Date().getFullYear().toString()],
          ].map(([label, value]) => (
            <div key={label} className="flex gap-3 border-b border-gray-100 pb-2">
              <p className="text-gray-400 text-xs w-24 shrink-0">{label}</p>
              <p className="text-gray-700 text-xs font-medium">{value}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  </StudentLayout>
);
export default About;
