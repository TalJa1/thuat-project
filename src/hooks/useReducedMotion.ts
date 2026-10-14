import { MQ } from "../lib/motion";
import { useMediaQuery } from "./useMediaQuery";

export function useReducedMotion(): boolean {
  return useMediaQuery(MQ.reduce);
}
