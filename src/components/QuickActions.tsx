import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, ShoppingBag, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: "Agendar Salão",
      icon: Calendar,
      color: "bg-yellow-500 hover:bg-yellow-600",
      route: "/agendamentos"
    },
    {
      title: "Novo Anúncio",
      icon: ShoppingBag,
      color: "bg-yellow-500 hover:bg-yellow-600",
      route: "/classificados"
    },
    {
      title: "Enviar Sugestão",
      icon: Lightbulb,
      color: "bg-blue-500 hover:bg-blue-600",
      route: "/caixa-sugestoes"
    }
  ];

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <h3 className="text-sm font-medium text-gray-600 mb-3">Ações Rápidas</h3>
        <div className="flex space-x-3 overflow-x-auto">
          {quickActions.map((action) => (
            <Button
              key={action.title}
              onClick={() => navigate(action.route)}
              className={`${action.color} text-white flex-shrink-0 h-12 px-4`}
              size="sm"
            >
              <action.icon className="h-4 w-4 mr-2" />
              {action.title}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;