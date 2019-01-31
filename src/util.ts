
export const getCommonLen = (s1: string, s2: string) => {
  for (let i = 0; i < s1.length; i++) {
    if (s1[i] !== s2[i]) return i;
  }
  return s1.length;
}

export const findCloseParenthesis = () => {
}
