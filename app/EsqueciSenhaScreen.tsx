import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from "react-native";
import { useRouter, Link } from "expo-router";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../services/firebaseConfig";
import { traduzirErroFirebase } from "../services/authErrors";

export default function EsqueciSenhaScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [carregando, setCarregando] = useState(false);

  // Validacao basica de formato de e-mail
  const validarFormatoEmail = (emailStr: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailStr);
  };

  // Funcao de recuperacao de senha (Requisito 3.5)
  const handleRecuperarSenha = async () => {
    const emailLimpo = email.trim();

    if (!emailLimpo) {
      Alert.alert("Campo Obrigatorio", "Por favor, informe seu e-mail para recuperar a senha.");
      return;
    }

    if (!validarFormatoEmail(emailLimpo)) {
      Alert.alert("E-mail Invalido", "Por favor, digite um formato de e-mail valido.");
      return;
    }

    setCarregando(true);

    try {
      await sendPasswordResetEmail(auth, emailLimpo);

      // Mensagem conforme orientacoes do documento do CheckPoint:
      Alert.alert(
        "Recuperacao de Senha",
        "Se o e-mail estiver cadastrado, voce recebera as instrucoes para redefinir sua senha.",
        [
          {
            text: "Voltar ao Login",
            onPress: () => router.replace("/")
          }
        ]
      );
    } catch (error: any) {
      console.error("Erro ao enviar redefinicao de senha:", error);
      const mensagem = traduzirErroFirebase(error?.code || "");
      Alert.alert("Falha na Solicitacao", mensagem);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          {/* Cabecalho */}
          <Text style={styles.badge}>Recuperacao</Text>
          <Text style={styles.titulo}>Esqueci minha senha</Text>
          <Text style={styles.subtitulo}>
            Informe o e-mail associado a sua conta para receber as instrucoes de redefinicao.
          </Text>

          {/* Campo E-mail */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>E-mail cadastrado</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu e-mail"
              placeholderTextColor="#777"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Botao Enviar */}
          <TouchableOpacity
            style={[styles.botao, carregando && styles.botaoDesabilitado]}
            onPress={handleRecuperarSenha}
            disabled={carregando}
          >
            {carregando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.textoBotao}>Enviar Instrucoes</Text>
            )}
          </TouchableOpacity>

          {/* Voltar ao Login */}
          <View style={styles.footer}>
            <Link href="/" asChild>
              <TouchableOpacity style={styles.voltarBotao}>
                <Text style={styles.voltarTexto}>← Voltar para o Login</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1
  },
  container: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    padding: 24
  },
  badge: {
    color: "#00B37E",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    textAlign: "center",
    letterSpacing: 1.5,
    marginBottom: 6
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center"
  },
  subtitulo: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginBottom: 28,
    lineHeight: 20
  },
  inputGroup: {
    marginBottom: 20
  },
  label: {
    color: "#ddd",
    fontSize: 14,
    marginBottom: 6,
    fontWeight: "500"
  },
  input: {
    backgroundColor: "#1E1E1E",
    color: "#ffffff",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#333"
  },
  botao: {
    backgroundColor: "#00B37E",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#00B37E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4
  },
  botaoDesabilitado: {
    opacity: 0.6
  },
  textoBotao: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold"
  },
  footer: {
    alignItems: "center",
    marginTop: 24
  },
  voltarBotao: {
    padding: 8
  },
  voltarTexto: {
    color: "#00B37E",
    fontSize: 15,
    fontWeight: "600"
  }
});
