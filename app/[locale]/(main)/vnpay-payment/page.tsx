import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PaymentResultProps {
  searchParams: {
    vnp_Amount?: string;
    vnp_BankCode?: string;
    vnp_BankTranNo?: string;
    vnp_CardType?: string;
    vnp_OrderInfo?: string;
    vnp_PayDate?: string;
    vnp_ResponseCode?: string;
    vnp_TransactionNo?: string;
    vnp_TransactionStatus?: string;
    vnp_TxnRef?: string;
  };
}

export default function VNPayPayment({ searchParams }: PaymentResultProps) {
  const isSuccess = searchParams.vnp_TransactionStatus === "00";
  const amount = Number(searchParams.vnp_Amount) / 100;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    const hour = dateString.substring(8, 10);
    const minute = dateString.substring(10, 12);
    const second = dateString.substring(12, 14);
    return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto max-w-2xl">
        <Card className="shadow-xl border-2 dark:border-gray-700">
          <CardHeader className="space-y-6 pb-8">
            <div className="flex justify-center">
              <div
                className={cn(
                  "w-20 h-20 rounded-full flex items-center justify-center",
                  isSuccess
                    ? "bg-green-100 dark:bg-green-900/30"
                    : "bg-red-100 dark:bg-red-900/30"
                )}
              >
                {isSuccess ? (
                  <CheckCircle2 className="h-12 w-12 text-green-500 dark:text-green-400" />
                ) : (
                  <XCircle className="h-12 w-12 text-red-500 dark:text-red-400" />
                )}
              </div>
            </div>
            <div className="text-center space-y-2">
              <CardTitle className="text-2xl font-bold">
                {isSuccess ? "Payment Successful!" : "Payment Failed"}
              </CardTitle>
              <CardDescription className="text-base">
                {isSuccess
                  ? "Thank you! Your payment has been processed successfully."
                  : "We apologize, there was an issue processing your payment."}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-slate-50 dark:bg-gray-800/50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-center mb-2 text-primary">
                {amount.toLocaleString()} VND
              </div>
              <div className="text-sm text-center text-muted-foreground">
                Total Amount Paid
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Bank
                </p>
                <p className="font-semibold">{searchParams.vnp_BankCode}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Card Type
                </p>
                <p className="font-semibold">{searchParams.vnp_CardType}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Transaction Date
                </p>
                <p className="font-semibold">
                  {formatDate(searchParams.vnp_PayDate)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Transaction No.
                </p>
                <p className="font-semibold">
                  {searchParams.vnp_TransactionNo}
                </p>
              </div>
              <div className="col-span-2 space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Bank Transaction No.
                </p>
                <p className="font-semibold">{searchParams.vnp_BankTranNo}</p>
              </div>
              <div className="col-span-2 space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Order Info
                </p>
                <p className="font-semibold break-all">
                  {searchParams.vnp_OrderInfo}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pt-6">
            <Link href="/learn" className="w-full">
              <Button
                size="lg"
                className={cn("w-full gap-2 text-base font-medium")}
                variant={isSuccess ? "default" : "outline"}
              >
                <ArrowLeft className="h-5 w-5" />
                Return to Learning
              </Button>
            </Link>
            {!isSuccess && (
              <p className="text-sm text-center text-muted-foreground">
                If you continue to experience issues, please contact our support
                team.
              </p>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
