const dbs = {
  core: {
    type: 'pg',
    conn: {
      host: process.env.DB_CORE_HOST,
      name: process.env.DB_CORE_NAME,
      user: process.env.DB_CORE_USER,
      password: process.env.DB_CORE_PASS,
    },
  },
  local: {
    type: 'pg',
    conn: {
      host: process.env.DB_LOCAL_HOST,
      name: process.env.DB_LOCAL_NAME,
      user: process.env.DB_LOCAL_USER,
      password: process.env.DB_LOCAL_PASS,
    },
  },
};

module.exports = {
  dbs,
};