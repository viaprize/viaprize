export const imageBucket = new sst.aws.Bucket('ImageUploads', {
  public: true,
})
