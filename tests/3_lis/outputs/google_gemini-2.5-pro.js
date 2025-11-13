const findLISLength = async (nums) => {
  if (!nums?.length) {
    return 0;
  }

  const { bisectLeft } = await import('https://esm.sh/d3-array');

  const tails = [];

  for (const num of nums) {
    tails[bisectLeft(tails, num)] = num;
  }

  return tails.length;
};
export default findLISLength;