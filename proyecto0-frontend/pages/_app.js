import { useRouter } from "next/router";
import { useEffect } from "react";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      router.replace("/login");
    } else {
      router.replace("/");
    }
  }, []);

  return (
    <>
      <Component {...pageProps} />
      <style jsx global>{`
        html,
        body,
        body > div:first-child,
        div#__next {
          height: 100%;
        }
        body {
          margin: 0;
        }
      `}</style>
    </>
  );
}

export default MyApp;
