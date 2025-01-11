export class UseConfig {
  adminSecretPhrase: string
  jwtSecret: string
  cloudinaryCloudName: string
  cloudinaryApiKey: string
  cloudinaryApiSecret: string
  cloudinaryTargetFolder: string

  public constructor() {
    this.adminSecretPhrase = process.env.ADMIN_SECRET_PHRASE || 'secret phrase'
    this.jwtSecret = process.env.JWT_SECRET || 'jwt-secret'
    this.cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME || ''
    this.cloudinaryApiKey = process.env.CLOUDINARY_API_KEY || ''
    this.cloudinaryApiSecret = process.env.CLOUDINARY_API_SECRET || ''
    this.cloudinaryTargetFolder = process.env.CLOUDINARY_TARGET_FOLDER || ''
  }
}
