const Footer = () => (
  <footer className="bg-gray-900 border-t border-gray-800 py-4 px-6 shrink-0">
    <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <img src="/images/plasu-logo.png" alt="PLASU"
          className="w-6 h-6 object-contain rounded-full bg-white p-0.5" />
        <p className="text-gray-400 text-xs font-semibold">PLASU SafeApp</p>
      </div>
      <p className="text-gray-600 text-xs text-center">
        © {new Date().getFullYear()} Plateau State University, Bokkos · Campus Safety System
      </p>
      <p className="text-gray-600 text-xs italic">"Knowledge, Diligence, Integrity"</p>
    </div>
  </footer>
);
export default Footer;
