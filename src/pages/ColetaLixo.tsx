import { Navigation } from "@/components/ui/navigation";
import { Card } from "@/components/ui/card";
import { Trash2, Calendar, Clock } from "lucide-react";

const ColetaLixo = () => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  
  // Dias de coleta: Terça (2) e Quinta (4)
  const collectionDays = [2, 4];
  const isCollectionDay = collectionDays.includes(dayOfWeek);
  
  const daysOfWeek = [
    "Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"
  ];
  
  const collectionSchedule = [
    { day: "Terça-feira", time: "06:00 às 12:00", type: "Lixo Comum" },
    { day: "Quinta-feira", time: "06:00 às 12:00", type: "Lixo Comum" }
  ];

  const getNextCollectionDay = () => {
    let nextDay = (dayOfWeek + 1) % 7;
    let daysUntil = 1;
    
    while (!collectionDays.includes(nextDay)) {
      nextDay = (nextDay + 1) % 7;
      daysUntil++;
    }
    
    return { day: daysOfWeek[nextDay], daysUntil };
  };

  const nextCollection = getNextCollectionDay();

  return (
    <div className="min-h-screen bg-background">
      <Navigation title="Coleta de Lixo" />
      
      <div className="p-6 space-y-6">
        {/* Status Atual */}
        <Card className="p-6 shadow-card border-0">
          <div className="flex items-center gap-4 mb-4">
            <div className={`p-3 rounded-full ${isCollectionDay ? 'bg-condo-green' : 'bg-condo-gray'}`}>
              <Trash2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">
                {isCollectionDay ? "Hoje tem coleta!" : "Hoje não tem coleta"}
              </h2>
              <p className="text-muted-foreground">
                {daysOfWeek[dayOfWeek]}, {today.toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
          
          {isCollectionDay ? (
            <div className="bg-condo-green/10 p-4 rounded-lg">
              <p className="text-condo-green font-medium">
                ✅ Lembre-se de colocar o lixo para fora até às 06:00
              </p>
            </div>
          ) : (
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-muted-foreground">
                Próxima coleta: {nextCollection.day} 
                {nextCollection.daysUntil === 1 ? " (amanhã)" : ` (em ${nextCollection.daysUntil} dias)`}
              </p>
            </div>
          )}
        </Card>

        {/* Cronograma */}
        <Card className="p-6 shadow-card border-0">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="h-5 w-5 text-condo-blue" />
            <h3 className="text-lg font-semibold">Cronograma Semanal</h3>
          </div>
          
          <div className="space-y-3">
            {collectionSchedule.map((schedule, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium">{schedule.day}</p>
                  <p className="text-sm text-muted-foreground">{schedule.type}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {schedule.time}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Dicas */}
        <Card className="p-6 shadow-card border-0">
          <h3 className="text-lg font-semibold mb-4">Dicas Importantes</h3>
          <div className="space-y-3 text-sm">
            <div className="flex gap-3">
              <span className="text-condo-green">•</span>
              <p>Coloque o lixo para fora após às 20h do dia anterior</p>
            </div>
            <div className="flex gap-3">
              <span className="text-condo-green">•</span>
              <p>Use sacos resistentes e bem fechados</p>
            </div>
            <div className="flex gap-3">
              <span className="text-condo-green">•</span>
              <p>Separe o lixo reciclável quando possível</p>
            </div>
            <div className="flex gap-3">
              <span className="text-condo-green">•</span>
              <p>Não deixe lixo espalhado pelos corredores</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ColetaLixo;