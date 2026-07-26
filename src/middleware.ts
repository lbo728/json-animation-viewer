import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Run locale negotiation for every application page, including unprefixed
  // English routes such as /guide and /blog/*. Exclude framework, API, and
  // public files that contain an extension.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
