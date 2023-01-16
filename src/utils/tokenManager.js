import jwt from "jsonwebtoken";
import jwt_decode from "jwt-decode";

export function generateToken(payload) {
  try {
    const expiresIn = "100y"; // 1 Hora
    const token = jwt.sign(payload, process.env.JWT, { expiresIn });
    return { token, expiresIn };
  } catch (error) {
    console.log(error);
  }
}

export async function getTokenPayload(token) {
  return await jwt_decode(token, { payload: true });
}
