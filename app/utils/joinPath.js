'use strict';

const baseURL = 'http://localhost:7001/public/images';

function join(name) {
  return baseURL + '/' + name;
}

function inject(data, field) {
  data.forEach(item => {
    item[`_path_${field}`] = baseURL + '/' + item[field];
  });
  return data;
}

module.exports = {
  join,
  inject,
};
