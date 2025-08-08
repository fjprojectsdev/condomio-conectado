import { Navigation } from "@/components/ui/navigation";
import { Card } from "@/components/ui/card";
import { Package, User, MapPin, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Encomenda {
  id: string;
  nome_morador: string;
  apartamento: number;
  bloco: string | null;
  descricao: string;
  recebida: boolean;
  created_at: string;
  updated_at: string;
}

const Encomendas = () => {
  const [packages, setPackages] = useState<Encomenda[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEncomendas();
  }, []);

  const fetchEncomendas = async () => {
    try {
      const { data, error } = await supabase
        .from('encomendas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar encomendas:', error);
        return;
      }

      setPackages(data || []);
    } catch (error) {
      console.error('Erro ao buscar encomendas:', error);
    } finally {
      setLoading(false);
    }
  };

  const pendingPackages = packages.filter(pkg => !pkg.recebida);
  const collectedPackages = packages.filter(pkg => pkg.recebida);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation title="Encomendas" />
        <div className="p-6">
          <div className="text-center">Carregando encomendas...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation title="Encomendas" />
      
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-xl font-semibold">Encomendas Recebidas</h2>
          <p className="text-muted-foreground">
            {pendingPackages.length} encomenda{pendingPackages.length !== 1 ? 's' : ''} aguardando retirada
          </p>
        </div>

        {/* Encomendas Pendentes */}
        {pendingPackages.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Aguardando Retirada</h3>
            {pendingPackages.map((pkg) => (
              <Card key={pkg.id} className="p-4 shadow-card border-0 border-l-4 border-l-condo-orange">
                <div className="flex items-start gap-4">
                  <div className="bg-condo-orange/10 p-3 rounded-full">
                    <Package className="h-5 w-5 text-condo-orange" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{pkg.nome_morador}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {pkg.bloco ? `Bloco ${pkg.bloco} • Apartamento ${pkg.apartamento}` : `Apartamento ${pkg.apartamento}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        Recebido em {new Date(pkg.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{pkg.descricao}</p>
                  </div>
                  <div className="bg-condo-orange/10 px-3 py-1 rounded-full">
                    <span className="text-xs font-medium text-condo-orange">Pendente</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Encomendas Retiradas */}
        {collectedPackages.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Já Retiradas</h3>
            {collectedPackages.map((pkg) => (
              <Card key={pkg.id} className="p-4 shadow-card border-0 opacity-60">
                <div className="flex items-start gap-4">
                  <div className="bg-condo-green/10 p-3 rounded-full">
                    <Package className="h-5 w-5 text-condo-green" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{pkg.nome_morador}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {pkg.bloco ? `Bloco ${pkg.bloco} • Apartamento ${pkg.apartamento}` : `Apartamento ${pkg.apartamento}`}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{pkg.descricao}</p>
                  </div>
                  <div className="bg-condo-green/10 px-3 py-1 rounded-full">
                    <span className="text-xs font-medium text-condo-green">Retirada</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {pendingPackages.length === 0 && (
          <Card className="p-8 text-center shadow-card border-0">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma encomenda pendente</h3>
            <p className="text-muted-foreground">
              Não há encomendas aguardando retirada no momento.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Encomendas;