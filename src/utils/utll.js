export function capitalizeEachWord(str) {
  if (!str || typeof str !== "string") return "";
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export const axios_ = {
  get: async (url) => {
    if (url?.includes("notification")) {
      return { status: 200, data: [] };
    }
    return { status: 200, data: { data: "Logo not found" } };
  },
};
