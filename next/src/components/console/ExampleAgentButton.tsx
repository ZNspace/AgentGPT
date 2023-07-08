export const ExampleAgentButton = ({
  name,
  children,
  src,
  setAgentRun,
}: {
  name: string;
  children: string;
  src: string;
  setAgentRun?: (name: string, goal: string) => void;
}) => {
  const handleClick = () => {
    if (setAgentRun) {
      setAgentRun(name, children);
    }
  };

  return (
    <div className="h-16" onClick={handleClick}>
      <img src={src} style={{ objectFit: "contain", height: "100%" }} />
      {/* <p className="text-lg font-black">{name}</p> */}
      {/* <p className="mt-2 text-sm">{children}</p> */}
    </div>
  );
};
