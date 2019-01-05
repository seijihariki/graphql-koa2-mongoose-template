export default {
  async __resolveType(obj) {
    if (obj.credType === 'API_KEY') return 'ApiKeyCredential';
    if (obj.credType === 'PASSWORD') return 'PasswordCredential';
    return undefined;
  },
};
