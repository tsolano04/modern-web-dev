import Parse from "parse";

Parse.initialize(
  "rB891TYII4L9EimcNhfG8WMFmO010TcL790maUkF",
  "FbpESKLp0Sl5NmNO2vFm4aZz0Df3V3LR6pm4S5sb"
);

Parse.serverURL = "https://parseapi.back4app.com";

export const fetchParseData = async () => {
  const query = new Parse.Query("B4aVehicle");

  try {
    const results = await query.find();
    return results.map((item) => item.toJSON());
  } catch (error) {
    console.error("Error while fetching data from Parse:", error);
    return [];
  }
};
