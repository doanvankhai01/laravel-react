/**
 * Calculates the appropriate text color based on the background color.
 *
 * @param bgColor - The background color in hexadecimal format.
 * @returns The calculated text color in hexadecimal format.
 */
export const pickTextColorBasedOnBgColorAdvanced = (bgColor: string) => {
  if (bgColor) {
    let color = String(bgColor)
      .toUpperCase()
      .replace(/[^0-9a-f]/gi, '');
    if (color.length < 6) {
      color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];
    }
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);
    const uiColors = [r / 255, g / 255, b / 255];
    const c = uiColors.map(col => {
      if (col <= 0.03928) {
        return col / 12.92;
      }
      return Math.pow((col + 0.055) / 1.055, 2.4);
    });
    const L = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
    return pSBC(L > 0.4 ? -0.7 : 0.7, bgColor);
  }
  return '';
};
/**
 * Calculates the shade or tint of a given color.
 *
 * @param p - The percentage of shade or tint. A value between -1 and 1.
 * @param c0 - The base color in RGB or hexadecimal format.
 * @param c1 - The optional target color in RGB or hexadecimal format.
 * @param l - The optional luminosity mode. If set to 'c', it will calculate the contrasting color.
 *
 * @returns The resulting color in RGB or hexadecimal format.
 */
/* eslint-disable */
const pSBC = (p: number, c0: string, c1?: string, l?: string) => {
  let r,
    g,
    b,
    P,
    f,
    t,
    h,
    i = parseInt,
    m = Math.round,
    a: any = typeof c1 == 'string';
  if (typeof p != 'number' || p < -1 || p > 1 || typeof c0 != 'string' || (c0[0] != 'r' && c0[0] != '#') || (c1 && !a))
    return '';
  const pSBCr = (d: any) => {
    let n = d.length,
      x: any = {};
    if (n > 9) {
      ([r, g, b, a] = d = d.split(',')), (n = d.length);
      if (n < 3 || n > 4) return null;

      (x.r = i(r[3] == 'a' ? r.slice(5) : r.slice(4))), (x.g = i(g)), (x.b = i(b)), (x.a = a ? parseFloat(a) : -1);
    } else {
      if (n == 8 || n == 6 || n < 4) return null;
      if (n < 6) d = '#' + d[1] + d[1] + d[2] + d[2] + d[3] + d[3] + (n > 4 ? d[4] + d[4] : '');
      d = i(d.slice(1), 16);

      if (n == 9 || n == 5)
        (x.r = (d >> 24) & 255), (x.g = (d >> 16) & 255), (x.b = (d >> 8) & 255), (x.a = m((d & 255) / 0.255) / 1000);
      else (x.r = d >> 16), (x.g = (d >> 8) & 255), (x.b = d & 255), (x.a = -1);
    }
    return x;
  };

  (h = c0.length > 9),
    (h = a ? (c1!.length > 9 ? true : c1 == 'c' ? !h : false) : h),
    (f = pSBCr(c0)),
    (P = p < 0),
    (t =
      c1 && c1 != 'c'
        ? pSBCr(c1)
        : P
          ? {
              r: 0,
              g: 0,
              b: 0,
              a: -1,
            }
          : { r: 255, g: 255, b: 255, a: -1 }),
    (p = P ? p * -1 : p),
    (P = 1 - p);
  if (!f || !t) return '';

  if (l) (r = m(P * f.r + p * t.r)), (g = m(P * f.g + p * t.g)), (b = m(P * f.b + p * t.b));
  else
    (r = m((P * f.r ** 2 + p * t.r ** 2) ** 0.5)),
      (g = m((P * f.g ** 2 + p * t.g ** 2) ** 0.5)),
      (b = m((P * f.b ** 2 + p * t.b ** 2) ** 0.5));

  (a = f.a), (t = t.a), (f = a >= 0 || t >= 0), (a = f ? (a < 0 ? t : t < 0 ? a : a * P + t * p) : 0);
  if (h) return 'rgb' + (f ? 'a(' : '(') + r + ',' + g + ',' + b + (f ? ',' + m(a * 1000) / 1000 : '') + ')';
  else
    return (
      '#' +
      (4294967296 + r * 16777216 + g * 65536 + b * 256 + (f ? m(a * 255) : 0)).toString(16).slice(1, f ? undefined : -2)
    );
};
/**
 * Array of global colors used for avatars.
 */
const colorGlobal = [
  '#3699FF',
  '#6610f2',
  '#E4E6EF',
  '#fd7e14',
  '#dc3545',
  '#ffc107',
  '#7E8299',
  '#20c997',
  '#181C32',
  '#6f42c1',
  '#ffffff',
  '#007bff',
  '#28a745',
  '#3F4254',
  '#e83e8c',
  '#17a2b8',
  '#FFA800',
  '#F64E60',
  '#F3F6F9',
  '#8950FC',
  '#1BC5BD',
];
/**
 * An array of letters and numbers.
 */
const letterGlobal = [
  'A',
  'Ă',
  'Â',
  'B',
  'C',
  'D',
  'Đ',
  'E',
  'Ê',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'Ô',
  'Ơ',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'Ư',
  'V',
  'W',
  'X',
  'Y',
  'Z',
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
];
/**
 * Returns a color based on the first letter of the given text.
 * @param text - The text to extract the first letter from.
 * @returns The color associated with the first letter.
 */
export const getColorByLetter = (text: string) => {
  text = text.trim();
  return colorGlobal[letterGlobal.indexOf(text.charAt(0).toUpperCase()) % (colorGlobal.length - 1)];
};
/**
 * Retrieves the first letter(s) from a given text.
 *
 * @param text - The input text.
 * @param numberLetter - The number of letters to retrieve. Default is 1.
 * @returns The first letter(s) from the input text.
 */
export const getFirstLetter = (text: string, numberLetter = 1) => {
  text = text.trim();
  if (text.split(' ').length === 1) {
    return text.substring(0, numberLetter);
  } else {
    let letter = '';
    text.split(' ').map((item: string, index: number) => {
      if (index < numberLetter) {
        letter += item.charAt(0);
      }
      return item;
    });
    return letter;
  }
};
