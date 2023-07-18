"use client";

import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Suspense } from "react";

function getBaseURL() {
  if (typeof window !== "undefined") {
    return "";
  }
  return "http://localhost:3000";
}

const baseURL = getBaseURL();
console.log("🚀 ~ file: page.tsx:15 ~ baseURL:", baseURL);

function useWaitQuery(props: { wait: number }) {
  const query = useQuery({
    queryKey: ["wait", props.wait],
    queryFn: async () => {
      const path = `${baseURL}/api/about?wait=${props.wait}`;
      const url = baseURL + path;
      console.log("🚀 ~ file: page.tsx:23 ~ queryFn: ~ path:", path);

      const res: string = await (
        await fetch(url, { cache: "no-store" })
      ).json();

      return res;
    },

    suspense: true,
  });

  return [query.data as string, query] as const;
}

function MyComponent(props: { wait: number }) {
  const [data] = useWaitQuery(props);

  return <div>result : {data}</div>;
}

const AboutPage = () => {
  const [isClient, setIsClient] = useState(false);

  // useEffect(() => {
  //   setIsClient(true);
  // }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Suspense fallback={<div>waiting 100...</div>}>
        <MyComponent wait={100} />
      </Suspense>
      <Suspense fallback={<div>waiting 500...</div>}>
        <MyComponent wait={500} />
      </Suspense>
      <Suspense fallback={<div>waiting 1000...</div>}>
        <MyComponent wait={1000} />
      </Suspense>
    </div>
  );
};

export default AboutPage;
