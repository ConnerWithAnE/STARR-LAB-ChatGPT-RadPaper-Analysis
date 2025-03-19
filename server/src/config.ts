const config = {
  MockData: process.env.MOCK_DATA === 'true',
  AuthEnable: process.env.AUTH_OFF === 'false',
  RunTables: process.env.GPT_RUNTABLES === 'true'
};

export default config;