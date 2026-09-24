import "dotenv/config";

export const { BASE_URL, RIOT_CLIENT_ID, RIOT_CLIENT_SECRET } = process.env;
export const RSO_URL = "https://auth.riotgames.com";
export const RSO_AUTHORIZE_URL = RSO_URL + "/authorize";
export const RSO_TOKEN_URL = RSO_URL + "/token";
export const RSO_USER_INFO_URL = RSO_URL + "/userinfo";

export const RIOT_ENDPOINT = "/api/riot";
export const RSO_CALLBACK_ENDPOINT = `${RIOT_ENDPOINT}/callback`;
export const RSO_REDIRECT_URI = `${BASE_URL}${RSO_CALLBACK_ENDPOINT}`;
