"use client";

import { useTrackerParams } from "@/hooks/use-tracker-params";
import { Drawer, DrawerContent } from "@midday/ui/drawer";
import { useMediaQuery } from "@midday/ui/hooks";
import { Sheet, SheetContent } from "@midday/ui/sheet";
import React from "react";
import { TrackerSchedule } from "../tracker-schedule";

export function TrackerScheduleSheet() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { setParams, projectId, range, selectedDate } = useTrackerParams();

  const isOpen = Boolean(projectId || range?.length === 2 || selectedDate);

  if (isDesktop) {
    return (
      <Sheet
        open={isOpen}
        onOpenChange={() =>
          setParams({ projectId: null, range: null, selectedDate: null })
        }
      >
        <SheetContent>
          <TrackerSchedule />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) {
          setParams({ projectId: null, range: null, selectedDate: null });
        }
      }}
    >
      <DrawerContent>
        <TrackerSchedule />
      </DrawerContent>
    </Drawer>
  );
}