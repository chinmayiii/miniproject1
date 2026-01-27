export const palette = {
  darkest: "#0a1327",   // Muted deep blue
  dark: "#202a44",      // Softer indigo
  mid: "#4a5670",       // Muted blue-grey
  light: "#b3b8c7",     // Muted lavender-blue
};

export const accentColor = "#168a7a"; // Muted teal accent
export const positiveAccent = "#156d6d"; // Muted teal accent

export const mainStyle = {
  fontFamily: "'Montserrat', 'Segoe UI', Arial, sans-serif",
  background: `linear-gradient(135deg, ${palette.darkest} 0%, ${palette.dark} 40%, ${palette.mid} 80%, #156d6d 100%)`,
  minHeight: "100vh",
  color: '#FFFFFF', // Pure white for maximum contrast and boldness
  margin: 0,
  padding: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
    fontSize: "1.7rem",
    letterSpacing: "2px",
};

export const cardStyle = {
  background: palette.dark,
  borderRadius: "36px",
  boxShadow: `0 8px 24px 0 ${accentColor}18`,
  padding: "56px 44px",
  maxWidth: "520px",
  textAlign: "center",
  border: `2.5px solid ${accentColor}`,
  color: '#FFFFFF', // Pure white for bold card text
    borderRadius: "56px",
    boxShadow: `0 32px 80px 0 ${accentColor}22`,
    padding: "96px 72px",
    maxWidth: "900px",
    fontSize: "2.5rem",
};

export const buttonStyle = {
  background: `linear-gradient(90deg, ${accentColor} 0%, #6ec6ff 100%)`,
  color: '#070F2B', // Deepest blue for bold button text
  border: "none",
  borderRadius: "18px",
  padding: "18px 44px",
  fontSize: "1.25rem",
  fontWeight: "bold",
  cursor: "pointer",
  boxShadow: `0 2px 8px ${accentColor}18`,
  letterSpacing: "1.2px",
  textTransform: "uppercase",
  marginTop: "32px",
  transition: "transform 0.15s, box-shadow 0.15s",
    borderRadius: "32px",
    padding: "38px 90px",
    fontSize: "2.2rem",
    boxShadow: `0 12px 48px ${accentColor}22`,
    letterSpacing: "2.5px",
    marginTop: "56px",
};
export const buttonHoverStyle = {
  transform: "scale(1.07)",
  boxShadow: `0 8px 24px ${accentColor}44`,
};

export const titleStyle = {
  fontSize: "5.2rem",
  fontWeight: 1000,
  color: accentColor,
  letterSpacing: '6px',
  textTransform: 'uppercase',
  textShadow: `0 2px 16px ${accentColor}44, 0 0px 30px ${palette.darkest}`,
  marginBottom: "28px",
};

export const subtitleStyle = {
  color: accentColor,
  fontWeight: 700,
  letterSpacing: '3px',
  fontSize: "2.7rem",
  marginBottom: "38px",
  textShadow: `0 1px 8px ${accentColor}33`,
};

export const optionBoxStyle = {
  background: palette.mid,
  borderRadius: "28px",
  boxShadow: `0 4px 16px 0 ${accentColor}18`,
  padding: "44px 36px",
  margin: "24px",
  textAlign: "center",
  color: accentColor,
  fontWeight: 800,
  fontSize: "1.35rem",
  cursor: "pointer",
  border: `2.5px solid transparent`,
  transition: "transform 0.2s, box-shadow 0.2s, border-color 0.2s",
  display: "inline-block",
  width: "270px",
};

export const optionBoxHoverStyle = {
  transform: "scale(1.07)",
  borderColor: accentColor,
  boxShadow: `0 8px 24px 0 ${accentColor}44`,
};

export const chipStyle = {
  background: accentColor,
  color: "#232946",
  padding: "18px 36px",
  borderRadius: "36px",
  fontWeight: 1000,
  fontSize: "1.6rem",
  margin: "0 auto 32px auto",
  boxShadow: `0 1px 6px ${accentColor}18`,
  display: "inline-block",
};
export const suggestionBoxStyle = {
  background: palette.light,
  borderRadius: "16px",
  boxShadow: `0 2px 8px 0 ${positiveAccent}18`,
  padding: "18px 24px",
  marginBottom: "18px",
  color: palette.darkest,
  fontWeight: 600,
  fontSize: "1.1rem",
  borderLeft: `6px solid ${positiveAccent}`,
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

export const innerCardStyle = {
  background: palette.mid,
  borderRadius: "36px",
  boxShadow: `0 8px 24px 0 ${accentColor}18`,
  padding: "64px 80px",
  fontSize: "2.2rem",
  border: `1px solid ${palette.light}`,
};

export const selectStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  border: `1px solid ${positiveAccent}`,
  background: palette.light,
  color: palette.darkest,
  fontSize: "1rem",
  marginTop: "10px",
  marginBottom: "18px",
  fontWeight: "bold",
  boxShadow: `0 1px 4px ${palette.mid}11`,
  outline: "none",
};