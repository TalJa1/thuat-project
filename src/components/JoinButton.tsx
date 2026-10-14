import { LINKS } from "../config/links";
import { UI } from "../data/content";
import MagneticButton from "./MagneticButton";

type Props = {
  variant?: "solid" | "outline" | "light";
  size?: "md" | "lg" | "sm";
  magnetic?: boolean;
  className?: string;
  onClick?: () => void;
};

/** "Đồng hành cùng dự án": opens LINKS.join in a new tab when set, otherwise scrolls to the collection. */
export default function JoinButton(props: Props) {
  const external = LINKS.join.trim() !== "";
  return (
    <MagneticButton href={external ? LINKS.join : "#bo-suu-tap"} external={external} {...props}>
      {UI.join}
    </MagneticButton>
  );
}
