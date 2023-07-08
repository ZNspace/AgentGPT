import { v1 } from "uuid";
import { useAgentStore } from "../../../stores";
import type { Message } from "../../../types/message";
import type { Task } from "../../../types/task";
import { processThought } from "../../stream-utils";
import type { Analysis } from "../analysis";
import type AutonomousAgent from "../autonomous-agent";
import type AgentWork from "./agent-work";
import CreateTaskWork from "./create-task-work";

export default class ExecuteTaskWork implements AgentWork {
  result = "";

  constructor(private parent: AutonomousAgent, private task: Task, private analysis: Analysis) {}

  run = async () => {
    const executionMessage: Message = {
      ...this.task,
      id: v1(),
      status: "completed",
      info: "Loading...",
    };
    this.parent.messageService.sendMessage({ ...executionMessage, status: "completed" });

    // TODO: this should be moved to the api layer
    // await streamText(
    //   "/api/agent/execute",
    //   {
    //     run_id: this.parent.api.runId,
    //     goal: this.parent.model.getGoal(),
    //     task: this.task.value,
    //     analysis: this.analysis,
    //     model_settings: toApiModelSettings(this.parent.modelSettings, this.parent.session),
    //   },
    //   this.parent.api.props.session?.accessToken || "",
    //   () => {
    //     executionMessage.info = "";
    //   },
    //   (text) => {
    //     executionMessage.info += text;
    //     this.task = this.parent.model.updateTaskResult(this.task, executionMessage.info || "");
    //     this.parent.messageService.updateMessage(executionMessage);
    //   },
    //   () => this.parent.model.getLifecycle() === "stopped"
    // );
    console.log(
      "🚀 ~ file: execute-task-work.ts:41 ~ ExecuteTaskWork ~ run= ~ executionMessage:",
      executionMessage
    );
    // const res = await this.parent.api.analyzeTask();
    // processThought(
    //   res?.thought.pop()?.thought,
    //   () => {
    //     executionMessage.info = "";
    //   },
    //   (text) => {
    //     executionMessage.info = text;
    //     this.task = this.parent.model.updateTaskResult(this.task, executionMessage.info || "");
    //     this.parent.messageService.updateMessage(executionMessage);
    //   }
    // );

    const mapTask = {};

    const timer = setInterval(async () => {
      useAgentStore.getState().setIsAgentThinking(true);
      const { thought } = await this.parent.api.analyzeTask();
      let messages: any[] = [];
      thought?.map((v) => {
        if (!mapTask[v?.thought_order]) {
          useAgentStore.getState().setIsAgentThinking(false);
          mapTask[v?.thought_order] = thought;
          processThought(
            thought.pop()?.thought,
            () => {
              executionMessage.info = "";
            },
            (text) => {
              executionMessage.info = text;
              this.task = this.parent.model.updateTaskResult(
                this.task,
                executionMessage.info || ""
              );
              this.parent.messageService.sendMessage(executionMessage);
            }
          );
          // messages.push(executionMessage);
          // this.result = executionMessage.info || "";
          // this.parent.api.saveMessages(messages);
        } else {
        }
      });
      if (thought.pop()?.agent_type === "终结者") {
        clearInterval(timer);
        this.task = this.parent.model.updateTaskStatus(this.task, "completed");
        this.parent.messageService.sendCompletedMessage();
      }
    }, 1000);
  };

  // eslint-disable-next-line @typescript-eslint/require-await
  conclude = async () => {
    this.parent.api.saveMessages([
      this.parent.messageService.sendMessage({ ...this.task, status: "final" }),
    ]);
  };

  next = () => (this.task.result ? new CreateTaskWork(this.parent, this.task) : undefined);

  onError = (e: unknown): boolean => {
    this.parent.messageService.sendErrorMessage(e);
    return true;
  };
}
