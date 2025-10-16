import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Plane, Wheat, Zap, Trophy, BookOpen } from "lucide-react";
import { DefenderChallenge } from "@/components/game/DefenderChallenge";
import { StoryMode } from "@/components/game/StoryMode";
import { GameStats } from "@/components/game/GameStats";

export type DefenderType = "satellite" | "pilot" | "farmer" | "power-grid";

export interface GameState {
  score: number;
  badges: string[];
  level: number;
  completedChallenges: DefenderType[];
}

const Game = () => {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    badges: [],
    level: 1,
    completedChallenges: [],
  });
  const [selectedDefender, setSelectedDefender] = useState<DefenderType | null>(null);
  const [showStory, setShowStory] = useState(false);
  const [solarFlareActive, setSolarFlareActive] = useState(true);
  const [flareIntensity, setFlareIntensity] = useState(7.5);

  const defenders = [
    {
      type: "satellite" as DefenderType,
      name: "Satellite Shield",
      icon: Shield,
      description: "Activate shields to prevent communication blackouts",
      color: "text-blue-400",
    },
    {
      type: "pilot" as DefenderType,
      name: "Pilot Alert",
      icon: Plane,
      description: "Send alerts to pilots to reroute flights",
      color: "text-cyan-400",
    },
    {
      type: "farmer" as DefenderType,
      name: "Farm Protection",
      icon: Wheat,
      description: "Help farmers protect their equipment",
      color: "text-green-400",
    },
    {
      type: "power-grid" as DefenderType,
      name: "Grid Manager",
      icon: Zap,
      description: "Manage power grids to avoid outages",
      color: "text-yellow-400",
    },
  ];

  const handleChallengeComplete = (defenderType: DefenderType, success: boolean) => {
    if (success) {
      const points = flareIntensity >= 8 ? 150 : flareIntensity >= 5 ? 100 : 50;
      setGameState((prev) => ({
        ...prev,
        score: prev.score + points,
        completedChallenges: [...prev.completedChallenges, defenderType],
      }));

      // Check for badge awards
      const newBadges = [...gameState.badges];
      if (gameState.score + points >= 500 && !newBadges.includes("Solar Flare Expert")) {
        newBadges.push("Solar Flare Expert");
      }
      if (gameState.completedChallenges.length + 1 >= 4 && !newBadges.includes("Earth Protector")) {
        newBadges.push("Earth Protector");
      }
      
      setGameState((prev) => ({ ...prev, badges: newBadges }));
    }
    setSelectedDefender(null);
  };

  if (showStory) {
    return <StoryMode onClose={() => setShowStory(false)} gameState={gameState} />;
  }

  if (selectedDefender) {
    return (
      <DefenderChallenge
        defenderType={selectedDefender}
        flareIntensity={flareIntensity}
        onComplete={handleChallengeComplete}
        onCancel={() => setSelectedDefender(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-space-dark via-cosmic-purple/20 to-space-dark">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-solar-orange via-cosmic-purple to-aurora-pink bg-clip-text text-transparent mb-4">
            Solar Flare Defense
          </h1>
          <p className="text-muted-foreground text-lg">Protect Earth from space weather events</p>
        </div>

        <GameStats gameState={gameState} />

        {/* Solar Flare Alert */}
        {solarFlareActive && (
          <Card className="mb-8 p-6 bg-gradient-to-r from-solar-orange/20 to-cosmic-purple/20 border-solar-orange/50 animate-pulse">
            <div className="flex items-center justify-between">
              <div>
                <Badge className="mb-2 bg-solar-orange text-white">SOLAR FLARE ALERT</Badge>
                <h2 className="text-2xl font-bold text-white mb-2">M-Class Flare Detected</h2>
                <p className="text-muted-foreground">
                  Intensity: <span className="text-solar-orange font-bold">{flareIntensity.toFixed(1)}</span> | 
                  Impact ETA: <span className="text-aurora-pink font-bold">8 minutes</span>
                </p>
              </div>
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-solar-orange via-aurora-pink to-cosmic-purple animate-spin-slow" />
            </div>
          </Card>
        )}

        {/* Defender Actions */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-4 text-white">Choose Your Defense Action</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {defenders.map((defender) => {
              const Icon = defender.icon;
              const isCompleted = gameState.completedChallenges.includes(defender.type);
              
              return (
                <Card
                  key={defender.type}
                  className={`p-6 cursor-pointer transition-all hover:scale-105 hover:border-primary ${
                    isCompleted ? "opacity-50 border-green-500" : ""
                  }`}
                  onClick={() => !isCompleted && setSelectedDefender(defender.type)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg bg-background ${defender.color}`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold mb-2 text-white">{defender.name}</h4>
                      <p className="text-muted-foreground">{defender.description}</p>
                      {isCompleted && (
                        <Badge className="mt-2 bg-green-500">Completed</Badge>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-4 justify-center">
          <Button
            size="lg"
            variant="outline"
            onClick={() => setShowStory(true)}
            className="gap-2"
          >
            <BookOpen className="w-5 h-5" />
            Story Mode
          </Button>
          <Button
            size="lg"
            onClick={() => {
              setGameState({
                score: 0,
                badges: [],
                level: 1,
                completedChallenges: [],
              });
              setFlareIntensity(Math.random() * 5 + 5);
              setSolarFlareActive(true);
            }}
            className="gap-2"
          >
            <Trophy className="w-5 h-5" />
            New Challenge
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Game;
