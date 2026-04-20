# ⚛️ DEVCONNECT - Elite Developer Hub

**DevConnect** é uma plataforma futurista de networking projetada para conectar talentos técnicos de alta performance. Com uma interface inspirada em terminais de alta tecnologia e estética cyberpunk/minimalista, a plataforma permite que desenvolvedores criem perfis profissionais robustos, ganhem reconhecimento através de contribuições e descubram conexões valiosas no ecossistema tech.

![Interface Futurista](https://images.unsplash.com/photo-1550439062-609e1531270e?auto=format&fit=crop&q=80&w=1200)

## 🚀 Funcionalidades de Elite

- **Autenticação Real:** Integração completa com Google Auth via Supabase para controle de identidade.
- **Hub de Comunidade (Fórum):** Espaço exclusivo para compartilhamento de códigos, dicas de cursos e discussões técnicas em tempo real.
- **Sistema de XP e Ranking:** Gamificação baseada em contribuições. Ganhe XP ao postar no fórum e suba no **Ranking Elite**.
- **Medalhas de Reconhecimento:** Sistema visual que identifica especialistas (ex: "Programador", "Mentor") e níveis de contribuição (Bronze, Prata, Ouro).
- **Cards Dinâmicos (Hover Experience):** Interface limpa e escalável onde a Tech Stack é revelada suavemente ao passar o mouse.
- **Filtros de Rede Neural:** Busca avançada por tecnologia e área de atuação com filtragem instantânea.
- **Design Cyber-Premium:** Estética de alta fidelidade com stardust effects, neon glow e glassmorphism.

## 🛠️ Stack Tecnológica

- **Frontend:** [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Estilo:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Animações:** [Framer Motion](https://www.framer.com/motion/)
- **Backend/Real-time:** [Supabase](https://supabase.com/) (Database, Auth, RLS)
- **Ícones:** [Lucide React](https://lucide.dev/)
- **Tipografia:** Plus Jakarta Sans & Inter

## 📦 Como Rodar o Projeto

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/SEU_USUARIO/dev-connect.git
   cd dev-connect
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as Variáveis de Ambiente:**
   Crie um arquivo `.env` na raiz do projeto com suas chaves:
   ```env
   VITE_SUPABASE_URL=sua_url_do_supabase
   VITE_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
   ```

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

## 🔒 Segurança e Banco de Dados (Supabase)

O projeto utiliza **Row Level Security (RLS)** no Supabase para garantir que:
- Qualquer pessoa possa visualizar os perfis.
- Apenas o usuário autenticado possa criar, editar ou excluir seu próprio perfil.

## 📄 Licença

Este projeto é open source e está disponível sob a licença MIT.

---
Desenvolvido com ⚡ por [Patricia Oliveira](https://github.com/Savarezi)
