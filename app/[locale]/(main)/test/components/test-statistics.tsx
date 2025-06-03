import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, Target } from "lucide-react";

interface TestStatisticsProps {
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  unanswered: number;
  score: number;
  className?: string;
}

export const TestStatistics = ({
  totalQuestions,
  correctAnswers,
  wrongAnswers,
  unanswered,
  score,
  className = "",
}: TestStatisticsProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    return "destructive";
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return "Outstanding! 🏆";
    if (score >= 80) return "Excellent! 🌟";
    if (score >= 70) return "Great Job! 👏";
    if (score >= 60) return "Good Work! 👍";
    if (score >= 50) return "Keep Practicing! 💪";
    return "Need More Study! 📚";
  };

  return (
    <Card className={className}>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl mb-2">Test Statistics</CardTitle>
        <div className={`text-5xl font-bold ${getScoreColor(score)} mb-2`}>
          {score}%
        </div>
        <Badge
          variant={getScoreBadgeVariant(score)}
          className="text-base px-3 py-1"
        >
          {getScoreMessage(score)}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-green-50 rounded-lg border">
            <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-1" />
            <div className="text-xl font-bold text-green-600">
              {correctAnswers}
            </div>
            <div className="text-xs text-gray-600">Correct</div>
          </div>

          <div className="text-center p-3 bg-red-50 rounded-lg border">
            <XCircle className="h-6 w-6 text-red-600 mx-auto mb-1" />
            <div className="text-xl font-bold text-red-600">{wrongAnswers}</div>
            <div className="text-xs text-gray-600">Wrong</div>
          </div>

          <div className="text-center p-3 bg-gray-50 rounded-lg border">
            <Clock className="h-6 w-6 text-gray-600 mx-auto mb-1" />
            <div className="text-xl font-bold text-gray-600">{unanswered}</div>
            <div className="text-xs text-gray-600">Unanswered</div>
          </div>

          <div className="text-center p-3 bg-blue-50 rounded-lg border">
            <Target className="h-6 w-6 text-blue-600 mx-auto mb-1" />
            <div className="text-xl font-bold text-blue-600">
              {totalQuestions}
            </div>
            <div className="text-xs text-gray-600">Total</div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Accuracy Rate:</span>
            <span className="font-medium">
              {totalQuestions > 0
                ? Math.round((correctAnswers / totalQuestions) * 100)
                : 0}
              %
            </span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mt-1">
            <span>Completion Rate:</span>
            <span className="font-medium">
              {totalQuestions > 0
                ? Math.round(
                    ((totalQuestions - unanswered) / totalQuestions) * 100
                  )
                : 0}
              %
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
