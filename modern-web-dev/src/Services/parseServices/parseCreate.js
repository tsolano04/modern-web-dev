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
    Object.entries(data).forEach(([key, value]) => {
      // trying to manage pointer fields, not working perfectly
      if (key.endsWith('Id')) {
        const targetClass = key.slice(0, -2); // postId -> post
        const id = typeof value === 'string' ? value : value && value.objectId ? value.objectId : null;
        if (id) {
          const pointer = Parse.Object.createWithoutData(targetClass, id);
          obj.set(targetClass, pointer);
          return;
        }
      }

      if (key === 'post') {
        const id = typeof value === 'string' ? value : value && value.objectId ? value.objectId : null;
        if (id) {
          const pointer = Parse.Object.createWithoutData('post', id);
          obj.set('post', pointer);
          return;
        }
      }

      obj.set(key, value);
    });
    // Helpful debug: show what will be saved (class and fields)
    try {
      // Note: JSON representation may not include pointer ids, but this helps during development
      // eslint-disable-next-line no-console
      console.debug('createParseData saving', className, obj.toJSON ? obj.toJSON() : data);
    } catch (e) {
    }
    const saved = await obj.save();
    return saved.toJSON();
  } catch (error) {
    console.error("Error creating Parse object:", error);
    throw error;
  }
};
