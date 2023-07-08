import { AnimatePresence, motion } from "framer-motion";
import { type GetStaticProps, type NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import React, { useEffect, useRef } from "react";
import nextI18NextConfig from "../../next-i18next.config.js";
import Input from "../components/Input";
// import { TaskWindow } from "../components/TaskWindow";
import ExampleAgents from "../components/console/ExampleAgents";
import HelpDialog from "../components/dialog/HelpDialog";
import { SignInDialog } from "../components/dialog/SignInDialog";
// import { ToolsDialog } from "../components/dialog/ToolsDialog";
import { ChatMessage } from "../components/console/ChatMessage";
import ChatWindow from "../components/console/ChatWindow";
import FadeIn from "../components/motions/FadeIn";
import Expand from "../components/motions/expand";
import { useAgent } from "../hooks/useAgent";
import { useAuth } from "../hooks/useAuth";
import { useSettings } from "../hooks/useSettings";
import DashboardLayout from "../layout/dashboard";
import { AgentApi } from "../services/agent/agent-api";
import { DefaultAgentRunModel } from "../services/agent/agent-run-model";
import AutonomousAgent from "../services/agent/autonomous-agent";
import { MessageService } from "../services/agent/message-service";
import {
  resetAllAgentSlices,
  resetAllMessageSlices,
  useAgentStore,
  useMessageStore,
} from "../stores";
import { useAgentInputStore } from "../stores/agentInputStore";
import { resetAllTaskSlices, useTaskStore } from "../stores/taskStore";
import { toApiModelSettings } from "../utils/interfaces";
import { languages } from "../utils/languages";
import { isEmptyOrBlank } from "../utils/whitespace";

const Home: NextPage = () => {
  const { t } = useTranslation("indexPage");
  const addMessage = useMessageStore.use.addMessage();
  const messages = useMessageStore.use.messages();
  const tasks = useTaskStore.use.tasks();
  const { query } = useRouter();

  const setAgent = useAgentStore.use.setAgent();
  const agentLifecycle = useAgentStore.use.lifecycle();

  const agent = useAgentStore.use.agent();

  const fullscreen = agent !== null;
  const { session, status } = useAuth();
  const nameInput = useAgentInputStore.use.nameInput();
  const setNameInput = useAgentInputStore.use.setNameInput();
  const goalInput = useAgentInputStore.use.goalInput();
  const setGoalInput = useAgentInputStore.use.setGoalInput();
  const [chatInput, setChatInput] = React.useState("");
  const [mobileVisibleWindow, setMobileVisibleWindow] = React.useState<"Chat" | "Tasks">("Chat");
  const { settings } = useSettings();

  const [showSignInDialog, setShowSignInDialog] = React.useState(false);
  // const [showToolsDialog, setShowToolsDialog] = React.useState(false);
  const agentUtils = useAgent();

  const nameInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    nameInputRef?.current?.focus();
  }, []);

  const setAgentRun = (newName: string, newGoal: string) => {
    setNameInput(newName);
    setGoalInput(newGoal);
    handlePlay(newName, newGoal);
  };

  const disableStartAgent =
    (agent !== null && !["paused", "stopped"].includes(agentLifecycle)) ||
    isEmptyOrBlank(nameInput) ||
    isEmptyOrBlank(goalInput);

  const handlePlay = (name: string, goal: string) => {
    if (agentLifecycle === "stopped") handleRestart();
    else if (goal.trim() === "") return;
    else handleNewAgent(name.trim() || "agent", goal.trim());
  };

  const handleNewAgent = (name: string, goal: string) => {
    // if (session === null) {
    //   setShowSignInDialog(true);
    //   return;
    // }

    if (agent && agentLifecycle == "paused") {
      agent?.run().catch(console.error);
      return;
    }

    const model = new DefaultAgentRunModel(name.trim(), goal.trim());
    const messageService = new MessageService(addMessage);
    const agentApi = new AgentApi({
      model_settings: toApiModelSettings(settings, session),
      name: name,
      goal: goal,
      session,
      agentUtils: agentUtils,
    });
    const newAgent = new AutonomousAgent(
      model,
      messageService,
      settings,
      agentApi,
      session ?? undefined
    );
    setAgent(newAgent);
    newAgent?.run().then(console.log).catch(console.error);
  };

  const handleRestart = () => {
    resetAllMessageSlices();
    resetAllTaskSlices();
    resetAllAgentSlices();
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement> | React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    // Only Enter is pressed, execute the function
    if (e.key === "Enter" && !disableStartAgent && !e.shiftKey) {
      handlePlay(nameInput, goalInput);
    }
  };

  const handleVisibleWindowClick = (visibleWindow: "Chat" | "Tasks") => {
    // This controls whether the ChatWindow or TaskWindow is visible on mobile
    setMobileVisibleWindow(visibleWindow);
  };

  return (
    <DashboardLayout>
      <HelpDialog />
      {/* <ToolsDialog show={showToolsDialog} close={() => setShowToolsDialog(false)} /> */}
      <SignInDialog show={showSignInDialog} close={() => setShowSignInDialog(false)} />
      <img src="/images/Nav.png" alt="" className="w-full" />

      {fullscreen ? (
        <div
          id="content"
          className="flex w-full flex-col items-center"
          style={{
            backgroundImage: "url('/images/bg2.png')",
            backgroundColor: "#020e28",
            backgroundPosition: "right bottom",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div
            id="layout"
            className="flex h-screen w-full max-w-screen-xl flex-col items-center gap-1 p-2 sm:gap-3 sm:p-4"
          >
            <Expand className="flex h-3/5 w-full overflow-hidden">
              <ChatWindow
                messages={messages}
                visibleOnMobile={mobileVisibleWindow === "Chat"}
                chatControls={
                  agent
                    ? {
                        value: chatInput,
                        onChange: (value: string) => {
                          setChatInput(value);
                        },
                        handleChat: async () => {
                          const currentInput = chatInput;
                          setChatInput("");
                          await agent?.chat(currentInput);
                        },
                        loading: tasks.length == 0,
                      }
                    : undefined
                }
              >
                {messages.length === 0 && <ExampleAgents setAgentRun={setAgentRun} />}
                {messages.map((message, index) => {
                  return (
                    <FadeIn key={`${index}-${message.type}`}>
                      <ChatMessage message={message} />
                    </FadeIn>
                  );
                })}
              </ChatWindow>
            </Expand>
          </div>
        </div>
      ) : (
        <div
          className="flex h-screen w-full flex-col"
          style={{
            background: "url('/images/bg1.jpg') center bottom 100% no-repeat #020e28",
            backgroundSize: "contain",
          }}
        >
          <FadeIn
            delay={0}
            initialY={30}
            duration={1}
            className="flex w-full flex-col items-center"
          >
            <AnimatePresence>
              {!fullscreen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "fit-content" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.5, type: "easeInOut" }}
                  className="mt-6 flex w-1/2"
                >
                  <Input
                    disabled={agent != null}
                    value={goalInput}
                    onChange={(e) => setGoalInput(e.target.value)}
                    onKeyDown={(e) => handleKeyPress(e)}
                    placeholder="请输入您的需求"
                    type="textarea"
                  />
                  <div className="ml-5" onClick={() => handlePlay(nameInput, goalInput)}>
                    <img src="/images/Run.png" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div style={{ position: "absolute", left: "60px" }}>
              <h1 style={{ color: "#FFF", fontSize: "30px" }}>您好！</h1>
              <p style={{ color: "#FFF", fontSize: "22px" }}>我是佳佳，您的AI投研助理</p>
              <p style={{ color: "#FFF", fontSize: "18px" }}>我可以协助您：</p>
            </div>
          </FadeIn>

          {!fullscreen && (
            <div className="ml-10 mr-10 mt-16">
              <div className="flex justify-between">
                <ExampleAgents setAgentRun={setAgentRun} />
                <div>
                  <img
                    src="/images/R1.png"
                    className="w-4/5"
                    style={{ objectFit: "contain" }}
                    alt=""
                  />
                  <img
                    src="/images/R2.png"
                    className="w-4/5"
                    style={{ objectFit: "contain" }}
                    alt=""
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async ({ locale = "zh" }) => {
  const supportedLocales = languages.map((language) => language.code);
  const chosenLocale = supportedLocales.includes(locale) ? locale : "en";

  return {
    props: {
      ...(await serverSideTranslations(chosenLocale, nextI18NextConfig.ns)),
    },
  };
};
