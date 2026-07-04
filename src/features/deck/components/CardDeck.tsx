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

const SWIPE_OFFSET = 80;
const SWIPE_VELOCITY = 400;
const EXIT_X = 340;

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
  const rotate = useTransform(x, [-220, 0, 220], [-10, 0, 10]);

  const flyOut = useCallback(
    (direction: 1 | -1) => {
      animate(x, -direction * EXIT_X, {
        type: "tween",
        duration: 0.22,
        ease: [0.4, 0, 0.2, 1],
        onComplete: () => onDismiss(direction),
      });
    },
    [onDismiss, x]
  );

  const snapBack = useCallback(() => {
    animate(x, 0, {
      type: "tween",
      duration: 0.2,
      ease: [0.25, 0.1, 0.25, 1],
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
      style={{ x, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.08}
      dragMomentum={false}
      onDragEnd={onDragEnd}
    >
      <PolaroidCard card={card} />
    </motion.div>
  );
}

export function CardDeck({ cards }: CardDeckProps) {
  const [index, setIndex] = useState(0);

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
              <div
                key={`${card.id}-stack-${index}`}
                className="deck__stack-card"
                style={{
                  transform: `scale(${1 - depth * 0.04}) translateY(${depth * 12}px) rotate(${depth * 2}deg)`,
                  opacity: 1 - depth * 0.1,
                }}
              >
                <PolaroidCard card={card} variant="stack" />
              </div>
            );
          })}

        <div className="deck__top" key={current.id}>
          <SwipeableCard
            card={current}
            onDismiss={handleDismiss}
            canGoNext={!isLast}
            canGoPrev={!isFirst}
          />
        </div>
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
