'use strict';

module.exports = {
  getTime(date) {
    date = date || new Date();

    const YYYY = date.getFullYear();
    const MM = date.getMonth() + 1;
    const DD = date.getDate();
    const hh = date.getHours();
    const mm = date.getMinutes();
    const ss = date.getSeconds();

    return `${YYYY}-${MM}-${DD} ${hh}-${mm}-${ss}`;
  },
};
