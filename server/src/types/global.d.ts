export {}
declare global {
  namespace Express {
    interface Request {
      user: IPayload
    }
  }
  namespace NodeJS {
    interface ProcessEnv {
      DB_HOST: string
      DB_HOST: string
      DB_PORT: string
      DB_USER: string
      DB_PASS: string
      DB_DATABASE: string
      DB_LOG: string
      DB_SYNC: string
      PORT: string
      SWAGGERPREFI: string
      APIPREFI: string
      BASEURL: string
      JWT_SECRE: string
      TOKEN_EXPIRESI: string
      REFRESH_TOKEN_EXPIRESI: string
    }
  }

  interface IPayload {
    userId?: number
  }
}
