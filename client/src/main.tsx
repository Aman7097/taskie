import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./router/router.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId="489195454771-8k3ddoduoaakqlv47nqq21q971t2s02i.apps.googleusercontent.com">
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  </GoogleOAuthProvider>
);
