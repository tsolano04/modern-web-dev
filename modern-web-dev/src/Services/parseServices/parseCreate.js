import Parse from "parse";

Parse.initialize(
  "rB891TYII4L9EimcNhfG8WMFmO010TcL790maUkF",
  "FbpESKLp0Sl5NmNO2vFm4aZz0Df3V3LR6pm4S5sb"
);

Parse.serverURL = "https://parseapi.back4app.com";

export const createParseData = async (className, data = {}) => {
  const Obj = Parse.Object.extend(className);
  const obj = new Obj();

  try {
    Object.entries(data).forEach(([key, value]) => obj.set(key, value));
    const saved = await obj.save();
    return saved.toJSON();
  } catch (error) {
    console.error("Error creating Parse object:", error);
    throw error;
  }
};
