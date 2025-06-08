export const fadeInUp = {
  initial: {
    opacity: 0,
    y: 10,
  },
  animate: {
    opacity: 10,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: 0,
  },
};

export const expandFade = {
  initial: {
    opacity: 0,
    height: 0,
  },
  animate: {
    opacity: 1,
    height: "auto",
  },
  exit: {
    opacity: 0,
    height: 0,
  },
  transition: {
    duration: 0.3,
    ease: "easeInOut",
  },
};
