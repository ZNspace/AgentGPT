import FadeIn from "../motions/FadeIn";
import { ChatMessage } from "./ChatMessage";
import { MESSAGE_TYPE_SYSTEM } from "../../types/message";
import { ExampleAgentButton } from "./ExampleAgentButton";
import React from "react";

type ExampleAgentsProps = {
  setAgentRun?: (name: string, goal: string) => void;
};
const ExampleAgents = ({ setAgentRun }: ExampleAgentsProps) => {
  return (
    <>
      <FadeIn delay={0.8} duration={0.5}>
        <ChatMessage
          message={{
            type: MESSAGE_TYPE_SYSTEM,
            value:
              "👉 Create an agent by adding a name / goal, and hitting deploy! Try our examples below!",
          }}
        />
      </FadeIn>
      <FadeIn delay={0.9} duration={0.5}>
        <div className="m-2 flex flex-col justify-between gap-2 sm:m-4 sm:flex-row">
          <ExampleAgentButton name="ResearchGPT 📜" setAgentRun={setAgentRun}>
            生成新能源行业的综合报告
          </ExampleAgentButton>
        </div>
      </FadeIn>
    </>
  );
};

export default ExampleAgents;
