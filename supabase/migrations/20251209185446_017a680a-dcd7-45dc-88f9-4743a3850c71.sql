-- cria a tabela profiles no esquema público para armazenar dados do perfil
CREATE TABLE public.profiles (
  -- cria coluna id do tipo UUID gera valor aleatorio automaticamente e define como chave primaria
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  -- cria coluna user_id ligada a tabela de autenticação não pode ser nula e deve ser única
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  -- cria coluna para ID do dispositivo texto livre
  device_id TEXT,
  -- cria coluna para nome de usuário texto livre
  username TEXT,
  -- cria data de criação, obrigatória com padrão sendo o momento atual now
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  -- cria data de atualização, igual a criação inicialmente
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- cria a tabela device_settings para configurações específicas
CREATE TABLE public.device_settings (
  -- ID unico gerado automaticamente
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  -- Link para o usuário dono da configuração (chave estrangeira)
  user_id UUID REFERENCES auth.users NOT NULL,
  -- Identificador do dispositivo, obrigatório
  device_id TEXT NOT NULL,
  -- Configuração de notificações (verdadeiro/falso) padrão e 'ligado' (true)
  notifications_enabled BOOLEAN DEFAULT true,
  -- Carimbo de tempo de quando foi criado
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  -- Carimbo de tempo da última atualização
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- cria a tabela 'sensor_readings' para dados recebidos dos sensores
CREATE TABLE public.sensor_readings (
  -- ID único da leitura
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  -- Identificador do dispositivo que enviou
  device_id TEXT NOT NULL,
  -- Link para o usuário dono do dispositivo
  user_id UUID REFERENCES auth.users NOT NULL,
  -- Umidade: número decimal com até 5 dígitos, sendo 2 casas decimais (ex: 100.00)
  humidity DECIMAL(5,2),
  -- Temperatura: formato decimal
  temperature DECIMAL(5,2),
  -- Umidade do solo: formato decimal
  soil_humidity DECIMAL(5,2),
  -- Nível de pH até 4 dígitos total 2 decimais 
  ph_level DECIMAL(4,2),
  -- Rotação da composteira (provavelmente em graus ou RPM): formato decimal
  composter_rotation DECIMAL(5,2),
  -- Rotação do reservatório: formato decimal
  reservoir_rotation DECIMAL(5,2),
  -- Status da capacidade (texto, ex: "Cheio", "Vazio")
  capacity_status TEXT,
  -- Data/hora exata da gravação da leitura
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- cria tabela events para histórico de ações ou alertas
CREATE TABLE public.events (
  -- ID unico do evento
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  -- Usuario associado ao evento
  user_id UUID REFERENCES auth.users NOT NULL,
  -- Dispositivo associado ao evento
  device_id TEXT NOT NULL,
  -- Tipo do evento ex: "Erro", "Aviso", "Sucesso"
  event_type TEXT NOT NULL,
  -- Descrição detalhada do evento
  description TEXT,
  -- Data do evento apenas dia/mês/ano padrão é data de hoje
  event_date DATE NOT NULL DEFAULT CURRENT_DATE,
  -- Data/hora exata de criação do registro log
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilita Row Level Security RLS na tabela profiles para restringir acesso
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
-- Habilita RLS na tabela device_settings
ALTER TABLE public.device_settings ENABLE ROW LEVEL SECURITY;
-- Habilita RLS na tabela sensor_readings
ALTER TABLE public.sensor_readings ENABLE ROW LEVEL SECURITY;
-- Habilita RLS na tabela events
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Política de Leitura: Usuário só ve o próprio perfil se ID logado == user_id da linha
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
-- Política de Inserção: Usuário só cria perfil para ele mesmo
CREATE POLICY "Users can create their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
-- Política de Atualização: usuário só altera o próprio perfil
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Política de Leitura para configurações do dispositivo
CREATE POLICY "Users can view their own settings" ON public.device_settings FOR SELECT USING (auth.uid() = user_id);
-- Política de Inserção para configurações
CREATE POLICY "Users can create their own settings" ON public.device_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
-- Política de Atualização para configurações
CREATE POLICY "Users can update their own settings" ON public.device_settings FOR UPDATE USING (auth.uid() = user_id);

-- Política de Leitura para sensores dados são privados do usuario
CREATE POLICY "Users can view their own readings" ON public.sensor_readings FOR SELECT USING (auth.uid() = user_id);
-- Política de Inserção para sensores
CREATE POLICY "Users can create their own readings" ON public.sensor_readings FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política de Leitura para eventos
CREATE POLICY "Users can view their own events" ON public.events FOR SELECT USING (auth.uid() = user_id);
-- Política de Inserção para eventos
CREATE POLICY "Users can create their own events" ON public.events FOR INSERT WITH CHECK (auth.uid() = user_id);

-- cria função reutilizável para atualizar a colunaupdated_at automaticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$ -- Início do bloco da função
BEGIN
  -- Define a coluna updated_at do novo registro NEW como o horário atual
  NEW.updated_at = now();
  -- Retorna o registro modificado
  RETURN NEW;
END;
$$ LANGUAGE plpgsql; -- define a linguagem usada PL/pgSQL

-- cria um gatilho trigger na tabela profiles
CREATE TRIGGER update_profiles_updated_at
  -- Executa ANTES de qualquer UPDATE
  BEFORE UPDATE ON public.profiles
  -- Para cada linha afetad roda a função acima
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- cria o mesmo gatilho para a tabela device_settings
CREATE TRIGGER update_device_settings_updated_at
  BEFORE UPDATE ON public.device_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- cria função para lidar com novos usuários autocriação de perfil
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insere uma linha na tabela public.profiles copiando o ID do novo usuário
  INSERT INTO public.profiles (user_id)
  VALUES (NEW.id);
  -- Retorna o registro original
  RETURN NEW;
END;
-- SECURITY DEFINER: roda com permissão de admin bypassa RLS necessário para acessar auth.users
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- cria o gatilho que dispara quando um usuário é criado no sistema de Auth
CREATE TRIGGER on_auth_user_created
  -- Dispara depois da inserção na tabela de usuários do sistema auth.users
  AFTER INSERT ON auth.users
  -- Roda a função handle_new_user para cada novo usuário
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();