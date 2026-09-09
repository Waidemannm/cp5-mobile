# CheckPoint 4 - APP com Autenticação (Firebase Auth)

**Curso:** Tecnologia em Desenvolvimento de Sistemas - 2TDS  
**Componente Curricular:** Mobile Application Development  
**Professor:** Fernando Pinéo  
**Instituição:** FIAP  

---

## 👥 Integrantes do Grupo (até 03 integrantes)

1. **Nome:** [Nome do Integrante 1] - **RM:** [RM00000]
2. **Nome:** [Nome do Integrante 2] - **RM:** [RM00000]
3. **Nome:** [Nome do Integrante 3] - **RM:** [RM00000]

---

## 📱 Descrição do Projeto

Aplicativo mobile desenvolvido em **React Native** com integração direta ao **Firebase Authentication**, permitindo cadastro, autenticação, gerenciamento de conta, recuperação de senha e exclusão permanente de usuário, além de controle local de persistência da sessão com **AsyncStorage**.

O projeto foi construído seguindo fielmente os critérios de segurança e arquitetura lecionados na **Aula 15**, garantindo:
- **Zero armazenamento de senhas localmente** (apenas dados de sessão seguros no AsyncStorage);
- **Tratamento humanizado de erros** do Firebase para português;
- **Proteção de rotas** para usuários não autenticados;
- Interface dark mode moderna, responsiva e com suporte a teclado (`KeyboardAvoidingView`).

---

## 🛠️ Tecnologias Utilizadas

- **React Native** (v0.83.9)
- **Expo & Expo Router** (SDK ~54.0.0 / router ~6.0.0)
- **Firebase Authentication** (SDK v12.17.1 modular com `getReactNativePersistence`)
- **AsyncStorage** (`@react-native-async-storage/async-storage` v2.2.0)
- **TypeScript** (v5.9.2)

---

## 📂 Estrutura de Telas e Arquivos

```
cp4-firebase-auth/
├── app/
│   ├── _layout.tsx              # Stack de navegação global e barra de status
│   ├── index.tsx                # Tela de Login (não autenticada) + checagem de sessão
│   ├── CadastrarScreen.tsx      # Tela de Cadastro (Nome, E-mail, Senha e Confirmação)
│   ├── EsqueciSenhaScreen.tsx   # Tela de Recuperação de Senha (Firebase Password Reset)
│   └── HomeScreen.tsx           # Tela Perfil/Home (área autenticada com Logout e Exclusão)
├── assets/                      # Ícones e splash screen
├── services/
│   ├── firebaseConfig.ts        # Inicialização do Firebase Auth com AsyncStorage
│   └── authErrors.ts            # Mapeamento de códigos de erro para mensagens em português
├── app.json                     # Configurações do Expo
├── package.json                 # Dependências do projeto
└── tsconfig.json                # Configurações do TypeScript
```

---

## ⚙️ Instalação e Execução

### Pré-requisitos
- Node.js instalado (v18+)
- Celular com o app **Expo Go** instalado (Android ou iOS) OU emulador configurado.

### 1. Clonar ou Acessar a Pasta do Projeto
Abra o terminal na pasta do projeto:
```bash
cd cp4-firebase-auth
```

### 2. Instalar as Dependências
```bash
npm install
```

### 3. Iniciar o Projeto com o Expo
```bash
npx expo start
```
Após executar o comando:
- Pressione **a** para abrir no emulador Android;
- Pressione **w** para testar no navegador Web;
- Ou escaneie o **QR Code** no terminal usando o aplicativo **Expo Go** no seu smartphone.

---

## 🎥 Roteiro para Gravação do Vídeo de Apresentação

O CheckPoint exige a demonstração em vídeo dos 6 fluxos obrigatórios. Siga este roteiro passo a passo durante a gravação:

1. **Criar uma conta:**
   - Na tela de login, clique em `Cadastre-se`.
   - Preencha Nome, E-mail, Senha e confirme a senha.
   - Demonstre a validação de erro (ex: senhas diferentes ou senha menor que 6 dígitos) e depois efetue o cadastro com sucesso.

2. **Realizar login:**
   - Faça login com o e-mail e a senha criados.
   - Demonstre a mensagem de erro ao digitar credenciais inválidas.
   - Em seguida, faça o login correto e seja direcionado à tela inicial/perfil.

3. **Demonstrar persistência de sessão:**
   - Com o usuário logado na tela inicial/perfil, feche totalmente o aplicativo (force o fechamento ou dê reload no Expo).
   - Abra novamente o aplicativo.
   - Demonstre que o aplicativo identifica os dados persistidos no `AsyncStorage` e abre diretamente na área autenticada sem pedir login novamente.

4. **Realizar logout:**
   - Na tela de perfil, clique no botão `Sair da Conta` e confirme.
   - Demonstre que a sessão foi encerrada, o `AsyncStorage` foi limpo e você retornou para a tela de login.

5. **Solicitar recuperação de senha:**
   - Na tela de login, clique em `Esqueci minha senha`.
   - Digite o seu e-mail e clique em `Enviar Instruções`.
   - Demonstre o alerta com a mensagem exigida: *"Se o e-mail estiver cadastrado, você receberá as instruções para redefinir sua senha."*

6. **Excluir a conta:**
   - Faça login novamente na conta de testes.
   - Na tela de perfil, clique no botão vermelho `Excluir Conta`.
   - Demonstre o modal de confirmação: *"Tem certeza que deseja excluir sua conta? Essa ação não poderá ser desfeita."*
   - Confirme a exclusão e demonstre o retorno para a tela de login.
