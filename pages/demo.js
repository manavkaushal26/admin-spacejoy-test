import Head from "next/head";
import Link from "next/link";
import { withRouter } from "next/router";
import React from "react";
import Layout from "../_components/Layout";

function Demo({ stars, isServer }) {
  return (
    <Layout>
      <Head>
        <title>My page title {isServer}</title>
        <meta
          name="viewport"
          content="initial-scale=1.0, width=device-width"
          key="viewport"
        />
      </Head>
      <div>Next stars: {stars}</div>
      <ul>
        <li>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Alias
          voluptatum, obcaecati quasi corporis reiciendis est cumque laboriosam
          autem maxime provident, doloribus, velit dignissimos. Nam porro,
          beatae quae sint corporis enim.
        </li>
        <li>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Harum
            ducimus dignissimos ipsum similique praesentium. Doloremque aperiam
            necessitatibus obcaecati voluptatibus mollitia nulla animi libero
            dolorum veniam, culpa eos tempore facilis praesentium?
          </p>
        </li>
        <li>
          <Link href="/" as="/">
            <a>home</a>
          </Link>
        </li>
        <li>
          <Link href="/post?slug=something" as="/post/something">
            <a>post Us</a>
          </Link>
        </li>
      </ul>
    </Layout>
  );
}

Demo.getInitialProps = async ({ req }) => {
  const isServer = !!req;
  // const res = await fetch("https://api.github.com/repos/zeit/next.js");
  // const json = await res.json();
  return { stars: 500, isServer };
};

export default withRouter(Demo);
