import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, Wifi, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    newUsers: 0,
    onlineToday: 0,
    activityToday: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // 1. Total de Usuários
        const { count: totalUsersCount, error: totalUsersError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        if (totalUsersError) throw new Error(`Erro ao buscar total de usuários: ${totalUsersError.message}`);

        // 2. Novos Usuários (hoje)
        const { count: newUsersCount, error: newUsersError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', today.toISOString());
        
        if (newUsersError) throw new Error(`Erro ao buscar novos usuários: ${newUsersError.message}`);

        // 3. Online Hoje (últimas 24 horas)
        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
        const { count: onlineTodayCount, error: onlineTodayError } = await supabase
          .from('auth.users') // Querying auth schema
          .select('*', { count: 'exact', head: true })
          .gte('last_sign_in_at', twentyFourHoursAgo.toISOString());

        if (onlineTodayError) {
            console.warn("Aviso: Não foi possível buscar 'usuários online hoje'. Isso pode ser devido a políticas de RLS na tabela 'auth.users'.", onlineTodayError.message);
        }

        // 4. Atividade Hoje (mensagens no chat)
        const { count: activityTodayCount, error: activityTodayError } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', today.toISOString());

        if (activityTodayError) throw new Error(`Erro ao buscar atividade de hoje: ${activityTodayError.message}`);

        setStats({
          totalUsers: totalUsersCount || 0,
          newUsers: newUsersCount || 0,
          onlineToday: onlineTodayCount || 0,
          activityToday: activityTodayCount || 0,
        });

      } catch (error) {
        console.error("Erro ao buscar estatísticas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Registrados</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{loading ? "..." : stats.totalUsers}</div>
          <p className="text-xs text-muted-foreground">Total de usuários no sistema</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Novos Usuários (hoje)</CardTitle>
          <UserPlus className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{loading ? "..." : stats.newUsers}</div>
          <p className="text-xs text-muted-foreground">Usuários cadastrados hoje</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Online Hoje</CardTitle>
          <Wifi className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{loading ? "..." : stats.onlineToday}</div>
          <p className="text-xs text-muted-foreground">Usuários com atividade nas últimas 24h</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Atividade Hoje</CardTitle>
          <MessageCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{loading ? "..." : stats.activityToday}</div>
          <p className="text-xs text-muted-foreground">Mensagens no chat hoje</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;