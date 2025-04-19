"use client";

import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Prisma } from "@prisma/client";
import { format, isFuture } from "date-fns";
import { fi, ptBR } from "date-fns/locale";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import Image from "next/image";
import { Button } from "./ui/button";
import { cancelBooking } from "../(home)/components/actions/cancelBooking";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

interface BookingItemProps {
  booking: Prisma.BookingsGetPayload<{
    include: {
      service: true;
      barbershop: true;
    };
  }>;
}

const BookingItem = ({ booking }: BookingItemProps) => {
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const isBookingConfirmed = isFuture(booking.date);

  const handleCancelClick = async () => {
    setIsDeleteLoading(true);
    try {
      await cancelBooking(booking.id);
      toast.success("Reserva cancelada com sucesso!");
    } catch (error) {
      console.error("Error canceling booking:", error);
    } finally {
      setIsDeleteLoading(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Card className="min-w-full">
          <CardContent className="flex justify-between p-0">
            <div className="flex flex-col flex-[3] gap-2 p-5">
              <Badge className="bg-[#221C3D] text-primary w-fit ">
                {isBookingConfirmed ? "Confirmado" : "Finalizado"}
              </Badge>
              <h2 className="font-bold">{booking.service.name}</h2>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={booking.barbershop.imageUrl} />
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
                <h3 className="text-sm">{booking.barbershop.name}</h3>
              </div>
            </div>

            <div className="flex flex-col flex-[1] items-center justify-center border-l border-solid">
              <p className="text-sm capitalize">
                {format(booking.date, "MMMM", { locale: ptBR })}
              </p>
              <p className="text-2xl ">
                {format(booking.date, "dd", { locale: ptBR })}
              </p>
              <p className="text-sm ">
                {format(booking.date, "hh:mm", { locale: ptBR })}
              </p>
            </div>
          </CardContent>
        </Card>
      </SheetTrigger>
      <SheetContent className="p-0">
        <SheetHeader className="p-5 text-left pb-6 border-b border-solid border-secondary">
          <SheetTitle>Informações da Reserva</SheetTitle>
        </SheetHeader>

        <div className="px-5">
          <div className="relative h-[180px] w-full mt-6">
            <Image src="/map.png" alt={booking.barbershop.name} fill />

            <div className="w-full absolute bottom-4 left-0 px-5">
              <Card>
                <CardContent className="p-3 flex gap-2">
                  <Avatar>
                    <AvatarImage src={booking.barbershop.imageUrl} />
                  </Avatar>

                  <div>
                    <h2 className="font-bold">{booking.barbershop.name}</h2>
                    <h3 className="text-xs overflow-hidden text-wrap text-ellipsis">
                      {booking.barbershop.address}
                    </h3>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Badge className="bg-[#221C3D] text-primary w-fit my-6">
            {isBookingConfirmed ? "Confirmado" : "Finalizado"}
          </Badge>

          <Card>
            <CardContent className="flex flex-col gap-3 p-3">
              <div className="flex justify-between">
                <h2 className="font-bold text-sm">{booking.service.name}</h2>
                <h3 className="font-bold text-sm">
                  {Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(booking.service.price)}
                </h3>
              </div>
              <div className="flex justify-between">
                <h3 className="text-sm text-gray-400">Barbearia</h3>
                <h4 className="text-sm text-gray-400">
                  {booking.barbershop.name}
                </h4>
              </div>
              <div className="flex justify-between">
                <h3 className="text-sm text-gray-400">Data</h3>
                <h4 className="text-sm text-gray-400">
                  {format(booking.date, "dd 'de' MMMM", {
                    locale: ptBR,
                  })}
                </h4>
              </div>
              <div className="flex justify-between">
                <h3 className="text-sm text-gray-400">Horário</h3>
                <h4 className="text-sm text-gray-400">
                  {format(booking.date, "hh:mm")}
                </h4>
              </div>
            </CardContent>
          </Card>
          <SheetFooter className="flex flex-row gap-3 mt-6">
            <SheetClose asChild>
              <Button variant="secondary" className="w-full">
                Voltar
              </Button>
            </SheetClose>

            <AlertDialog>
              <AlertDialogTrigger>
                <Button
                  // onClick={handleCancelClick}
                  disabled={!isBookingConfirmed || isDeleteLoading}
                  variant="destructive"
                  className="w-full"
                >
                  {isDeleteLoading && <Loader2 className="animate-spin" />}
                  Cancelar Reserva
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Deseja mesmo cancelar essa reserva?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Uma vez cancelada, você não poderá reverter essa ação.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex flex-row gap-3">
                  <AlertDialogCancel className="w-full mt-0">
                    Voltar
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleCancelClick}
                    disabled={isDeleteLoading}
                    className="w-full bg-destructive text-white"
                  >
                    {isDeleteLoading && <Loader2 className="animate-spin" />}
                    Confirmar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default BookingItem;
