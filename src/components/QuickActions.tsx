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
      route: "/salao-festas"
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
    <Card className="mb-8 bg-white shadow-xl rounded-2xl border-0">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">Ações Rápidas</h3>
          <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
        </div>
        <div className="flex space-x-4 overflow-x-auto pb-2">
          {quickActions.map((action) => (
            <Button
              key={action.title}
              onClick={() => navigate(action.route)}
              className={`${action.color} text-white flex-shrink-0 h-14 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-semibold`}
              size="lg"
            >
              <action.icon className="h-5 w-5 mr-3" />
              {action.title}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;