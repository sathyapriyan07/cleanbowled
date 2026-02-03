module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0B1E2D",
        card: "#101F2D",
        cardAlt: "#0A1622",
        accent: "#2E7CF6",
        accentGlow: "#3BA3FF",
        ink: "#E6F1FF",
        muted: "#9FB3C8",
        danger: "#F87171",
        success: "#22C55E"
      },
      boxShadow: {
        soft: "0 10px 30px rgba(3, 12, 22, 0.5)",
        glow: "0 0 35px rgba(59, 163, 255, 0.25)"
      },
      backgroundImage: {
        "navy-gradient": "linear-gradient(135deg, #0B1E2D 0%, #102A43 45%, #0B1E2D 100%)",
        "card-gradient": "linear-gradient(160deg, rgba(16,42,67,0.95) 0%, rgba(10,25,41,0.95) 100%)"
      }
    }
  },
  plugins: []
};
