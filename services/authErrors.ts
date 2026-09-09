/**
 * Utilitario para mapear codigos de erro do Firebase Authentication
 * para mensagens amigaveis e claras em portugues.
 */
export function traduzirErroFirebase(errorCode: string): string {
  switch (errorCode) {
    case "auth/invalid-email":
      return "O formato do e-mail informado e invalido.";
    case "auth/user-not-found":
      return "Nenhum usuario cadastrado com este e-mail.";
    case "auth/wrong-password":
      return "Senha incorreta. Verifique os dados e tente novamente.";
    case "auth/invalid-credential":
      return "Credenciais invalidas. Verifique seu e-mail e senha.";
    case "auth/email-already-in-use":
      return "Este e-mail ja esta em uso por outra conta.";
    case "auth/weak-password":
      return "A senha escolhida e muito fraca. Utilize ao menos 6 caracteres.";
    case "auth/too-many-requests":
      return "Muitas tentativas consecutivas. Aguarde alguns instantes e tente novamente.";
    case "auth/requires-recent-login":
      return "Por questoes de seguranca, faca login novamente antes de excluir a conta.";
    case "auth/network-request-failed":
      return "Falha na conexao. Verifique sua internet e tente novamente.";
    case "auth/user-disabled":
      return "Esta conta de usuario foi desativada.";
    default:
      return "Nao foi possivel completar a operacao. Verifique os dados e tente novamente.";
  }
}
