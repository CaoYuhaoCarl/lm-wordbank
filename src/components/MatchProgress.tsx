
import { Progress } from "@/components/ui/progress";

interface MatchProgressProps {
  currentWordIndex: number;
  totalWords: number;
  score: number;
}

const MatchProgress = ({ currentWordIndex, totalWords, score }: MatchProgressProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-muted-foreground">
          Word {currentWordIndex + 1} of {totalWords}
        </span>
        <span className="text-sm font-medium">
          Score: {score}/{totalWords * 200}
        </span>
      </div>
      <Progress value={((currentWordIndex + 1) / totalWords) * 100} />
    </div>
  );
};

export default MatchProgress;
