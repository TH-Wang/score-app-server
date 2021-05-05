'use strict';

function condition(where) {
  const entries = Object.entries(where);
  if (entries.length === 0) return '';

  let res = '';
  entries.forEach(([ field, value ], idx) => {
    if (idx === 0) res += ' WHERE ';
    else res += ' AND ';

    if (isObject(value)) {
      res += field;
      if (value.hasOwnProperty('like')) {
        res += ` LIKE '%${value.like}%'`;
      }
    } else {
      res += `${field}=${value}`;
    }
  });

  return res;
}

function isObject(target) {
  return Object.prototype.toString.call(target) === '[object Object]';
}

module.exports = condition;
