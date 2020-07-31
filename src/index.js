#!/usr/bin/env node

const { execSync } = require('child_process');
const Wappalyzer = require('wappalyzer');
const logger = require('./utils/logger');
const { messages, units } = require('./utils/constants');

const getURLList = () => {
  const args = process.argv;
  return args.slice(2);
};

const getTechResponse = async (urls) => {
  const wappalyzer = await new Wappalyzer({
    maxWait: units.ONE_MINUTE,
    recursive: true,
    userAgent: 'Wappalyzer',
    htmlMaxCols: 2000,
    htmlMaxRows: 2000,
  });

  await wappalyzer.init();

  const results = await Promise.all(
    urls.map(async (url) => ({
      url,
      results: await wappalyzer.open(url).analyze(),
    })),
  );

  await wappalyzer.destroy();
  return results;
};

const getUserName = () => {
  const userName = execSync('whoami');
  return String(userName).replace('\n', '');
};

const getIsValidUrls = (urls) => {
  try {
    urls.forEach((url) => new URL(url));
    return true;
  } catch (er) {
    return false;
  }
};

const printResult = (response) => {
  logger.log('\nHoorah! Your results are ready');
  response.forEach((urlRes) => {
    logger.log(`\nTechnologies used in ${urlRes.url} are \n`);
    const techTable = urlRes.results.technologies
      .map(({ name, website }) => ({ Name: name, Website: website }));

    logger.table([...new Set(techTable)]);
  });
};

const techstackCLI = async (args) => {
  const userName = getUserName();

  logger.log(messages.WELCOME_MSG(userName));
  const urls = args || getURLList();

  const validUrl = getIsValidUrls(urls);

  if (!urls || !urls.length || !validUrl) {
    logger.error(messages.INVALID_INPUT);
    process.exit();
  }

  try {
    const techResponse = await getTechResponse(urls);

    printResult(techResponse);
    process.exit();
  } catch (er) {
    logger.error(messages.WAPP_ERROR);
  }
};

techstackCLI();

const CLI = { techstackCLI, getTechResponse };
module.exports = CLI;
