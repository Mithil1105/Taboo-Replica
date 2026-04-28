/**
 * Play entry point.
 * Renders the mode selection screen where players choose between Pass & Play and Local Multiplayer.
 * Landing "Start Playing" CTAs link here.
 */
import { SEO } from "@/components/common/SEO";
import PlayModeSelection from "@/features/game/shared/pages/PlayModeSelection";

export default function Play() {
  return (
    <>
      <SEO
        title="Play"
        description="Start Anathema—taboo game online free. Choose Pass & Play or Local Multiplayer for the forbidden words party game."
        canonicalUrl="/play"
        keywords={[
          "taboo game online",
          "play taboo online",
          "taboo party game",
          "forbidden words game",
          "party word game",
        ]}
        type="game"
      />
      <PlayModeSelection />
    </>
  );
}
