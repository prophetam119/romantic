import { useCallback, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useTransform,
  type PanInfo,
} from "framer-motion";
import { DeckCard } from "../../../shared/types/content";
import { PolaroidCard } from "./PolaroidCard";
import "./CardDeck.css";

const SWIPE_OFFSET = 90;
const SWIPE_VELOCITY = 450;
const FLY_OUT = 520;

interface CardDeckProps {
  cards: DeckCard[];
}

interface SwipeableCardProps {
  card: DeckCard;
  onDismiss: (direction: 1 | -1) => void;
  canGoNext: boolean;
  canGoPrev: boolean;
}

function SwipeableCard({
  card,
  onDismiss,
  canGoNext,
  canGoPrev,
}: SwipeableCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-280, 0, 280], [-14, 0, 14]);
  const dragOpacity = useTransform(
    x,
    [-320, -160, 0, 160, 320],
    [0.55, 1, 1, 1, 0.55]
  );

  const flyOut = useCallback(
    (direction: 1 | -1) => {
      animate(x, -direction * FLY_OUT, {
        type: "spring",
        stiffness: 180,
        damping: 22,
        velocity: -direction * 600,
        onComplete: () => onDismiss(direction),
      });
    },
    [onDismiss, x]
  );

  const snapBack = useCallback(() => {
    animate(x, 0, {
      type: "spring",
      stiffness: 420,
      damping: 28,
    });
  }, [x]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const wantsNext =
      canGoNext &&
      (info.offset.x < -SWIPE_OFFSET || info.velocity.x < -SWIPE_VELOCITY);
    const wantsPrev =
      canGoPrev &&
      (info.offset.x > SWIPE_OFFSET || info.velocity.x > SWIPE_VELOCITY);

    if (wantsNext) flyOut(1);
    else if (wantsPrev) flyOut(-1);
    else snapBack();
  };

  return (
    <motion.div
      className="deck__swipe"
      style={{ x, rotate, opacity: dragOpacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.12}
      dragMomentum={false}
      onDragEnd={onDragEnd}
      whileTap={{ cursor: "grabbing" }}
    >
      <PolaroidCard card={card} />
    </motion.div>
  );
}

export function CardDeck({ cards }: CardDeckProps) {
  const [index, setIndex] = useState(0);
  const [enterKey, setEnterKey] = useState(0);

  const isFirst = index === 0;
  const isLast = index >= cards.length - 1;
  const current = cards[index];

  const handleDismiss = useCallback(
    (direction: 1 | -1) => {
      setIndex((prev) => {
        const next = prev + direction;
        if (next < 0 || next >= cards.length) return prev;
        return next;
      });
      setEnterKey((k) => k + 1);
    },
    [cards.length]
  );

  const goNext = () => {
    if (!isLast) handleDismiss(1);
  };

  const goPrev = () => {
    if (!isFirst) handleDismiss(-1);
  };

  if (!current) return null;

  const stackCards = cards.slice(index + 1, index + 3);

  return (
    <div className="deck">
      <div className="deck__progress" aria-hidden="true">
        {cards.map((card, i) => (
          <span
            key={card.id}
            className={`deck__dot ${i === index ? "deck__dot--active" : ""} ${i < index ? "deck__dot--done" : ""}`}
          />
        ))}
      </div>

      <div className="deck__stage">
        {stackCards
          .slice()
          .reverse()
          .map((card, reverseIdx) => {
            const depth = stackCards.length - reverseIdx;
            return (
              <motion.div
                key={`${card.id}-stack-${index}`}
                className="deck__stack-card"
                initial={false}
                animate={{
                  scale: 1 - depth * 0.045,
                  y: depth * 14,
                  rotate: depth * 2.5,
                  opacity: 1 - depth * 0.12,
                }}
                transition={{
                  type: "spring",
                  stiffness: 320,
                  damping: 28,
                }}
              >
                <PolaroidCard card={card} variant="stack" />
              </motion.div>
            );
          })}

        <motion.div
          key={`${index}-${enterKey}`}
          className="deck__top"
          initial={{ scale: 0.94, y: 18, opacity: 0.7 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 26,
          }}
        >
          <SwipeableCard
            card={current}
            onDismiss={handleDismiss}
            canGoNext={!isLast}
            canGoPrev={!isFirst}
          />
        </motion.div>
      </div>

      <div className="deck__footer">
        <button
          type="button"
          className="deck__btn"
          onClick={goPrev}
          disabled={isFirst}
          aria-label="Назад"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path
              d="M12.5 15L7.5 10L12.5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <span className="deck__hint">
          {isLast ? "это всё" : "свайпни или нажми →"}
        </span>

        <button
          type="button"
          className="deck__btn"
          onClick={goNext}
          disabled={isLast}
          aria-label="Дальше"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path
              d="M7.5 15L12.5 10L7.5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
