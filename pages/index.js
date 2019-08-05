import Head from "next/head";
import Link from "next/link";

function index() {
  return (
    <div>
      <Head>
        <title>My page title</title>
        <meta
          name="viewport"
          content="initial-scale=1.0, width=device-width"
          key="viewport"
        />
      </Head>
      <ul>
        <li>Home</li>
        <li>
          <Link href="/demo" as="/demo">
            <a>demo Us</a>
          </Link>
          <Link href="/post?slug=something" as="/post/something">
            <a>post Us</a>
          </Link>
        </li>
      </ul>

      <h1>THIS IS OUR HOMEPAGE.</h1>
      <p style={{ width: "30vw" }}>
        Contrary to popular belief, Lorem Ipsum is not simply random text. It
        has roots in a piece of classical Latin literature from 45 BC, making it
        over 2000 years old. Richard McClintock, a Latin professor at
        Hampden-Sydney College in Virginia, looked up one of the more obscure
        Latin words, consectetur, from a Lorem Ipsum passage, and going through
        the cites of the word in classical literature, discovered the
        undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33
        of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by
        Cicero, written in 45 BC. This book is a treatise on the theory of
        ethics, very popular during the Renaissance. The first line of Lorem
        Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section
        1.10.32.
      </p>
    </div>
  );
}

export default index;
