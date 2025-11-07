const findLISLength = async (nums) => {
  if (!nums?.length) {
    return 0;
  }

  const { bisectLeft } = await import("https://cdn.jsdelivr.net/npm/d3-array@3");

  const tails = nums.reduce((sub, num) => {
    sub[bisectLeft(sub, num)] = num;
    return sub;
  }, []);

  return tails.length;
};
export default findLISLength;