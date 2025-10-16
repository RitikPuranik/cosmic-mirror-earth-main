import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, ChevronRight, Lock } from "lucide-react";
import { GameState } from "@/pages/Game";

interface StoryModeProps {
  onClose: () => void;
  gameState: GameState;
}

const storyChapters = [
  {
    id: 1,
    title: "The Farmer's Dilemma",
    unlockScore: 0,
    description: "Meet Sarah, a farmer whose GPS-guided tractors suddenly lose signal during harvest season.",
    content: `Sarah had been farming for 20 years, but nothing prepared her for what happened that morning. Her GPS-guided tractors started veering off course, her automated irrigation system stopped responding, and her weather sensors went dark.

"What's happening?" she thought, checking her phone. That's when she saw the alert: "M-Class Solar Flare Detected."

Space weather wasn't just a problem for astronauts anymore. The electromagnetic radiation from the Sun was disrupting the GPS signals her farm relied on. Without quick action, her entire harvest season was at risk.`,
    lesson: "Solar flares can disrupt GPS signals, affecting precision agriculture and modern farming techniques.",
  },
  {
    id: 2,
    title: "Pilot in the Aurora",
    unlockScore: 150,
    description: "Captain James faces communication blackouts while flying over the polar route.",
    content: `Captain James had flown the polar route hundreds of times, but today was different. As his aircraft crossed 70° North latitude, the radio went silent. Then the GPS started showing impossible locations.

Through the cockpit window, he could see it—the aurora borealis dancing more violently than he'd ever witnessed. Beautiful, but dangerous.

His training kicked in. Solar flare protocols. Switch to backup navigation. Maintain course manually. Alert ATC on emergency frequency. Every second counted when you're flying blind over the Arctic.`,
    lesson: "Polar routes are especially vulnerable to space weather due to Earth's magnetic field geometry, causing radio blackouts and navigation errors.",
  },
  {
    id: 3,
    title: "The Grid Manager's Nightmare",
    unlockScore: 300,
    description: "Emily must balance the power grid as geomagnetic currents threaten a cascading failure.",
    content: `Emily's screen lit up red. Multiple transformers across the northern grid were overheating. Geomagnetically induced currents—GICs—were flowing through the power lines like an invisible enemy.

She had minutes to act. Too much load on any sector, and the entire region could go dark. Hospitals, homes, businesses—millions depending on her decisions.

"Redirect power from sectors 3 and 7," she commanded. "Activate backup systems in the north. We're fighting the Sun itself today."

The solar flare might be millions of miles away, but its effects were very real, very close, and very dangerous.`,
    lesson: "Geomagnetically induced currents from solar storms can damage transformers and cause widespread power outages.",
  },
  {
    id: 4,
    title: "Astronaut's Alert",
    unlockScore: 500,
    description: "Commander Chen must protect the ISS crew from deadly solar radiation.",
    content: `"Solar flare, X-class. All crew to the shelter module. Now!"

Commander Chen's voice was calm but urgent. On the International Space Station, there's no atmosphere to protect you from solar radiation. An X-class flare meant lethal doses were minutes away.

The crew moved quickly into the most shielded section of the station, surrounded by water tanks and equipment. They would wait there until the worst passed.

Outside the small window, Earth looked peaceful and blue. But between them and that beautiful planet, a storm of high-energy particles raged through space—a reminder that humans are still vulnerable travelers in the cosmos.`,
    lesson: "Space radiation from solar flares is a major hazard for astronauts and can cause both immediate and long-term health effects.",
  },
];

export const StoryMode = ({ onClose, gameState }: StoryModeProps) => {
  const [selectedChapter, setSelectedChapter] = useState<typeof storyChapters[0] | null>(null);

  if (selectedChapter) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-space-dark via-cosmic-purple/20 to-space-dark p-4">
        <div className="container mx-auto max-w-4xl pt-8">
          <Button
            variant="ghost"
            onClick={() => setSelectedChapter(null)}
            className="mb-4"
          >
            <ChevronRight className="w-4 h-4 rotate-180 mr-2" />
            Back to Chapters
          </Button>

          <Card className="p-8">
            <div className="mb-6">
              <Badge className="mb-2">Chapter {selectedChapter.id}</Badge>
              <h2 className="text-3xl font-bold mb-4">{selectedChapter.title}</h2>
            </div>

            <div className="prose prose-invert max-w-none mb-6">
              <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                {selectedChapter.content}
              </p>
            </div>

            <Card className="p-4 bg-primary/10 border-primary">
              <h4 className="font-bold mb-2 text-primary">🧠 What You Learned:</h4>
              <p className="text-sm text-muted-foreground">{selectedChapter.lesson}</p>
            </Card>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-space-dark via-cosmic-purple/20 to-space-dark p-4">
      <div className="container mx-auto max-w-6xl pt-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Story Mode</h1>
            <p className="text-muted-foreground">
              Learn how space weather impacts different people on Earth
            </p>
          </div>
          <Button variant="outline" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Close
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {storyChapters.map((chapter) => {
            const isLocked = gameState.score < chapter.unlockScore;
            
            return (
              <Card
                key={chapter.id}
                className={`p-6 transition-all ${
                  isLocked
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer hover:scale-105 hover:border-primary"
                }`}
                onClick={() => !isLocked && setSelectedChapter(chapter)}
              >
                <div className="flex justify-between items-start mb-4">
                  <Badge variant={isLocked ? "secondary" : "default"}>
                    Chapter {chapter.id}
                  </Badge>
                  {isLocked && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Lock className="w-4 h-4" />
                      {chapter.unlockScore} pts
                    </div>
                  )}
                </div>
                
                <h3 className="text-xl font-bold mb-2">{chapter.title}</h3>
                <p className="text-muted-foreground text-sm">{chapter.description}</p>
                
                {!isLocked && (
                  <Button variant="ghost" className="mt-4 w-full" size="sm">
                    Read Story
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
