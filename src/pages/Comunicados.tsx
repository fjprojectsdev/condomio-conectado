import { Navigation } from "@/components/ui/navigation";
import { Card } from "@/components/ui/card";
import { Megaphone, Calendar, User, AlertCircle, Info, CheckCircle } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Comunicado {
  id: string;
  titulo: string;
  mensagem: string;
  data: string;
  created_at: string;
  updated_at: string;
}

const Comunicados = () => {
  const [comunicados, setComunicados] = useState<Comunicado[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComunicados = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('comunicados')
        .select('*')
        .order('data', { ascending: false });

      if (error) {
        console.error('Erro ao buscar comunicados:', error);
        return;
      }

      setComunicados(data || []);
    } catch (error) {
      console.error('Erro ao buscar comunicados:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComunicados();
  }, [fetchComunicados]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation title="Comunicados" />
        <div className="p-6">
          <div className="text-center">Carregando comunicados...</div>
        </div>
      </div>
    );
  }

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
              className="p-6 shadow-card border-0 border-l-4 border-l-condo-blue"
            >
              <div className="space-y-4">
                {/* Header do comunicado */}
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {getIcon('info')}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{comunicado.titulo}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(comunicado.data).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        Administração
                      </div>
                    </div>
                  </div>
                </div>

                {/* Conteúdo */}
                <div className="pl-8">
                  <p className="text-foreground leading-relaxed">
                    {comunicado.mensagem}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {comunicados.length === 0 && (
          <Card className="p-8 text-center shadow-card border-0">
            <Info className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum comunicado</h3>
            <p className="text-muted-foreground">
              Não há comunicados disponíveis no momento.
            </p>
          </Card>
        )}

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