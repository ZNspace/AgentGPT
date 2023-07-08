import FadeIn from "../motions/FadeIn";
import { ExampleAgentButton } from "./ExampleAgentButton";

type ExampleAgentsProps = {
  setAgentRun?: (name: string, goal: string) => void;
};
const ExampleAgents = ({ setAgentRun }: ExampleAgentsProps) => {
  return (
    <>
      <FadeIn delay={0.9} duration={0.5}>
        <div className="flex flex-col space-y-4">
          <ExampleAgentButton
            src="/images/L1.png"
            name="写分析报告 📜"
            setAgentRun={setAgentRun}
          >
            贵州茅台Q1的业绩点评。
          </ExampleAgentButton>
          <ExampleAgentButton
            src="/images/L2.png"
            name="写分析报告 📜"
            setAgentRun={setAgentRun}
          >
            贵州茅台Q1的业绩点评。
          </ExampleAgentButton>
          <ExampleAgentButton
            src="/images/L3.png"
            name="写分析报告 📜"
            setAgentRun={setAgentRun}
          >
            贵州茅台Q1的业绩点评。
          </ExampleAgentButton>{" "}
          <ExampleAgentButton
            src="/images/L4.png"
            name="写分析报告 📜"
            setAgentRun={setAgentRun}
          >
            贵州茅台Q1的业绩点评。
          </ExampleAgentButton>{" "}
          <ExampleAgentButton
            src="/images/L5.png"
            name="写分析报告 📜"
            setAgentRun={setAgentRun}
          >
            贵州茅台Q1的业绩点评。
          </ExampleAgentButton>{" "}
          <ExampleAgentButton
            src="/images/L6.png"
            name="写分析报告 📜"
            setAgentRun={setAgentRun}
          >
            贵州茅台Q1的业绩点评。
          </ExampleAgentButton>{" "}
          <ExampleAgentButton
            src="/images/L7.png"
            name="写分析报告 📜"
            setAgentRun={setAgentRun}
          >
            贵州茅台Q1的业绩点评。
          </ExampleAgentButton>
        </div>
      </FadeIn>
    </>
  );
};

export default ExampleAgents;
