import Cookies from "js-cookie";

export const formatDate = (date?: string | null) => {
  return !date ? "" : new Date(date).toISOString().split("T")[0];
};

export const handleLogout = () => {
  Cookies.remove("token");
  if (typeof location !== "undefined") location.href = "/sign-in";
};
