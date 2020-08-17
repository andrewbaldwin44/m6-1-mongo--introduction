const defaultPage = 1;
const defaultLimit = 25;

function getQueryValue(queryValue, defaultValue, maxValue) {
  return queryValue !== undefined
    ? Number(queryValue)
    : defaultValue;
}

function paginateModel(
  model, page, limit
) {
  const results = {};

  page = getQueryValue(page, defaultPage);
  limit = getQueryValue(limit, defaultLimit);
  const pages = model.length;

  if ((page + limit) > pages) limit = pages - page;

  results.page = page;
  results.limit = limit;

  const startIndex = (results.page - 1) * results.limit;
  const endIndex = results.page * results.limit;

  results.paginatedModel = model.slice(startIndex, endIndex);

  return results;
}

module.exports = {
  paginateModel,
}
