# ⚛️ DEVCONNECT - Elite Developer Hub

**DevConnect** é uma plataforma futurista de networking projetada para conectar talentos técnicos de alta performance. Com uma interface inspirada em terminais de alta tecnologia e estética cyberpunk/minimalista, a plataforma permite que desenvolvedores criem perfis profissionais robustos e descubram conexões valiosas no ecossistema tech.

![Arquitetura](https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200)

## 🚀 Funcionalidades Principais

- **Autenticação Segura:** Login real integrado com Google OAuth via Supabase Auth.
- **Perfis Dinâmicos:** Criação e edição de perfis profissionais com Stack Tecnológica e links sociais.
- **Interface de Alta Performance:** UI responsiva construída com Tailwind CSS e animações fluidas via Framer Motion.
- **Banco de Dados em Tempo Real:** Integração total com Supabase para persistência de dados instantânea.
- **Filtros Avançados:** Sistema de busca e filtragem por área de atuação e tecnologia.
- **Design Futurista:** Estética "High-Tech" com efeitos neon, glassmorphism e tipografia premium.

## 🛠️ Tecnologias Utilizadas

- **Frontend:** [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Estilo:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Animações:** [Framer Motion](https://www.framer.com/motion/)
- **Backend/DB:** [Supabase](https://supabase.com/)
- **Autenticação:** [Google Cloud OAuth](https://console.cloud.google.com/)
- **Ícones:** [Lucide React](https://lucide.dev/)
- **Tipografia:** Plus Jakarta Sans & JetBrains Mono

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
