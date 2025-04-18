import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Prisma } from "@prisma/client";
import { format, isFuture, isPast } from "date-fns";
import { ptBR } from "date-fns/locale";

interface BookingItemProps {
  booking: Prisma.BookingsGetPayload<{
    include: {
      service: true;
      barbershop: true;
    };
  }>;
}

const BookingItem = ({ booking }: BookingItemProps) => {
  const isBookingConfirmed = isFuture(booking.date);
  return (
    <Card className="min-w-full">
      <CardContent className="flex justify-between p-0">
        <div className="flex flex-col flex-[3] gap-2 p-5">
          <Badge className="bg-[#221C3D] text-primary w-fit">
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
  );
};

export default BookingItem;
