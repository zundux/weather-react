import Storage from "react-native-storage";

var storage = new Storage({
  // maximum capacity, default 1000
  size: 1000,

  // expire time, default 1 day(1000 * 3600 * 24 secs)
  defaultExpires: 1000 * 3600 * 24,

  // cache data in the memory. default is true.
  enableCache: true,

  // if data was not found in storage or expired,
  // the corresponding sync method will be invoked and return
  // the latest data.
  sync: {
    // we'll talk about the details later.
  }
});

export default storage;
