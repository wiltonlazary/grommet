// Converting between Date and String types is handled via a "schema".
// The schema is an array of strings, split into strings with identical
// characters. So, 'mm/dd/yyyy' will be ['mm', '/', 'dd', '/', 'yyyyy'].

export const formatToSchema = format => {
  if (!format) return undefined;
  const result = [];

  let i = 0;
  let part;
  while (i < format.length) {
    if (!part || part[0] !== format[i]) {
      if (part) result.push(part);
      part = format[i];
    } else {
      part += format[i];
    }
    i += 1;
  }
  if (part) result.push(part);

  return result;
};

// convert value into text representation using the schema
export const valueToText = (value, schema) => {
  // when user initializes dates as empty array, we want to still
  // show the placeholder text
  if (!value || (Array.isArray(value) && !value.length)) return '';
  let text = '';

  const dates = (Array.isArray(value) ? value : [value]).map(v => new Date(v));

  let dateIndex = 0;
  let parts = {};
  schema.forEach(part => {
    const char = part[0].toLowerCase();
    // advance dateIndex if we already have this part
    while (
      dateIndex < dates.length &&
      (Number.isNaN(dates[dateIndex].date) ||
        ((char === 'm' || char === 'd' || char === 'y') && parts[part]))
    ) {
      dateIndex += 1;
      parts = {};
    }
    const date = dates[dateIndex];

    if (date && part === 'm') {
      text += date.getMonth() + 1;
      parts[part] = true;
    } else if (date && part === 'mm') {
      text += `0${date.getMonth() + 1}`.slice(-2);
      parts[part] = true;
    } else if (date && part === 'd') {
      text += date.getDate();
      parts[part] = true;
    } else if (date && part === 'dd') {
      text += `0${date.getDate()}`.slice(-2);
      parts[part] = true;
    } else if (date && part === 'yy') {
      text += date
        .getFullYear()
        .toString()
        .slice(-2);
      parts[part] = true;
    } else if (date && part === 'yyyy') {
      text += date.getFullYear();
      parts[part] = true;
    } else text += part;
  });

  return text;
};

const charCodeZero = '0'.charCodeAt(0);
const charCodeNine = '9'.charCodeAt(0);

const pullDigits = (text, index) => {
  let end = index;
  while (
    text.charCodeAt(end) >= charCodeZero &&
    text.charCodeAt(end) <= charCodeNine
  )
    end += 1;
  return text.slice(index, end);
};

export const textToValue = (text, schema) => {
  if (!text) return undefined;

  let result;
  const addDate = parts => {
    // do a little sanity checking on the values
    if (
      !parts.m ||
      !parts.d ||
      !parts.y ||
      parts.y.length < 4 ||
      parts.m.length > 2 ||
      parts.d.length > 2 ||
      parts.m > 12 ||
      parts.d > 31
    )
      return parts;
    const date = new Date(parts.y, parts.m - 1, parts.d).toISOString();
    if (!result) result = date;
    // single
    else if (Array.isArray(result)) result.push(date);
    // second
    else result = [result, date]; // third and beyond, unused?
    return {};
  };

  let parts = {};
  let index = 0;
  schema.forEach(part => {
    if (index < text.length) {
      const char = part[0].toLowerCase();
      if (parts[char] !== undefined) parts = addDate(parts);

      if (char === 'm') {
        parts.m = pullDigits(text, index);
        index += parts.m.length;
      } else if (char === 'd') {
        parts.d = pullDigits(text, index);
        index += parts.d.length;
      } else if (char === 'y') {
        parts.y = pullDigits(text, index);
        index += parts.y.length;
      } else if (text.slice(index, index + part.length) === part) {
        index += part.length;
      } else {
        // syntax error
        index = text.length;
        result = undefined;
      }
    }
  });
  addDate(parts);

  return result;
};
