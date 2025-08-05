import { Navigation } from "@/components/ui/navigation";
import { Card } from "@/components/ui/card";
import { Megaphone, Calendar, User, AlertCircle, Info, CheckCircle } from "lucide-react";

const Comunicados = () => {
  const comunicados = [
    {
      id: 1,
      title: "Manutenção dos Elevadores",
      content: "Informamos que na próxima terça-feira (23/01) será realizada a manutenção preventiva dos elevadores. O serviço será realizado das 8h às 17h. Pedimos a compreensão de todos.",
      date: "2024-01-20",
      type: "warning",
      author: "Administração"
    },
    {
      id: 2,
      title: "Nova Regra - Horário de Silêncio",
      content: "A partir de 01/02, o horário de silêncio será das 22h às 8h nos dias úteis, e das 22h às 10h nos fins de semana. Contamos com a colaboração de todos para manter um ambiente harmonioso.",
      date: "2024-01-18",
      type: "info",
      author: "Síndico"
    },
    {
      id: 3,
      title: "Assembleia Extraordinária",
      content: "Convocamos todos os condôminos para assembleia extraordinária no dia 15/02 às 19h no salão de festas. Pauta: aprovação de obras na fachada e alteração do regulamento interno.",
      date: "2024-01-15",
      type: "important",
      author: "Administração"
    },
    {
      id: 4,
      title: "Limpeza da Caixa D'água Concluída",
      content: "Informamos que a limpeza semestral da caixa d'água foi concluída com sucesso. O abastecimento está normalizado. Agradecemos a paciência de todos durante o período sem água.",
      date: "2024-01-12",
      type: "success",
      author: "Administração"
    },
    {
      id: 5,
      title: "Campanha de Economia de Energia",
      content: "Vamos juntos reduzir o consumo de energia nas áreas comuns! Lembre-se de apagar as luzes ao sair dos corredores e do salão de festas. Pequenas ações fazem grande diferença.",
      date: "2024-01-10",
      type: "info",
      author: "Comissão Verde"
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-condo-orange" />;
      case 'important':
        return <Megaphone className="h-5 w-5 text-red-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-condo-green" />;
      default:
        return <Info className="h-5 w-5 text-condo-blue" />;
    }
  };

  const getBorderColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'border-l-condo-orange';
      case 'important':
        return 'border-l-red-500';
      case 'success':
        return 'border-l-condo-green';
      default:
        return 'border-l-condo-blue';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation title="Comunicados" />
      
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-xl font-semibold">Avisos da Administração</h2>
          <p className="text-muted-foreground">
            {comunicados.length} comunicado{comunicados.length !== 1 ? 's' : ''} disponível{comunicados.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Lista de Comunicados */}
        <div className="space-y-4">
          {comunicados.map((comunicado) => (
            <Card 
              key={comunicado.id} 
              className={`p-6 shadow-card border-0 border-l-4 ${getBorderColor(comunicado.type)}`}
            >
              <div className="space-y-4">
                {/* Header do comunicado */}
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {getIcon(comunicado.type)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{comunicado.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(comunicado.date).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {comunicado.author}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Conteúdo */}
                <div className="pl-8">
                  <p className="text-foreground leading-relaxed">
                    {comunicado.content}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Footer informativo */}
        <Card className="p-6 shadow-card border-0 bg-muted/30">
          <div className="flex items-center gap-3">
            <Info className="h-5 w-5 text-condo-blue" />
            <div>
              <p className="font-medium">Fique sempre informado</p>
              <p className="text-sm text-muted-foreground">
                Os comunicados mais importantes também são enviados por notificação.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Comunicados;