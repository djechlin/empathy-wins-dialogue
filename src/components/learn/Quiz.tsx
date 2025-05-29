import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { Check, X, CheckCircle2 } from 'lucide-react';

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

  return (
    <Card className="border-dialogue-neutral hover:shadow-md transition-shadow overflow-hidden">
      <CardHeader className="py-3 px-4 bg-dialogue-neutral/10">
        <h3 className="text-lg font-medium">{title}</h3>
      </CardHeader>
      <CardContent className="py-4">
        <div className="space-y-6">
          <div className="text-sm text-muted-foreground mb-4">
            {description}
          </div>

          <div className="space-y-8">
            {questions.map((question) => (
              <div key={question.id} className="space-y-3">
                <div className="font-medium">{question.text}</div>

                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <Toggle
                      pressed={quizAnswers[question.id] === "true"}
                      onPressedChange={() => handleQuizToggle(question.id, "true")}
                      variant="outline"
                      className={`border ${
                        quizAnswers[question.id] === "true"
                          ? isCorrectAnswer(question.id, "true")
                            ? "bg-green-100 border-green-500 text-green-700"
                            : "bg-red-100 border-red-500 text-red-700"
                          : ""
                      }`}
                    >
                      <span>True</span>
                      {quizAnswers[question.id] === "true" && (
                        isCorrectAnswer(question.id, "true")
                          ? <Check className="ml-2 h-4 w-4 text-green-600" />
                          : <X className="ml-2 h-4 w-4 text-red-600" />
                      )}
                    </Toggle>
                  </div>

                  <div className="flex items-center gap-2">
                    <Toggle
                      pressed={quizAnswers[question.id] === "false"}
                      onPressedChange={() => handleQuizToggle(question.id, "false")}
                      variant="outline"
                      className={`border ${
                        quizAnswers[question.id] === "false"
                          ? isCorrectAnswer(question.id, "false")
                            ? "bg-green-100 border-green-500 text-green-700"
                            : "bg-red-100 border-red-500 text-red-700"
                          : ""
                      }`}
                    >
                      <span>False</span>
                      {quizAnswers[question.id] === "false" && (
                        isCorrectAnswer(question.id, "false")
                          ? <Check className="ml-2 h-4 w-4 text-green-600" />
                          : <X className="ml-2 h-4 w-4 text-red-600" />
                      )}
                    </Toggle>
                  </div>
                </div>

                {quizAnswers[question.id] !== null && !isCorrectAnswer(question.id, quizAnswers[question.id]) && (
                  <div className="text-sm p-2 bg-red-50 text-red-800 rounded-md">
                    <p>The correct answer is: {question.correctAnswer ? "True" : "False"}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {isQuizComplete() && allQuestionsAnswered() && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <div>
                <h4 className="font-medium text-green-800">Quiz Complete!</h4>
                <p className="text-sm text-green-700">
                  You've successfully completed this knowledge check.
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t">
            <Button
              onClick={resetQuiz}
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <X className="h-4 w-4" />
              Reset Answers
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Quiz;