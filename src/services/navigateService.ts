let navigateFunction: ((path: string | number) => void) | null = null;

export const setNavigate = (navigateFn: (path: string | number) => void) => {
  navigateFunction = navigateFn;
};

export const navigateTo = (path: string | number) => {
  if (navigateFunction) {
    navigateFunction(path);
  } else {
    console.warn('Navigate function not set');
  }
};
