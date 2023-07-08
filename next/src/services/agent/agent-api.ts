import { Session } from "next-auth";
import { v1 } from "uuid";
import type { AgentUtils } from "../../hooks/useAgent";
import { useAgentStore } from "../../stores";
import type { Message } from "../../types/message";
import type { RequestBody } from "../../utils/interfaces";
import * as apiUtils from "../api-utils";
import type { Analysis } from "./analysis";

type ApiProps = Pick<RequestBody, "model_settings" | "goal"> & {
  name: string;
  session?: Session;
  agentUtils: AgentUtils;
};

export class AgentApi {
  readonly props: ApiProps;
  agentId: string | undefined;
  runId: string | undefined;
  message_id?: string;

  constructor(apiProps: ApiProps) {
    this.props = apiProps;
  }

  async createAgent(): Promise<void> {
    if (this.agentId) return;
    const agent = await this.props.agentUtils.createAgent({
      name: this.props.name,
      goal: this.props.goal,
    });
    this.agentId = agent?.id;
  }

  saveMessages(messages: Message[]): void {
    if (!this.agentId) return;

    this.props.agentUtils.saveAgent({
      id: this.agentId,
      tasks: messages,
    });
  }

  async getInitialTasks(): Promise<string[]> {
    await this.post("/bot/investment-research/chat/v2/completions", {});
    return ["获取思维链"];
  }

  async getAdditionalTasks(
    tasks: {
      current: string;
      completed: string[];
      remaining: string[];
    },
    result: string
  ): Promise<string[]> {
    return (
      await this.post<{ thought: string[] }>("/bot/investment-research/chat/v2/completions/thought", {
        result: result,
        last_task: tasks.current,
        tasks: tasks.remaining,
        completed_tasks: tasks.completed,
      })
    ).thought;
  }

  async analyzeTask(): Promise<Analysis> {
    return await this.post<Analysis>("/bot/investment-research/chat/v2/completions/thought", {});
  }

  private async post<T>(
    url: string,
    data: Omit<RequestBody, "goal" | "model_settings" | "run_id">
  ) {
    const requestBody: RequestBody = {
      model_settings: this.props.model_settings,
      // goal: this.props.goal,
      // run_id: this.runId,
      message: this.props.goal,
      session_id: this.runId || v1().toString(),
      message_id: this.message_id,
      ...data,
    };

    try {
      useAgentStore.getState().setIsAgentThinking(true);
      const { session_id, message_id, ...data } = await apiUtils.post<
        T & { session_id: string; message_id: string }
      >(url, requestBody, this.props.session);

      if (this.runId === undefined) this.runId = session_id;
      if (this.message_id === undefined) this.message_id = message_id;
      return data;
    } finally {
      useAgentStore.getState().setIsAgentThinking(false);
    }
  }
}
