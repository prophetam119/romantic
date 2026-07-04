import { useState } from "react";
import { DeckCard } from "../../../shared/types/content";
import "./PolaroidCard.css";

interface PolaroidCardProps {
  card: DeckCard;
  variant?: "default" | "stack";
}

export function PolaroidCard({ card, variant = "default" }: PolaroidCardProps) {
  const [imgError, setImgError] = useState(false);
  const showImage = Boolean(card.image) && !imgError;

  return (
    <div
      className={`polaroid ${variant === "stack" ? "polaroid--stack" : ""}`}
    >
      <div className="polaroid__frame">
        <div className="polaroid__shine" aria-hidden="true" />

        {showImage ? (
          <div className="polaroid__photo-wrap">
            <img
              src={card.image}
              alt=""
              className="polaroid__photo"
              draggable={false}
              onError={() => setImgError(true)}
            />
          </div>
        ) : (
          <div className="polaroid__text-only">
            <p className="polaroid__caption polaroid__caption--large">
              {card.caption}
            </p>
          </div>
        )}

        {showImage && (
          <p className="polaroid__caption">{card.caption}</p>
        )}

        {card.note && <p className="polaroid__note">{card.note}</p>}
      </div>
    </div>
  );
}
