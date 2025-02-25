
import { useState } from 'react';
import { MatchResult, Student } from '@/types/match';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const useMatchResults = () => {
  const [results, setResults] = useState<MatchResult[]>([]);
  const [showResultsPopup, setShowResultsPopup] = useState(false);
  const [isMatchComplete, setIsMatchComplete] = useState(false);

  const saveResult = async (
    student: Student,
    word: string,
    correct: boolean,
    responseTime: number,
    pointsEarned: number,
    answerNumber: number,
    difficulty: string
  ) => {
    try {
      console.log('Attempting to save match result:', {
        student_id: student.id,
        word,
        correct,
        response_time: responseTime,
        points_earned: pointsEarned,
        answer_number: answerNumber,
        difficulty
      });

      const { error, data } = await supabase
        .from('match_history')
        .insert({
          student_id: student.id,
          word,
          correct,
          response_time: Math.round(responseTime), // Convert to integer
          points_earned: Math.round(pointsEarned), // Convert to integer
          answer_number: answerNumber,
          difficulty
        });

      if (error) {
        console.error('Supabase error details:', error);
        throw error;
      }

      console.log('Match result saved successfully:', data);

      const newResult: MatchResult = {
        word,
        correct,
        student,
        responseTime,
        pointsEarned,
        answerNumber,
        answeredAt: new Date()
      };

      setResults(prev => [...prev, newResult]);
    } catch (error) {
      console.error('Error saving match result:', error);
      toast({
        title: "Error",
        description: "Failed to save match result. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    results,
    showResultsPopup,
    setShowResultsPopup,
    isMatchComplete,
    setIsMatchComplete,
    saveResult
  };
};
