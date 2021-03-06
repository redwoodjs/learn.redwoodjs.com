import config from '../../docusaurus.config';

const { defaultLandingPages } = config.customFields;

function getFirstArticleId(section) {
  if (!defaultLandingPages || !section) return undefined;
  return defaultLandingPages[section];
}

export default getFirstArticleId;
