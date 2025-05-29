import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { Check, X, CheckCircle2, RotateCcw } from 'lucide-react';

export type QuizQuestion = {
  id: string;
  text: string;
  correctAnswer: boolean;
}

export type QuizProps = {
  questions: QuizQuestion[];
  title?: string;
  description?: string;
  onQuizComplete?: (passed: boolean) => void;
  onScoreChange?: (score: number, total: number) => void;
}

const Quiz: React.FC<QuizProps> = ({
  questions,
  title = "Quiz",
  description = "Select your answers to test your knowledge.",
  onQuizComplete,
  onScoreChange
}) => {
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string | null>>({});

  // Initialize quiz answers state
  useEffect(() => {
    const initialAnswers: Record<string, string | null> = {};
    questions.forEach(question => {
      initialAnswers[question.id] = null;
    });
    setQuizAnswers(initialAnswers);
  }, [questions]);

  const handleQuizToggle = (questionId: string, value: string) => {
    setQuizAnswers(prev => {
      // If the same value is already selected, keep it (don't allow toggling off)
      if (prev[questionId] === value) {
        return prev;
      }

      // Set to the new value
      const newAnswers = {
        ...prev,
        [questionId]: value
      };

      // Calculate score and check completion
      const answeredQuestions = Object.values(newAnswers).filter(answer => answer !== null).length;
      const correctAnswers = questions.filter(question =>
        isCorrectAnswer(question.id, newAnswers[question.id])
      ).length;

      // Notify parent of score changes
      if (onScoreChange) {
        onScoreChange(correctAnswers, questions.length);
      }

      // Check if quiz is complete and notify parent
      if (answeredQuestions === questions.length && onQuizComplete) {
        const passed = correctAnswers === questions.length;
        onQuizComplete(passed);
      }

      return newAnswers;
    });
  };

  const resetQuiz = () => {
    const resetAnswers: Record<string, string | null> = {};
    questions.forEach(question => {
      resetAnswers[question.id] = null;
    });
    setQuizAnswers(resetAnswers);

    // Notify parent of reset
    if (onScoreChange) {
      onScoreChange(0, questions.length);
    }
    if (onQuizComplete) {
      onQuizComplete(false);
    }
  };

  // Check if an answer is correct
  const isCorrectAnswer = (questionId: string, answer: string | null): boolean => {
    if (answer === null) return false;

    const question = questions.find(q => q.id === questionId);
    if (!question) return false;

    return answer === String(question.correctAnswer);
  };

  // Check if all questions are answered correctly
  const isQuizComplete = (): boolean => {
    return questions.every(question =>
      isCorrectAnswer(question.id, quizAnswers[question.id])
    );
  };

  // Check if all questions have been answered
  const allQuestionsAnswered = (): boolean => {
    return questions.every(question => quizAnswers[question.id] !== null);
  };

  // Calculate progress
  const answeredCount = Object.values(quizAnswers).filter(answer => answer !== null).length;
  const correctCount = questions.filter(question =>
    isCorrectAnswer(question.id, quizAnswers[question.id])
  ).length;

  return (
    <Card className="border-dialogue-neutral hover:shadow-md transition-shadow overflow-hidden bg-gradient-to-br from-white to-slate-50">
      <CardHeader className="py-4 px-6 bg-gradient-to-r from-dialogue-purple/10 to-dialogue-blue/10 border-b border-dialogue-neutral/20">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-dialogue-darkblue">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full border border-dialogue-neutral/30">
              <span className="font-medium text-dialogue-darkblue">
                {answeredCount}/{questions.length}
              </span>
            </div>
            {correctCount > 0 && (
              <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full border border-green-200">
                <span className="font-medium">
                  {correctCount} correct
                </span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="py-4 px-6">
        <div className="space-y-2">
          {questions.map((question, index) => (
            <div key={question.id} className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-dialogue-neutral/20 hover:border-dialogue-purple/30 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-dialogue-purple/10 border border-dialogue-purple/20 flex items-center justify-center text-xs font-medium text-dialogue-purple mt-0.5">
                    {index + 1}
                  </div>
                  <div className="font-medium text-dialogue-darkblue text-sm leading-relaxed">
                    {question.text}
                  </div>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <Toggle
                    pressed={quizAnswers[question.id] === "true"}
                    onPressedChange={() => handleQuizToggle(question.id, "true")}
                    variant="outline"
                    size="sm"
                    className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
                      quizAnswers[question.id] === "true"
                        ? isCorrectAnswer(question.id, "true")
                          ? "bg-green-50 border-green-300 text-green-700 hover:bg-green-100"
                          : "bg-red-50 border-red-300 text-red-700 hover:bg-red-100"
                        : "hover:bg-dialogue-neutral/50 border-dialogue-neutral/40"
                    }`}
                  >
                    <span>True</span>
                    {quizAnswers[question.id] === "true" && (
                      isCorrectAnswer(question.id, "true")
                        ? <Check className="ml-2 h-3 w-3" />
                        : <X className="ml-2 h-3 w-3" />
                    )}
                  </Toggle>

                  <Toggle
                    pressed={quizAnswers[question.id] === "false"}
                    onPressedChange={() => handleQuizToggle(question.id, "false")}
                    variant="outline"
                    size="sm"
                    className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
                      quizAnswers[question.id] === "false"
                        ? isCorrectAnswer(question.id, "false")
                          ? "bg-green-50 border-green-300 text-green-700 hover:bg-green-100"
                          : "bg-red-50 border-red-300 text-red-700 hover:bg-red-100"
                        : "hover:bg-dialogue-neutral/50 border-dialogue-neutral/40"
                    }`}
                  >
                    <span>False</span>
                    {quizAnswers[question.id] === "false" && (
                      isCorrectAnswer(question.id, "false")
                        ? <Check className="ml-2 h-3 w-3" />
                        : <X className="ml-2 h-3 w-3" />
                    )}
                  </Toggle>
                </div>
              </div>

              {quizAnswers[question.id] !== null && !isCorrectAnswer(question.id, quizAnswers[question.id]) && (
                <div className="mt-3 text-xs p-2 bg-red-50/80 text-red-800 rounded-md border border-red-200/50">
                  <p>Correct answer: <span className="font-medium">{question.correctAnswer ? "True" : "False"}</span></p>
                </div>
              )}
            </div>
          ))}
        </div>

        {isQuizComplete() && allQuestionsAnswered() && (
          <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-green-800 text-sm">Excellent work!</h4>
                <p className="text-xs text-green-700 mt-0.5">
                  You've successfully completed this knowledge check.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end mt-4 pt-3 border-t border-dialogue-neutral/20">
          <Button
            onClick={resetQuiz}
            variant="outline"
            size="sm"
            className="text-xs flex items-center gap-1.5 px-3 py-1.5 h-auto border-dialogue-neutral/40 hover:border-dialogue-purple/40 hover:bg-dialogue-neutral/30"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Quiz;
