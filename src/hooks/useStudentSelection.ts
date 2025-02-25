
import { useState } from "react";
import { Student, MatchResult } from "@/types/match";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

export const useStudentSelection = (
  students: Student[],
  questionsPerStudent: number,
  score: number,
  results: MatchResult[],
  difficulty: string
) => {
  const navigate = useNavigate();
  const [studentAnswerCounts, setStudentAnswerCounts] = useState<Record<string, number>>({});
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [lastSelectedStudentId, setLastSelectedStudentId] = useState<string | null>(null);

  const announceStudent = async (student: Student) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      // Create new utterance with just the student's name
      const utterance = new SpeechSynthesisUtterance(student.name);
      utterance.rate = 0.8;
      utterance.pitch = 1;

      // Speak the name
      window.speechSynthesis.speak(utterance);
    } else {
      console.error("Browser does not support speech synthesis");
      toast({
        title: "TTS Error",
        description: "Your browser does not support text-to-speech",
        variant: "destructive",
      });
    }
  };

  const shouldEndMatch = () => {
    return students.every(student => 
      (studentAnswerCounts[student.id] || 0) >= questionsPerStudent
    );
  };

  const selectNextStudent = () => {
    if (shouldEndMatch()) {
      setCurrentStudent(null);
      return null;
    }

    // Filter out students who have completed all their questions
    const availableStudents = students.filter(student => 
      (studentAnswerCounts[student.id] || 0) < questionsPerStudent
    );

    // If there's only one student left, they must be selected regardless
    if (availableStudents.length === 1) {
      const selectedStudent = availableStudents[0];
      setCurrentStudent(selectedStudent);
      setLastSelectedStudentId(selectedStudent.id);
      announceStudent(selectedStudent);
      return selectedStudent;
    }

    // Filter out the last selected student to prevent consecutive selections
    const eligibleStudents = availableStudents.filter(
      student => student.id !== lastSelectedStudentId
    );

    // Randomly select from eligible students
    const randomIndex = Math.floor(Math.random() * eligibleStudents.length);
    const selectedStudent = eligibleStudents[randomIndex];

    if (!selectedStudent) {
      setCurrentStudent(null);
      return null;
    }

    setCurrentStudent(selectedStudent);
    setLastSelectedStudentId(selectedStudent.id);
    announceStudent(selectedStudent);

    return selectedStudent;
  };

  const updateStudentAnswerCount = (studentId: string): number => {
    let newCount = (studentAnswerCounts[studentId] || 0) + 1;
    if (newCount <= questionsPerStudent) {
      setStudentAnswerCounts(prev => ({
        ...prev,
        [studentId]: newCount
      }));
      return newCount;
    }
    return studentAnswerCounts[studentId] || 0;
  };

  return {
    currentStudent,
    selectNextStudent,
    updateStudentAnswerCount,
    studentAnswerCounts
  };
};

