"use client";

import { Button } from "@/app/components/ui/button";
import { Calendar } from "@/app/components/ui/calendar";
import { Card, CardContent } from "@/app/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/components/ui/sheet";
import { BarbershopServices, Bookings } from "@prisma/client";
import { Barbershops } from "@prisma/client";
import { ptBR } from "date-fns/locale";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { generateDayTimeList } from "../utils/hours";
import format from "date-fns/format";
import { set, setHours, setMinutes, sub } from "date-fns";
import { saveBooking } from "../actions/saveBooking";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getDayBookings } from "../actions/getDayBookings";

interface ServiceItemProps {
  service: BarbershopServices;
  barbershop: Barbershops;
  isAuthenticated: boolean;
}

const ServiceItem = ({
  service,
  barbershop,
  isAuthenticated,
}: ServiceItemProps) => {
  const router = useRouter();
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [sheetIsOpen, setSheetIsOpen] = useState(false);
  const { data } = useSession();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [hour, setHour] = useState<String | undefined>();
  const [dayBookings, setDayBookings] = useState<Bookings[]>([]);

  useEffect(() => {
    if (!date) {
      return;
    }

    const refreshAvaliableHours = async () => {
      const _dayBookings = await getDayBookings(barbershop.id, date);
      setDayBookings(_dayBookings);
    };

    refreshAvaliableHours();
  }, [date, barbershop.id]);

  const handleDateClick = (date: Date | undefined) => {
    setDate(date);
    setHour(undefined);
  };

  const hancleHourClick = (time: string) => {
    setHour(time);
  };

  const handleBookingClick = () => {
    if (!isAuthenticated) {
      return signIn("google");
    }
  };

  const handleBookingSubmit = async () => {
    setIsSubmitLoading(true);
    try {
      if (!date || !hour || !data?.user) {
        return;
      }

      const dateHour = Number(hour.split(":")[0]);
      const dateMinutes = Number(hour.split(":")[1]);
      console.log(dateHour);
      console.log(dateMinutes);
      const newDate = setMinutes(setHours(date, dateHour), dateMinutes);
      console.log(newDate);

      await saveBooking({
        barbershopId: barbershop.id,
        serviceId: service.id,
        date: newDate,
        userId: (data.user as any).id,
      });

      setSheetIsOpen(false);
      setDate(undefined);
      setHour(undefined);
      toast("Reserva realizada com sucesso!", {
        description: format(newDate, "'Para 'dd 'de' MMMM 'às' HH':'mm'.'", {
          locale: ptBR,
        }),
        action: {
          label: "Visualizar",
          onClick: () => router.push("/bookings"),
        },
      });
    } catch (error) {
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const timeList = useMemo(() => {
    if (!date) {
      return [];
    }

    return generateDayTimeList(date).filter((time: string) => {
      // time: "09:00"
      // se houver alguma reserva em "dayBookings" com a hora e minutos igual ao time

      const timeHour = Number(time.split(":")[0]);
      const timeMinutes = Number(time.split(":")[1]);

      const booking = dayBookings.find((booking) => {
        const bookingHour = booking.date.getHours();
        const bookingMinutes = booking.date.getMinutes();

        return bookingHour === timeHour && bookingMinutes === timeMinutes;
      });

      if (!booking) {
        return true;
      }

      return false;
    });
  }, [date, dayBookings]);

  return (
    <Card>
      <CardContent className="p-3">
        <div className="flex gap-4 items-center w-full">
          <div className="relative min-h-[110px] min-w-[110px] max-h-[110px] max-w-[110px]">
            <Image
              src={service.imageUrl}
              alt={service.name}
              fill
              style={{ objectFit: "contain" }}
              className="rounded-lg"
            />
          </div>

          <div className="flex flex-col w-full">
            <h2 className="font-bold">{service.name}</h2>
            <p className="text-sm text-gray-400">{service.description}</p>

            <div className="flex items-center justify-between mt-3">
              <p className="text-primary text-sm font-bold ">
                {Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(service.price)}
              </p>
              <Sheet open={sheetIsOpen} onOpenChange={setSheetIsOpen}>
                <SheetTrigger asChild>
                  <Button
                    onClick={handleBookingClick}
                    variant="secondary"
                    className="text-white mt-3"
                  >
                    Agendar
                  </Button>
                </SheetTrigger>
                <SheetContent className="p-0">
                  <SheetHeader className="border-b border-solid border-secondary p-5">
                    <SheetTitle>Fazer Reserva</SheetTitle>
                  </SheetHeader>
                  <div className="py-4">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={handleDateClick}
                      fromDate={new Date()}
                      locale={ptBR}
                      styles={{
                        head_cell: {
                          width: "100%",
                          textTransform: "capitalize",
                        },
                        cell: {
                          width: "100%",
                        },
                        button: {
                          width: "100%",
                        },
                        nav_button_previous: {
                          width: "32px",
                          height: "32px",
                        },
                        nav_button_next: {
                          width: "32px",
                          height: "32px",
                        },
                        caption: {
                          textTransform: "capitalize",
                        },
                      }}
                    />
                  </div>

                  {date && (
                    <div className="flex gap-3 overflow-x-auto py-6 px-5 border-y border-solid border-secondary [&::-webkit-scrollbar]:hidden">
                      {timeList.map((time) => (
                        <Button
                          onClick={() => hancleHourClick(time)}
                          key={time}
                          variant={hour === time ? "default" : "secondary"}
                          className="mb-2 text-white"
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  )}

                  <div className="py-6 px-5">
                    <Card>
                      <CardContent className="flex flex-col gap-3 p-3">
                        <div className="flex justify-between">
                          <h2 className="font-bold text-sm">{service.name}</h2>
                          <h3 className="font-bold text-sm">
                            {Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(service.price)}
                          </h3>
                        </div>
                        <div className="flex justify-between">
                          <h3 className="text-sm text-gray-400">Barbearia</h3>
                          <h4 className="text-sm text-gray-400">
                            {barbershop.name}
                          </h4>
                        </div>
                        {date && (
                          <div className="flex justify-between">
                            <h3 className="text-sm text-gray-400">Data</h3>
                            <h4 className="text-sm text-gray-400">
                              {format(date, "dd 'de' MMMM", {
                                locale: ptBR,
                              })}
                            </h4>
                          </div>
                        )}
                        {hour && (
                          <div className="flex justify-between">
                            <h3 className="text-sm text-gray-400">Horário</h3>
                            <h4 className="text-sm text-gray-400">{hour}</h4>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                  <SheetFooter className="px-5">
                    <Button
                      onClick={handleBookingSubmit}
                      variant="default"
                      disabled={!hour || !date || isSubmitLoading}
                      className="text-white w-full"
                    >
                      {isSubmitLoading && <Loader2 className="animate-spin" />}
                      Confirmar Reserva
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceItem;
