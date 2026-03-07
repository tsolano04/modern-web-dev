import Parse from "parse";

// Initialize Parse (matches other parse services)
Parse.initialize(
  "rB891TYII4L9EimcNhfG8WMFmO010TcL790maUkF",
  "FbpESKLp0Sl5NmNO2vFm4aZz0Df3V3LR6pm4S5sb"
);

Parse.serverURL = "https://parseapi.back4app.com";

export const deleteParseData = async (className, id) => {
  const query = new Parse.Query(className);

  try {
    const obj = await query.get(id);
    await obj.destroy();
    return { success: true, objectId: id };
  } catch (error) {
    console.error("Error deleting Parse object:", error);
    throw error;
  }
};
