import { HTMLAttributes } from "react";

const InfoBox = ({
    title,
    value,
    ...props
  }: HTMLAttributes<HTMLDivElement> & {
    title: string;
    value: string;
  }) => (
    <div
      className="flex flex-col border border-solid border-black px-1"
      {...props}
    >
      <div className="whitespace-nowrap text-center">{title}</div>
      <div className="mx-auto">{value}</div>
    </div>
  );

export default InfoBox