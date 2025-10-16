import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Award, Star } from "lucide-react";
import { GameState } from "@/pages/Game";

interface GameStatsProps {
  gameState: GameState;
}

export const GameStats = ({ gameState }: GameStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card className="p-6 bg-gradient-to-br from-primary/10 to-transparent">
        <div className="flex items-center gap-4">
          <Trophy className="w-10 h-10 text-solar-orange" />
          <div>
            <p className="text-sm text-muted-foreground">Score</p>
            <p className="text-3xl font-bold text-white">{gameState.score}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-cosmic-purple/10 to-transparent">
        <div className="flex items-center gap-4">
          <Star className="w-10 h-10 text-aurora-pink" />
          <div>
            <p className="text-sm text-muted-foreground">Level</p>
            <p className="text-3xl font-bold text-white">{gameState.level}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-aurora-pink/10 to-transparent">
        <div className="flex items-center gap-4">
          <Award className="w-10 h-10 text-cosmic-purple" />
          <div>
            <p className="text-sm text-muted-foreground mb-2">Badges</p>
            <div className="flex flex-wrap gap-2">
              {gameState.badges.length === 0 ? (
                <span className="text-sm text-muted-foreground">None yet</span>
              ) : (
                gameState.badges.map((badge) => (
                  <Badge key={badge} className="bg-gradient-to-r from-solar-orange to-aurora-pink">
                    {badge}
                  </Badge>
                ))
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
