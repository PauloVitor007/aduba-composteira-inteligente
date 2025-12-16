-- Cria ou substitui a função 'update_updated_at_column' no esquema público
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
-- Define que a função retorna um 'TRIGGER' necessário para ser usada em gatilhos
RETURNS TRIGGER AS $$
BEGIN
  -- Atualiza o campo 'updated_at' do novo registro (NEW) com a hora atual
  NEW.updated_at = now();
  -- Retorna o registro modificado para que a operação de salvar continue
  RETURN NEW;
END;
-- define a linguagem PL/pgSQL e fixa o search_path em public para segurança evita uso de esquemas errados
$$ LANGUAGE plpgsql SET search_path = public;