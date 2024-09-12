export const imageBucket =
  $app.stage === 'prod'
    ? new sst.aws.Bucket('ImageUploads', {
        public: true,
      })
    : sst.aws.Bucket.get('ImageUploads', 'viaprize-dev-imageuploads-brehvnec')
