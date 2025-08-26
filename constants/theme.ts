// Argon-like theme constants
export const colors = {
  background: '#f8f9fe',
  card: '#ffffff',
  text: '#32325d',
  subText: '#8898aa',
  border: '#e9ecef',
  primary: '#5e72e4',
  info: '#11cdef',
  success: '#2dce89',
  danger: '#f5365c',
  warning: '#fb6340',
  gradientStart: '#5e72e4',
  gradientEnd: '#825ee4',
};

export const radii = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 18,
};

export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
};

export const spacing = (n: number) => n * 8;