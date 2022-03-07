export const getToken = () => {
  return localStorage.getItem("jhi-authenticationToken");
};

export const setToken = (token: string) => {
  localStorage.setItem("jhi-authenticationToken", token);
};

export const removeToken = () => {
  localStorage.removeItem("jhi-authenticationToken");
};
