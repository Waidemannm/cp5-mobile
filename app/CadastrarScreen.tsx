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
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../services/firebaseConfig";
import { traduzirErroFirebase } from "../services/authErrors";

export default function CadastrarScreen() {
  const router = useRouter();

  // Estados dos campos do formulario
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  // Validacao de regex simples para formato de e-mail
  const validarFormatoEmail = (emailStr: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailStr);
  };

  // Funcao para processar o cadastro (Requisito 3.1)
  const handleCadastro = async () => {
    const nomeLimpo = nome.trim();
    const emailLimpo = email.trim();

    // 1. Validacao: Campos obrigatorios
    if (!nomeLimpo || !emailLimpo || !senha || !confirmarSenha) {
      Alert.alert("Campos Obrigatorios", "Por favor, preencha todos os campos.");
      return;
    }

    // 2. Validacao: Formato do e-mail
    if (!validarFormatoEmail(emailLimpo)) {
      Alert.alert("E-mail Invalido", "Por favor, digite um formato de e-mail valido (ex: usuario@dominio.com).");
      return;
    }

    // 3. Validacao: Tamanho minimo da senha
    if (senha.length < 6) {
      Alert.alert("Senha Curta", "A senha deve conter no minimo 6 caracteres.");
      return;
    }

    // 4. Validacao: Senhas iguais
    if (senha !== confirmarSenha) {
      Alert.alert("Senhas Diferentes", "A confirmacao de senha nao confere com a senha digitada.");
      return;
    }

    setCarregando(true);

    try {
      // Criacao do usuario no Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, emailLimpo, senha);
      const user = userCredential.user;

      // Atualizacao do displayName no perfil do usuario no Firebase Auth
      await updateProfile(user, {
        displayName: nomeLimpo
      });

      // Persistencia no AsyncStorage (Requisito 3.3 - NUNCA salvar a senha!)
      const dadosSessao = {
        uid: user.uid,
        email: user.email,
        displayName: nomeLimpo
      };
      await AsyncStorage.setItem("@user", JSON.stringify(dadosSessao));

      Alert.alert("Sucesso", "Conta criada com sucesso!", [
        {
          text: "Continuar",
          onPress: () => router.replace("/HomeScreen")
        }
      ]);
    } catch (error: any) {
      console.error("Erro no cadastro:", error);
      const mensagem = traduzirErroFirebase(error?.code || "");
      Alert.alert("Erro no Cadastro", mensagem);
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
          <Text style={styles.badge}>Novo Usuario</Text>
          <Text style={styles.titulo}>Criar Conta</Text>
          <Text style={styles.subtitulo}>Preencha os dados abaixo para se cadastrar</Text>

          {/* Campo Nome */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome Completo</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu nome completo"
              placeholderTextColor="#777"
              autoCapitalize="words"
              value={nome}
              onChangeText={setNome}
            />
          </View>

          {/* Campo E-mail */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu melhor e-mail"
              placeholderTextColor="#777"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Campo Senha */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha (minimo 6 caracteres)</Text>
            <TextInput
              style={styles.input}
              placeholder="Crie uma senha segura"
              placeholderTextColor="#777"
              secureTextEntry
              value={senha}
              onChangeText={setSenha}
            />
          </View>

          {/* Campo Confirmar Senha */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirmar Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Repita sua senha"
              placeholderTextColor="#777"
              secureTextEntry
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
            />
          </View>

          {/* Botao de Cadastro */}
          <TouchableOpacity
            style={[styles.botao, carregando && styles.botaoDesabilitado]}
            onPress={handleCadastro}
            disabled={carregando}
          >
            {carregando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.textoBotao}>Cadastrar</Text>
            )}
          </TouchableOpacity>

          {/* Voltar para Login */}
          <View style={styles.footer}>
            <Text style={styles.footerTexto}>Ja possui uma conta? </Text>
            <Link href="/" asChild>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Fazer Login</Text>
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
    padding: 24,
    paddingVertical: 40
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
    marginBottom: 24
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
  botao: {
    backgroundColor: "#00B37E",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
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
    marginTop: 26
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
