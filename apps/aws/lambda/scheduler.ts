import * as https from "https";

interface EventDetail {
  url: string;
}

export const handler = async (event: any) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  const url = event.detail.url as string;

  return new Promise<void>((resolve, reject) => {
    https
      .get(url, (response) => {
        let data = "";
        response.on("data", (chunk) => (data += chunk));
        response.on("end", () => {
          console.log("Response from URL:", data);
          resolve();
        });
      })
      .on("error", (error) => {
        console.error("Error fetching URL:", error);
        reject(error);
      });
  });
};
