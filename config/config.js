require('dotenv').config();
const ENV_CONFIG = {
  dev: {
    uk: 'https://vsfdev.ego.co.uk',
    us: 'https://vsfdev.egoshoes.com/us',
    eu: 'https://vsfdev.egoshoes.com/eu',
    ca: 'https://vsfdev.egoshoes.com/ca',
    au: 'https://vsfdev.egoshoes.com/au',
    ae: 'https://vsfdev.egoshoes.com/ae'
  },
  stage: {
    uk: 'https://vsfstage.ego.co.uk',
    us: 'https://vsfstage.egoshoes.com/us',
    eu: 'https://vsfstage.egoshoes.com/eu',
    ca: 'https://vsfstage.egoshoes.com/ca',
    au: 'https://vsfstage.egoshoes.com/au',
    ae: 'https://vsfstage.egoshoes.com/ae'
  },
  prod: {
    uk: 'https://ego.co.uk',
    us: 'https://egoshoes.com/us',
    eu: 'https://egoshoes.com/eu',
    ca: 'https://egoshoes.com/ca',
    au: 'https://egoshoes.com/au',
    ae: 'https://egoshoes.com/ae'
  },
  'gcp-stage': {
    uk: 'https://ego-gcp-unitedstorefront-staging-ego-co-uk.cfstack.com',
    us: 'https://ego-gcp-unitedstorefront-staging-ego-co-uk.cfstack.com/us',
    eu: 'https://ego-gcp-unitedstorefront-staging-ego-co-uk.cfstack.com/eu'
  }
};

const DEFAULT_ENV = 'stage';
const DEFAULT_LOCALE = 'us';

const SUPPORTED_ENVS = ['dev', 'stage', 'prod', 'gcp-stage'];
const SUPPORTED_LOCALES = ['uk', 'us', 'eu', 'ca', 'au', 'ae'];

function getEnvironment() {
  const env = process.env.ENV || process.env.ENVIRONMENT || DEFAULT_ENV;
  if (!SUPPORTED_ENVS.includes(env)) {
    console.warn(`Unsupported environment "${env}". Using default: ${DEFAULT_ENV}`);
    return DEFAULT_ENV;
  }
  return env;
}

function getLocale() {
  const locale = process.env.LOCALE || DEFAULT_LOCALE;
  if (!SUPPORTED_LOCALES.includes(locale)) {
    console.warn(`Unsupported locale "${locale}". Using default: ${DEFAULT_LOCALE}`);
    return DEFAULT_LOCALE;
  }
  return locale;
}

function getBaseUrl(env = null, locale = null) {
  const environment = env || getEnvironment();
  const localeCode = locale || getLocale();
  const envConfig = ENV_CONFIG[environment];

  if (!envConfig) {
    console.error(`Environment "${environment}" not found. Using default.`);
    return ENV_CONFIG[DEFAULT_ENV][DEFAULT_LOCALE];
  }

  return envConfig[localeCode] || envConfig[DEFAULT_LOCALE] || envConfig.uk;
}

function getConfig() {
  const environment = getEnvironment();
  const locale = getLocale();
  const baseUrl = getBaseUrl(environment, locale);

  return { environment, locale, baseUrl, supportedEnvs: SUPPORTED_ENVS, supportedLocales: SUPPORTED_LOCALES };
}

function logConfig() {
  const config = getConfig();
  console.log('='.repeat(60));
  console.log('🌍 Test Configuration');
  console.log('='.repeat(60));
  console.log(`Environment: ${config.environment}`);
  console.log(`Locale:      ${config.locale}`);
  console.log(`Base URL:    ${config.baseUrl}`);
  console.log('='.repeat(60));
}

module.exports = {
  ENV_CONFIG,
  DEFAULT_ENV,
  DEFAULT_LOCALE,
  SUPPORTED_ENVS,
  SUPPORTED_LOCALES,
  getEnvironment,
  getLocale,
  getBaseUrl,
  getConfig,
  logConfig
};
