let navigateFunction: ((path: string) => void) | null = null;

export const setNavigate = (navigateFn: (path: string) => void) => {
  navigateFunction = navigateFn;
};

export const navigateTo = (path: string) => {
  if (navigateFunction) {
    navigateFunction(path);
  } else {
    console.warn('Navigate function not set');
  }
};
