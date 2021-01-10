const getDifferenceInHours = (date1, date2) => {
  const diffInMs = Math.abs(date2 - date1);
  return diffInMs / (1000 * 60 * 60);
};

const unionArray = (arr1, arr2) => {
  const set = new Set();
  const ret2 = [];
  const ret1 = [];
  for (let i = 0; i < arr2.size(); i += 1) {
    const val = arr2[i];
    if (!set.has(val)) {
      ret2.push(val);
      set.add(val);
    }
  }
  for (let i = 0; i < arr1.size(); i += 1) {
    const val = arr1[i];
    if (!set.has(val)) {
      ret1.push(val);
      set.add(val);
    }
  }
  return ret1.concat(ret2);
};

module.exports = {
  getDifferenceInHours,
  unionArray,
};
