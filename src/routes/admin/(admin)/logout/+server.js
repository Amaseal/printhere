import * as cookie from "cookie";

export const get = async () => {
  return new Response({
    headers: {
      "Set-Cookie": cookie.serialize("session", "", {
        path: "/",
        // this says this should have expired yesterday
        expires: new Date(0),
      }),
      location: "/admin",
    },
  });
};
