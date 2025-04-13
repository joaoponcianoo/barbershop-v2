"use server";

import { db } from "@/app/lib/prisma";
import { endOfDay, startOfDay } from "date-fns";

export const getDayBookings = async (barbershopId: string, date: Date) => {
  const bookings = await db.bookings.findMany({
    where: {
      barbershopId: barbershopId,
      date: {
        lte: endOfDay(date),
        gte: startOfDay(date),
      },
    },
  });
  return bookings;
};
