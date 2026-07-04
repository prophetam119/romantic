import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CONTENT } from "../../shared/constants/content";
import {
  getDaysTogether,
  pluralizeDays,
} from "../../shared/utils/daysTogether";
import { CardDeck } from "./components/CardDeck";
import { DateGate } from "./components/DateGate";
import "./DeckExperience.css";

type Step = "gate" | "intro" | "deck";

export function DeckExperience() {
  const [step, setStep] = useState<Step>("gate");
  const days = getDaysTogether(CONTENT.togetherSince);

  return (
    <div className={`experience ${step === "deck" ? "experience--deck" : ""}`}>
      <AnimatePresence mode="wait">
        {step === "gate" && (
          <DateGate
            key="gate"
            config={CONTENT.gate}
            correctDate={CONTENT.togetherSince}
            onSuccess={() => setStep("intro")}
          />
        )}

        {step === "intro" && (
          <motion.button
            key="intro"
            type="button"
            className="intro"
            onClick={() => setStep("deck")}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="intro__days">
              {days} {pluralizeDays(days)}
            </span>
            <span className="intro__name">{CONTENT.herName}</span>
            <span className="intro__line">{CONTENT.introLine}</span>
            <span className="intro__tap">нажми</span>
          </motion.button>
        )}

        {step === "deck" && (
          <motion.div
            key="deck"
            className="experience__deck"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.header
              className="experience__header"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
               
            </motion.header>
            <CardDeck cards={CONTENT.cards} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
