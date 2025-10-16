import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Shield, Plane, Wheat, Zap, X } from "lucide-react";
import { DefenderType } from "@/pages/Game";
import { toast } from "sonner";

interface DefenderChallengeProps {
  defenderType: DefenderType;
  flareIntensity: number;
  onComplete: (defenderType: DefenderType, success: boolean) => void;
  onCancel: () => void;
}

export const DefenderChallenge = ({
  defenderType,
  flareIntensity,
  onComplete,
  onCancel,
}: DefenderChallengeProps) => {
  const [timeLeft, setTimeLeft] = useState(30);
  const [challengeProgress, setChallengeProgress] = useState(0);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const challenges = {
    satellite: {
      title: "Activate Satellite Shields",
      icon: Shield,
      description: "Drag shields to protect 5 satellites before time runs out",
      items: Array.from({ length: 8 }, (_, i) => ({ id: i, protected: false })),
      targetCount: 5,
    },
    pilot: {
      title: "Alert Pilots",
      icon: Plane,
      description: "Match alert types to affected flight routes",
      items: [
        { id: 0, alert: "Polar Route", match: "Radio Blackout" },
        { id: 1, alert: "Trans-Atlantic", match: "GPS Drift" },
        { id: 2, alert: "Pacific Cross", match: "Communication Loss" },
        { id: 3, alert: "Arctic Flight", match: "Navigation Error" },
      ],
      targetCount: 4,
    },
    farmer: {
      title: "Farm Equipment Protection",
      icon: Wheat,
      description: "Select equipment that needs immediate protection",
      items: [
        { id: 0, name: "GPS Tractors", vulnerable: true },
        { id: 1, name: "Irrigation System", vulnerable: true },
        { id: 2, name: "Manual Tools", vulnerable: false },
        { id: 3, name: "Weather Sensors", vulnerable: true },
        { id: 4, name: "Storage Barn", vulnerable: false },
        { id: 5, name: "Communication Radio", vulnerable: true },
      ],
      targetCount: 4,
    },
    "power-grid": {
      title: "Power Grid Management",
      icon: Zap,
      description: "Balance load across grid sectors to prevent outages",
      items: Array.from({ length: 6 }, (_, i) => ({ id: i, load: Math.random() * 100 })),
      targetCount: 5,
    },
  };

  const challenge = challenges[defenderType];
  const Icon = challenge.icon;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFail();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleItemClick = (itemId: number) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
      setChallengeProgress(Math.max(0, challengeProgress - (100 / challenge.targetCount)));
    } else {
      const newSelected = [...selectedItems, itemId];
      setSelectedItems(newSelected);
      const newProgress = (newSelected.length / challenge.targetCount) * 100;
      setChallengeProgress(newProgress);

      if (newSelected.length === challenge.targetCount) {
        handleSuccess();
      }
    }
  };

  const handleSuccess = () => {
    toast.success("Challenge Complete!", {
      description: `You protected Earth from the solar flare! +${Math.floor(flareIntensity * 20)} points`,
    });
    setTimeout(() => onComplete(defenderType, true), 1000);
  };

  const handleFail = () => {
    toast.error("Time's Up!", {
      description: "The solar flare caused damage. Try again!",
    });
    setTimeout(() => onComplete(defenderType, false), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-space-dark via-cosmic-purple/20 to-space-dark flex items-center justify-center p-4">
      <Card className="max-w-4xl w-full p-8 relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={onCancel}
          className="absolute top-4 right-4"
        >
          <X className="w-5 h-5" />
        </Button>

        <div className="text-center mb-6">
          <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
            <Icon className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-3xl font-bold mb-2">{challenge.title}</h2>
          <p className="text-muted-foreground">{challenge.description}</p>
        </div>

        <div className="mb-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress: {selectedItems.length}/{challenge.targetCount}</span>
            <span className="text-solar-orange font-bold">Time: {timeLeft}s</span>
          </div>
          <Progress value={challengeProgress} className="h-2" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {challenge.items.map((item) => (
            <Card
              key={item.id}
              className={`p-4 cursor-pointer transition-all hover:scale-105 ${
                selectedItems.includes(item.id)
                  ? "border-primary bg-primary/10"
                  : "hover:border-primary/50"
              }`}
              onClick={() => handleItemClick(item.id)}
            >
              <div className="text-center">
                <Icon className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm font-medium">
                  {defenderType === "satellite" && `Satellite ${item.id + 1}`}
                  {defenderType === "pilot" && (item as any).alert}
                  {defenderType === "farmer" && (item as any).name}
                  {defenderType === "power-grid" && `Sector ${item.id + 1}`}
                </p>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Click on items to select them. Complete the challenge before time runs out!
          </p>
        </div>
      </Card>
    </div>
  );
};
