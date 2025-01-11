import { v2 as cloudinary } from 'cloudinary'
import { UseConfig } from './useConfig.util'
import type { MultipartImageInput, MultipartContentInput } from '../common/dto'
import type { ServiceResponse } from '../types'

export class UseMultipartData {
  private cloudinaryUploader: typeof cloudinary
  private config: UseConfig
  constructor() {
    this.cloudinaryUploader = cloudinary
    this.config = new UseConfig()
    this.cloudinaryUploader.config({
      cloud_name: this.config.cloudinaryCloudName,
      api_key: this.config.cloudinaryApiKey,
      api_secret: this.config.cloudinaryApiSecret,
    })
  }
  public uploadCloudinary = async (
    dto: MultipartImageInput,
    folderName: string
  ): Promise<ServiceResponse<{ image_id: string }>> => {
    try {
      if (dto.mimetype !== 'image/jpeg' && dto.mimetype !== 'image/png')
        return { statusCode: 406, error: 'Not acceptable' }
      const base64EncodingImage = Buffer.from(dto._buf).toString('base64')
      const dataUrl = `data:${dto.mimetype};base64,${base64EncodingImage}`

      const { public_id } = await this.cloudinaryUploader.uploader.upload(
        dataUrl,
        {
          folder: `${this.config.cloudinaryTargetFolder}/${folderName}`,
        }
      )
      return {
        statusCode: 200,
        data: { image_id: public_id },
      }
    } catch (error) {
      return {
        statusCode: 500,
        error: 'Internal server error',
      }
    }
  }
  public deleteCloudinaryImage = async (id: string): Promise<void> => {
    await this.cloudinaryUploader.uploader.destroy(id)
  }
  public readFormDataText = async (
    dto: MultipartContentInput
  ): Promise<ServiceResponse<string>> => {
    try {
      if (typeof dto === 'undefined')
        return { statusCode: 404, error: 'Not found' }
      if (dto.mimetype !== 'text/plain')
        return { statusCode: 406, error: 'Not acceptable' }
      return { statusCode: 200, data: dto.value }
    } catch (error) {
      return {
        statusCode: 500,
        error: 'Internal server error',
      }
    }
  }
}
