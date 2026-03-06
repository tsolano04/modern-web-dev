import Parse from "parse";

Parse.initialize(
  "rB891TYII4L9EimcNhfG8WMFmO010TcL790maUkF",
  "FbpESKLp0Sl5NmNO2vFm4aZz0Df3V3LR6pm4S5sb"
);

Parse.serverURL = "https://parseapi.back4app.com";

export const updateParseData = async (className, id, data = {}) => {
  const query = new Parse.Query(className);

  try {
    const obj = await query.get(id);
    Object.entries(data).forEach(([key, value]) => obj.set(key, value));
    const saved = await obj.save();
    return saved.toJSON();
  } catch (error) {
    console.error("Error updating Parse object:", error);
    throw error;
  }
};
