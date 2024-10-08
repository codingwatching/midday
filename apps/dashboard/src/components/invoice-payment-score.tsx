import { getI18n } from "@/locales/server";
import { getPaymentStatus } from "@midday/supabase/cached-queries";
import { Card, CardContent, CardHeader, CardTitle } from "@midday/ui/card";

export async function InvoicePaymentScore() {
  const t = await getI18n();
  const {
    data: { payment_status, score },
  } = await getPaymentStatus();

  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row justify-between">
        <CardTitle className="font-mono font-medium text-2xl">
          {t(`payment_status.${payment_status}`)}
        </CardTitle>

        <div className="flex items-end gap-[6px]">
          {[...Array(10)].map((_, index) => {
            let color: string;

            switch (payment_status) {
              case "good":
                color = "bg-green-500";
                break;
              case "average":
                color = "bg-yellow-500";
                break;
              case "bad":
                color = "bg-red-500";
                break;
              default:
                color = "bg-primary";
            }
            return (
              <div
                key={index.toString()}
                className={`w-1 ${color} h-[27px] ${index < score ? "opacity-100" : "opacity-30"}`}
              />
            );
          })}
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-2">
          <div>Payment Score</div>
          <div className="text-sm text-muted-foreground">
            {t(`payment_status_description.${payment_status}`)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}