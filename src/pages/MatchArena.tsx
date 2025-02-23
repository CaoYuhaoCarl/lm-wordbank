
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, X, User } from "lucide-react";

const MatchArena = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { studentNames, wordList, difficulty } = location.state || {};

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentStudent, setCurrentStudent] = useState("");
  const [score, setScore] = useState(0);
  const [results, setResults] = useState<Array<{ word: string; correct: boolean; student: string }>>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState({ correct: false, message: "" });

  useEffect(() => {
    if (!wordList || wordList.length === 0 || !studentNames || studentNames.length === 0) {
      navigate("/");
    } else {
      // Select random student for first word
      setCurrentStudent(studentNames[Math.floor(Math.random() * studentNames.length)]);
    }
  }, [wordList, studentNames, navigate]);

  const selectNextStudent = () => {
    const nextStudent = studentNames[Math.floor(Math.random() * studentNames.length)];
    setCurrentStudent(nextStudent);
  };

  const handleAnswer = async (isCorrect: boolean) => {
    setShowFeedback(true);
    const correct = isCorrect;
    
    if (correct) setScore(score + 1);
    
    setFeedback({
      correct,
      message: correct ? "Excellent!" : "Keep practicing!"
    });

    setResults([...results, { 
      word: wordList[currentWordIndex], 
      correct,
      student: currentStudent
    }]);

    setTimeout(() => {
      setShowFeedback(false);
      if (currentWordIndex < wordList.length - 1) {
        setCurrentWordIndex(currentWordIndex + 1);
        selectNextStudent();
      } else {
        navigate("/match-summary", {
          state: {
            studentNames,
            score,
            total: wordList.length,
            results: [...results, { 
              word: wordList[currentWordIndex], 
              correct,
              student: currentStudent
            }],
            difficulty
          }
        });
      }
    }, 1500);
  };

  if (!wordList || !currentStudent) return null;

  return (
    <div className="container max-w-2xl mx-auto py-12 px-4">
      <div className="space-y-8 slide-up">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-muted-foreground">
              Word {currentWordIndex + 1} of {wordList.length}
            </span>
            <span className="text-sm font-medium">
              Score: {score}/{wordList.length}
            </span>
          </div>
          <Progress value={((currentWordIndex + 1) / wordList.length) * 100} />
        </div>

        <Card className="p-8">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-2 text-muted-foreground mb-4">
              <User className="w-4 h-4" />
              <span className="font-medium">{currentStudent}</span>
            </div>
            <h2 className="text-5xl font-bold tracking-tight">
              {wordList[currentWordIndex]}
            </h2>
            {showFeedback && (
              <div className={`text-xl font-semibold ${feedback.correct ? 'text-accent' : 'text-destructive'}`}>
                {feedback.message}
              </div>
            )}
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={() => handleAnswer(false)}
            disabled={showFeedback}
          >
            <X className="w-4 h-4 mr-2" />
            Incorrect
          </Button>
          <Button
            size="lg"
            onClick={() => handleAnswer(true)}
            disabled={showFeedback}
          >
            <Check className="w-4 h-4 mr-2" />
            Correct
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MatchArena;
