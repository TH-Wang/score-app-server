'use strict';

const baseURL = 'http://localhost:7001/public/images';

function join(name) {
  return baseURL + '/' + name;
}

function insert(data, field) {
  data.forEach(item => {
    item[field] = baseURL + '/' + item[field];
  });
  return data;
}

module.exports = {
  join,
  insert,
};
