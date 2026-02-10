import { useLocation } from "react-router-dom";

const BACKEND_ROUTES = [
  "/admin",
  "/creator-dashboard",
  "/embed-pro/creator-dashboard",
  "/vod-pro/creator-dashboard",
  "/podcast-pro/creator-dashboard",
  "/radio-pro/creator-dashboard",
  "/music-pro/creator-dashboard",
  "/elite-pro/creator-dashboard",
  "/supa-pro/creator-dashboard",
];

export function useIsBackendRoute(): boolean {
  const { pathname } = useLocation();
  return BACKEND_ROUTES.some((route) => pathname.startsWith(route));
}
