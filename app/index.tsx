import React, { useState, useEffect } from "react";
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
import { signInWithEmailAndPassword } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../services/firebaseConfig";
import { traduzirErroFirebase } from "../services/authErrors";

export default function LoginScreen() {
  const router = useRouter();

  // Estados dos inputs e carregamento
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [verificandoSessao, setVerificandoSessao] = useState(true);

  // Verificacao inicial de sessao salva no AsyncStorage (Requisito 3.3)
  useEffect(() => {
    const verificarSessaoAtiva = async () => {
      try {
        const sessaoSalva = await AsyncStorage.getItem("@user");
        if (sessaoSalva) {
          // Redireciona diretamente para a area autenticada
          router.replace("/HomeScreen");
          return;
        }
      } catch (error) {
        console.error("Erro ao verificar sessao no AsyncStorage:", error);
      } finally {
        setVerificandoSessao(false);
      }
    };

    verificarSessaoAtiva();
  }, []);

  // Funcao de login com Firebase Auth (Requisito 3.2)
  const handleLogin = async () => {
    // Validacao dos campos
    if (!email.trim() || !senha) {
      Alert.alert("Campos Obrigatorios", "Por favor, preencha o e-mail e a senha.");
      return;
    }

    setCarregando(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), senha);
      const user = userCredential.user;

      // Persistencia no AsyncStorage (APENAS dados publicos do perfil, NUNCA a senha!)
      const dadosSessao = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || ""
      };
      await AsyncStorage.setItem("@user", JSON.stringify(dadosSessao));

      // Redireciona para a tela inicial autenticada
      router.replace("/HomeScreen");
    } catch (error: any) {
      console.error("Erro no login:", error);
      const mensagem = traduzirErroFirebase(error?.code || "");
      Alert.alert("Falha no Login", mensagem);
    } finally {
      setCarregando(false);
    }
  };

  // Enquanto valida se ja ha login persistido, exibe tela de carregamento suave
  if (verificandoSessao) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00B37E" />
        <Text style={styles.loadingText}>Verificando sessao...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          {/* Cabecalho */}
          <Text style={styles.badge}>FIAP • CheckPoint 4</Text>
          <Text style={styles.titulo}>Acessar Conta</Text>
          <Text style={styles.subtitulo}>Autenticacao com Firebase Auth</Text>

          {/* Campo de E-mail */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>E-mail</Text>
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

          {/* Campo de Senha */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite sua senha"
              placeholderTextColor="#777"
              secureTextEntry
              value={senha}
              onChangeText={setSenha}
            />
          </View>

          {/* Link Esqueci Minha Senha */}
          <View style={styles.linksAuxiliares}>
            <Link href="/EsqueciSenhaScreen" asChild>
              <TouchableOpacity>
                <Text style={styles.linkTexto}>Esqueci minha senha</Text>
              </TouchableOpacity>
            </Link>
          </View>

          {/* Botao de Login */}
          <TouchableOpacity
            style={[styles.botao, carregando && styles.botaoDesabilitado]}
            onPress={handleLogin}
            disabled={carregando}
          >
            {carregando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.textoBotao}>Entrar</Text>
            )}
          </TouchableOpacity>

          {/* Link para Cadastro */}
          <View style={styles.footer}>
            <Text style={styles.footerTexto}>Ainda nao possui uma conta? </Text>
            <Link href="/CadastrarScreen" asChild>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Cadastre-se</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center"
  },
  loadingText: {
    color: "#aaa",
    marginTop: 12,
    fontSize: 14
  },
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
    marginBottom: 28
  },
  inputGroup: {
    marginBottom: 16
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
  linksAuxiliares: {
    alignItems: "flex-end",
    marginBottom: 20
  },
  linkTexto: {
    color: "#00B37E",
    fontSize: 14,
    fontWeight: "500"
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
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30
  },
  footerTexto: {
    color: "#888",
    fontSize: 14
  },
  footerLink: {
    color: "#00B37E",
    fontSize: 14,
    fontWeight: "bold"
  }
});
