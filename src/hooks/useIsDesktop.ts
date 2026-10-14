import { MQ } from "../lib/motion";
import { useMediaQuery } from "./useMediaQuery";

/** True on ≥900px screens with a hovering, precise pointer (not touch). */
export function useIsDesktop(): boolean {
  return useMediaQuery(MQ.fine);
}
