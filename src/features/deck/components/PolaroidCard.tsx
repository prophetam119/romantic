import { publicAsset } from "../../../shared/utils/publicAsset";
import { DeckCard } from "../../../shared/types/content";
import "./PolaroidCard.css";

interface PolaroidCardProps {
  card: DeckCard;
  variant?: "default" | "stack";
}

export function PolaroidCard({ card, variant = "default" }: PolaroidCardProps) {
  const imageSrc = card.image ? publicAsset(card.image) : null;
  const showImage = Boolean(imageSrc);

  return (
    <div
      className={`polaroid ${variant === "stack" ? "polaroid--stack" : ""}`}
    >
      <div className="polaroid__frame">
        <div className="polaroid__shine" aria-hidden="true" />

        {showImage && imageSrc ? (
          <div className="polaroid__photo-wrap">
            <img
              key={imageSrc}
              src={imageSrc}
              alt=""
              className="polaroid__photo"
              draggable={false}
              loading="eager"
              decoding="async"
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
