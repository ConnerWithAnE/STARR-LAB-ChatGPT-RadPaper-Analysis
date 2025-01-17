const config = {
  MockData: process.env.MOCK_DATA === 'true',
  AuthEnable: process.env.AUTH_OFF === 'false'
};

export default config;