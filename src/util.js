const COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/g;
export default function getParamNames(func) {
  const code = func.toString().replace(COMMENTS, '');
  const result = code.slice(code.indexOf('(') + 1, code.indexOf(')'))
    .match(/([^\s,]+)/g);

  return result === null
    ? []
    : result;
}