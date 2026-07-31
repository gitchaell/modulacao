import { getIronSession } from 'iron-session';

export const sessionOptions = {
  password: import.meta.env.SESSION_PASSWORD || 'complex_password_at_least_32_characters_long',
  cookieName: 'modulacao_session',
  cookieOptions: {
    secure: import.meta.env.PROD,
  },
};

export async function getSession(request: Request, response: Response) {
  return await getIronSession<{ userId?: string; role?: string }>(request, response, sessionOptions);
}