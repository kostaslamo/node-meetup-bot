const { logger, newsApiKey } = require('./utils');
const { send } = require('./FbSender');
const requestWrapper = require('./requestWrapper');
const Q = require('q');

const newsApiRequest = (searchText) => {
  const def = Q.defer();
  const url = 'https://newsapi.org/v2/';
  const edge = 'everything';
  const method = 'GET';
  const qs = {
    q: searchText,
    sources: 'tech-crunch',
    apiKey: newsApiKey,
    sortBy: 'relevancy',
    language: 'en',
  };

  requestWrapper.apiRequest(url, edge, method, qs).then((body) => {
    const { articles } = body;
    def.resolve(articles);
  }).catch(err => def.reject(err));
  return def.promise;
};

const NewsBot = (ev) => {
  if (ev.message) {
    const userId = ev.sender.id;
    logger.debug(`Message by ${userId}:`, ev.message.text);
    const text = ev.message.text.substring(5, ev.message.text.length);
    newsApiRequest(text).then((msg) => {
      console.log('News', msg);
      // send({ userId, message });
    });
  }
};

module.exports = NewsBot;
