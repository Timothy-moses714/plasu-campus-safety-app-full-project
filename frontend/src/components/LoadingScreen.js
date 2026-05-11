import { motion } from "framer-motion";

const LoadingScreen = () => (
  <div className="fixed inset-0 bg-gray-900 flex flex-col items-center justify-center z-50">
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center gap-6"
    >
      <motion.img
        src="/images/plasu-logo.png"
        alt="PLASU Logo"
        className="w-24 h-24 object-contain rounded-full bg-white p-2 shadow-2xl"
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      />
      <div className="text-center">
        <h1 className="text-white text-2xl font-bold">PLASU SafeApp</h1>
        <p className="text-gray-400 text-sm mt-1">Campus Safety System</p>
        <p className="text-gray-600 text-xs mt-1">Plateau State University, Bokkos</p>
      </div>
      <div className="flex gap-2 mt-2">
        {[0, 1, 2].map(i => (
          <motion.div key={i}
            className="w-3 h-3 bg-red-500 rounded-full"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
          />
        ))}
      </div>
    </motion.div>
  </div>
);
export default LoadingScreen;
