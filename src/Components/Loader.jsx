import { motion } from "framer-motion";

export default function Loader() {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      height: "60vh"
    }}>
      <motion.div
        animate={{ scale: [1, 1.25, 1] }}
        transition={{ repeat: Infinity, duration: 1.2 }}
        style={{
          width: 80, height: 80, borderRadius: 20,
          background: "linear-gradient(90deg,#007bff,#0056b3)"
        }}
      />
    </div>
  );
}
