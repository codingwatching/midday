import { getBankConnectionsByTeamId } from "@midday/supabase/cached-queries";
import { Avatar, AvatarImage } from "@midday/ui/avatar";
import { Button } from "@midday/ui/button";
import { cn } from "@midday/ui/cn";
import { Icons } from "@midday/ui/icons";
import { Popover, PopoverContent, PopoverTrigger } from "@midday/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@midday/ui/tooltip";
import { differenceInDays, formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { ReconnectButton } from "./reconnect-button";

const WARNING_DAYS = 14;
const ERROR_DAYS = 7;
const DISPLAY_DAYS = 60;

export async function ConnectionStatus() {
  const bankConnections = await getBankConnectionsByTeamId();

  if (!bankConnections?.data?.length) {
    return null;
  }

  const connectionIssue = bankConnections?.data?.some((bank) =>
    Boolean(bank.connection_error),
  );

  if (connectionIssue) {
    return (
      <TooltipProvider delayDuration={70}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/settings/accounts" prefetch>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full w-8 h-8 items-center hidden md:flex"
              >
                <Icons.Error size={16} className="text-[#FF3638]" />
              </Button>
            </Link>
          </TooltipTrigger>

          <TooltipContent
            className="px-3 py-1.5 text-xs max-w-[230px]"
            sideOffset={10}
          >
            There is a connection issue with one of your banks.
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // NOTE: No connections with expire_at (Only GoCardLess)
  if (bankConnections?.data?.find((bank) => bank.expires_at === null)) {
    return null;
  }

  const hasWarningStatus = bankConnections?.data?.some(
    (bank) =>
      bank.expires_at &&
      differenceInDays(new Date(bank.expires_at), new Date()) <= WARNING_DAYS,
  );

  const hasErrorStatus = bankConnections?.data?.some(
    (bank) =>
      bank.expires_at &&
      differenceInDays(new Date(bank.expires_at), new Date()) <= ERROR_DAYS,
  );

  const shouldDisplay = bankConnections?.data?.some(
    (bank) =>
      bank.expires_at &&
      differenceInDays(new Date(bank.expires_at), new Date()) <= DISPLAY_DAYS,
  );

  if (!shouldDisplay) {
    return null;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full w-8 h-8 items-center hidden md:flex"
        >
          <Icons.Refresh
            size={16}
            className={cn(
              hasWarningStatus && "text-[#FFD02B]",
              hasErrorStatus && "text-[#FF3638]",
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[350px] mr-7" sideOffset={10}>
        {bankConnections?.data?.map((bank) => {
          const expiresInDays = bank.expires_at
            ? differenceInDays(new Date(bank.expires_at), new Date())
            : 0;

          return (
            <div
              className="flex justify-between pt-2 pb-2 items-center"
              key={bank.id}
            >
              <div className="flex items-center">
                <Avatar className="flex h-8 w-8 items-center justify-center space-y-0 border">
                  <AvatarImage src={bank.logo_url} alt={bank.name} />
                </Avatar>
                <div className="ml-4 flex flex-col">
                  <p className="text-xs font-medium leading-none mb-1">
                    {bank.name}
                  </p>

                  <span
                    className={cn(
                      "text-xs text-[#606060]",
                      expiresInDays <= WARNING_DAYS && "text-[#FFD02B]",
                      expiresInDays <= ERROR_DAYS && "text-[#FF3638]",
                    )}
                  >
                    Expires in{" "}
                    {bank.expires_at &&
                      formatDistanceToNow(new Date(bank.expires_at))}
                  </span>
                </div>
              </div>

              <div className="flex space-x-2">
                <ReconnectButton institutionId={bank.institution_id} />
              </div>
            </div>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}