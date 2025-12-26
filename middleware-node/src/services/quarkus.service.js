const client = require("../utils/httpClient");
const { baseUrl } = require("../config/quarkus");


exports.signup = async (email, password) => {
  const res = await client.post(`${baseUrl}/auth/signup`, {
    email,
    password,
  });
  return res.data;
};


exports.login = async (email, password) => {
  const res = await client.post(`${baseUrl}/auth/login`, {
    email,
    password,
  });
  return res.data;
};

exports.refresh = async (refreshToken) => {
  const res = await client.post(`${baseUrl}/auth/refresh`, {
    refreshToken,
  });
  return res.data;
};

exports.resendVerification = async (accessToken) => {
  await client.post(
    `${baseUrl}/auth/resend-verification`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
};

exports.getAuthStatus = async (accessToken) => {
  const res = await client.get(`${baseUrl}/auth/status`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};

exports.getAuthStatusByRefresh = async (refreshToken) => {
  const res = await client.post(
    `${baseUrl}/auth/status`,
    { refreshToken }
  );
  return res.data;
};


exports.logout = async (accessToken) => {
  await client.post(
    `${baseUrl}/auth/logout`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
};

exports.getMe = async (accessToken) => {
  const res = await client.get(`${baseUrl}/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};
