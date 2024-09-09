export const imageBucket =
  $app.stage === "production"
    ? new sst.aws.Bucket("ImageUploads", {
        public: true,
      })
    : sst.aws.Bucket.get(
        "ImageUploads",
        "viaprize-dipanshu-imageuploads-rovkwxez"
      );
