
export const getCommonLen = (s1: string, s2: string) => {
  for (let i = 0; i < s1.length; i++) {
    if (s1[i] !== s2[i]) return i;
  }
  return s1.length;
}

export const findCloseParenthesis = (str: string, r1: number): number => {
  for (let i = r1+1; i < str.length; i++) {
    if (str[i] === ')') return i;
  }
  return -1;
}

// https://stackoverflow.com/questions/4371565/create-regexps-on-the-fly-using-string-variables
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions 
export const convertStringToRegex = (str: string): RegExp => {
  str = str.replace(/[-/\\$*+?.()|[\]{}]/g, '\\$&')
  if (str[0] !== '^') str = '^' + str
  return new RegExp(str);
}
