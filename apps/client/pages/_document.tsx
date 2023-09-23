import Document from "next/document";
import { createGetInitialProps } from "@mantine/next";

const getInitialProps = createGetInitialProps();

export default class AppDocument extends Document {
  static getInitialProps = getInitialProps;
}
