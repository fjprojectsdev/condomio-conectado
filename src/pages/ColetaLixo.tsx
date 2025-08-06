import { Navigation } from "@/components/ui/navigation";
import { Card } from "@/components/ui/card";
import { Trash2, Calendar, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ColetaLixo {
  id: string;
  tipo_de_lixo: string;
  dia_da_semana: string;
  created_at: string;
  updated_at: string;
}

const ColetaLixo = () => {
  const [collectionSchedule, setCollectionSchedule] = useState<ColetaLixo[]>([]);
  const [loading, setLoading] = useState(true);

  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  
  const daysOfWeek = [
    "Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"
  ];

  useEffect(() => {
    fetchColetaLixo();
  }, []);

  const fetchColetaLixo = async () => {
    try {
      const { data, error } = await supabase
        .from('coleta_lixo')
        .select('*')
        .order('dia_da_semana');

      if (error) {
        console.error('Erro ao buscar cronograma:', error);
        return;
      }

      setCollectionSchedule(data || []);
    } catch (error) {
      console.error('Erro ao buscar cronograma:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mapear dias da semana para números
  const dayMap: { [key: string]: number } = {
    "domingo": 0, "segunda": 1, "terça": 2, "quarta": 3, 
    "quinta": 4, "sexta": 5, "sábado": 6
  };

  const collectionDays = collectionSchedule.map(item => 
    dayMap[item.dia_da_semana.toLowerCase()]
  ).filter(day => day !== undefined);

  const isCollectionDay = collectionDays.includes(dayOfWeek);

  const getNextCollectionDay = () => {
    let nextDay = (dayOfWeek + 1) % 7;
    let daysUntil = 1;
    
    while (!collectionDays.includes(nextDay)) {
      nextDay = (nextDay + 1) % 7;
      daysUntil++;
      if (daysUntil > 7) break; // Evitar loop infinito
    }
    
    return { day: daysOfWeek[nextDay], daysUntil };
  };

  const nextCollection = getNextCollectionDay();

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation title="Coleta de Lixo" />
        <div className="p-6">
          <div className="text-center">Carregando cronograma...</div>
        </div>
      </div>
    );
  }

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
                  <p className="font-medium capitalize">{schedule.dia_da_semana}</p>
                  <p className="text-sm text-muted-foreground">{schedule.tipo_de_lixo}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  06:00 às 12:00
                </div>
              </div>
            ))}
          </div>

          {collectionSchedule.length === 0 && (
            <p className="text-center text-muted-foreground">
              Nenhum cronograma configurado ainda.
            </p>
          )}
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