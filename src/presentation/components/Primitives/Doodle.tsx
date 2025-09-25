import doodle from "@/assets/svgs/doodle.svg";
import Image from "next/image";
import { SVGProps } from "react";

type DoodleProps = SVGProps<SVGSVGElement>;

const Doodle = ({ className, ...props }: DoodleProps) => {
  return <Image fill src={doodle.src} />;
};

export default Doodle;
