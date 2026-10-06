# CheckPoint 5 - APP com Autenticação e Banco de Dados Firestore

**Curso:** Tecnologia em Desenvolvimento de Sistemas - 2TDS  
**Componente Curricular:** Mobile Application Development  
**Professor:** Fernando Pinéo  
**Instituição:** FIAP  

---

## 👥 Integrantes do Grupo

| Nome Completo | RM |
| :--- | :--- |
| **Gabriel Sbrana Campos** | RM 565849 |
| **Moisés Waidemann** | RM 563719 |
| **Thiago Rodrigues da Mota** | RM 563650 |
---

## 📱 Descrição do Projeto e Tema Escolhido

Aplicativo mobile desenvolvido em **React Native** dando continuidade ao CheckPoint 4. Mantivemos o **Firebase Authentication** e integramos o **Cloud Firestore** para persistência de dados em nuvem.

**Tema do Aplicativo:** Gerenciador de Tarefas 
O usuário autenticado consegue gerenciar de forma exclusiva suas próprias tarefas. As tarefas exigem os seguintes dados para serem cadastradas: **Título, Descrição, Data e Status (Pendente, Em Andamento, Concluída)**.

Os conceitos aplicados incluem:
- Autenticação e Persistência de Sessão;
- Operações CRUD completas no Cloud Firestore (Create, Read, Update, Delete);
- Estruturação de dados baseada em subcoleções (Isolamento por Usuário);
- Interface moderna, responsiva e navegação entre telas.

---

## 🛠️ Tecnologias Utilizadas

- **React Native** (v0.83.9)
- **Expo & Expo Router** (SDK ~54.0.0 / router ~6.0.0)
- **Firebase Authentication & Cloud Firestore** (SDK v12.17.1 modular)
- **AsyncStorage** (`@react-native-async-storage/async-storage` v2.2.0)
- **TypeScript** (v5.9.2)

---

## 🗄️ Estrutura Básica do Firestore

Os dados foram estruturados utilizando uma hierarquia de **Coleção -> Documento -> Subcoleção**, garantindo que cada registro seja atrelado ao `uid` exclusivo do usuário que o criou. Dessa forma, nenhum usuário tem acesso aos dados de outro.

```text
usuarios/ (coleção raiz)
└── {uid_do_usuario} (documento contendo dados do usuário autenticado)
    └── tarefas/ (subcoleção dos registros do usuário)
        ├── {id_tarefa_01}
        │   ├── titulo: "Estudar React Native"
        │   ├── descricao: "Revisar navegação e Firestore"
        │   ├── data: "20/10/2023"
        │   └── status: "Em Andamento"
        └── {id_tarefa_02}
```

---

## 📂 Estrutura de Telas e Arquivos

```
cp5-mobile/
├── app/
│   ├── _layout.tsx              # Stack de navegação global
│   ├── index.tsx                # Tela de Login 
│   ├── CadastrarScreen.tsx      # Tela de Cadastro de Usuário
│   ├── EsqueciSenhaScreen.tsx   # Tela de Recuperação de Senha
│   ├── HomeScreen.tsx           # Dashboard com os botões de atalho da Área Autenticada
│   ├── TarefasListScreen.tsx    # Tela para Listar (Read) e Excluir (Delete) registros do Firestore
│   ├── TarefaFormScreen.tsx     # Tela com formulário para Criar (Create) e Atualizar (Update) 
│   └── PerfilScreen.tsx         # Tela de Perfil/Minha Conta (Logout e Exclusão de Conta Auth)
├── services/
│   ├── firebaseConfig.ts        # Inicialização do Firebase (Auth + Firestore + Persistência)
│   └── authErrors.ts            # Mapeamento de códigos de erro
```

---

## ⚙️ Instalação e Execução

### Pré-requisitos
- Node.js instalado (v18+)
- Celular com o app **Expo Go** instalado (Android ou iOS) OU emulador configurado.

### 1. Clonar ou Acessar a Pasta do Projeto
Abra o terminal na pasta do projeto:
```bash
git clone https://github.com/SEU_USUARIO/cp5-mobile.git
cd cp5-mobile
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
