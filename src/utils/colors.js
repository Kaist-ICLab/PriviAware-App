// slice the string into 6 character chunks, each representing a hex value of color
export default function (specifier) {
  var n = (specifier.length / 6) | 0,
    colors = new Array(n),
    i = 0;
  while (i < n) colors[i] = '#' + specifier.slice(i * 6, ++i * 6);
  return colors;
}
