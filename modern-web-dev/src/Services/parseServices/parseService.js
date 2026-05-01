import Parse from "parse";

Parse.initialize(
  "rB891TYII4L9EimcNhfG8WMFmO010TcL790maUkF",
  "FbpESKLp0Sl5NmNO2vFm4aZz0Df3V3LR6pm4S5sb"
);
Parse.serverURL = "https://parseapi.back4app.com";

export const fetchParseData = async (className = "B4aVehicle", includes = []) => {
  const query = new Parse.Query(className);
  includes.forEach((field) => query.include(field));
  try {
    const results = await query.find();
    return results.map((item) => item.toJSON());
  } catch (error) {
    console.error("Error while fetching data from Parse:", error);
    return [];
  }
};

export const createParseData = async (className, data = {}) => {
  const Obj = Parse.Object.extend(className);
  const obj = new Obj();
  try {
    Object.entries(data).forEach(([key, value]) => {
      if (key.endsWith('Id')) {
        const targetClass = key.slice(0, -2);
        const id = typeof value === 'string' ? value : value?.objectId ?? null;
        if (id) {
          obj.set(targetClass, Parse.Object.createWithoutData(targetClass, id));
          return;
        }
      }
      if (key === 'post') {
        const id = typeof value === 'string' ? value : value?.objectId ?? null;
        if (id) {
          const pointer = new Parse.Object('post');
          pointer.id = id;
          obj.set('post', pointer);
          return;
        }
      }
      obj.set(key, value);
    });
    console.debug('createParseData saving', className, obj.toJSON());
    const saved = await obj.save();
    return saved.toJSON();
  } catch (error) {
    console.error("Error creating Parse object:", error);
    throw error;
  }
};

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
