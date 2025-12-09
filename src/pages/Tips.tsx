import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { 
  Leaf, 
  Droplets, 
  Thermometer, 
  RotateCcw, 
  Apple,
  Coffee,
  Egg,
  ArrowLeft
} from 'lucide-react';

const tips = [
  {
    icon: Droplets,
    title: 'Umidade Ideal',
    description: 'Mantenha a umidade entre 50-60%. Se estiver muito seca, adicione água. Se estiver muito úmida, adicione material seco como folhas ou serragem.',
    color: 'bg-sensor-humidity/20 text-sensor-humidity',
  },
  {
    icon: Thermometer,
    title: 'Temperatura Correta',
    description: 'A temperatura ideal fica entre 55-70°C na fase ativa. Temperaturas altas indicam decomposição saudável.',
    color: 'bg-sensor-temperature/20 text-sensor-temperature',
  },
  {
    icon: RotateCcw,
    title: 'Aeração Regular',
    description: 'Revire o composto a cada 3-5 dias para garantir oxigenação adequada e acelerar o processo de decomposição.',
    color: 'bg-sensor-rotation/20 text-sensor-rotation',
  },
  {
    icon: Leaf,
    title: 'Equilíbrio de Materiais',
    description: 'Mantenha proporção de 3:1 entre materiais marrons (secos) e verdes (úmidos) para um pH equilibrado.',
    color: 'bg-accent/20 text-accent',
  },
];

const doAndDont = {
  do: [
    { icon: Apple, text: 'Frutas e vegetais' },
    { icon: Coffee, text: 'Borra de café' },
    { icon: Leaf, text: 'Folhas secas' },
    { icon: Egg, text: 'Cascas de ovos' },
  ],
  dont: [
    'Carnes e laticínios',
    'Óleos e gorduras',
    'Plantas doentes',
    'Fezes de animais domésticos',
  ],
};

const Tips: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header title="Dicas" />

      <main className="px-4 -mt-10 relative z-10">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4 text-primary hover:bg-primary/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        {/* Tips Cards */}
        <div className="space-y-4 mb-6">
          {tips.map((tip, index) => (
            <div 
              key={index}
              className="bg-card rounded-2xl p-5 shadow-card animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${tip.color}`}>
                  <tip.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-1">{tip.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{tip.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Do and Don't Section */}
        <div className="grid grid-cols-2 gap-4 animate-fade-in" style={{ animationDelay: '400ms' }}>
          {/* Do */}
          <div className="bg-accent/10 rounded-2xl p-4 border border-accent/20">
            <h4 className="font-bold text-accent mb-3 flex items-center gap-2">
              <span className="text-lg">✓</span> Pode colocar
            </h4>
            <ul className="space-y-2">
              {doAndDont.do.map((item, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-foreground">
                  <item.icon className="w-4 h-4 text-accent" />
                  {item.text}
                </li>
              ))}
            </ul>
          </div>

          {/* Don't */}
          <div className="bg-destructive/10 rounded-2xl p-4 border border-destructive/20">
            <h4 className="font-bold text-destructive mb-3 flex items-center gap-2">
              <span className="text-lg">✗</span> Evitar
            </h4>
            <ul className="space-y-2">
              {doAndDont.dont.map((item, index) => (
                <li key={index} className="text-sm text-foreground flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-destructive rounded-full" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Tips;
