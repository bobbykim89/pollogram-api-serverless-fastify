export class UseConfig {
  adminSecretPhrase: string
  jwtSecret: string

  constructor() {
    this.adminSecretPhrase = process.env.ADMIN_SECRET_PHRASE || 'secret phrase'
    this.jwtSecret = process.env.JWT_SECRET || 'jwt-secret'
  }
}
