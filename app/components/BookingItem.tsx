import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const BookingItem = () => {
  return (
    <Card>
      <CardContent className="flex justify-between p-0">
        <div className="flex flex-col gap-2 p-5">
          <Badge className="bg-[#221C3D] text-primary w-fit">Confirmado</Badge>
          <h2 className="font-bold">Corte de Cabelo</h2>
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src="https://utfs.io/f/c97a2dc9-cf62-468b-a851-bfd2bdde775f-16p.png" />
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
            <h3 className="text-sm">Vintage Barber</h3>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center border-l border-solid p-5">
          <p className="text-sm ">Março</p>
          <p className="text-2xl ">06</p>
          <p className="text-sm ">15:00</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingItem;
