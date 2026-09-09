import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { signOut, deleteUser, onAuthStateChanged, User } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../services/firebaseConfig";
import { traduzirErroFirebase } from "../services/authErrors";

export default function HomeScreen() {
  const router = useRouter();

  const [usuario, setUsuario] = useState<{
    uid: string;
    email: string;
    displayName: string;
  } | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [processandoAcao, setProcessandoAcao] = useState(false);

  // Monitora o estado de autenticacao e carrega dados salvos (Requisito 3.3 e 6)
  useEffect(() => {
    let montado = true;

    const carregarUsuario = async () => {
      try {
        // Verifica dados locais no AsyncStorage
        const sessaoSalva = await AsyncStorage.getItem("@user");
        if (sessaoSalva && montado) {
          const dados = JSON.parse(sessaoSalva);
          setUsuario(dados);
        }

        // Observa alteracoes de autenticacao do Firebase
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
          if (!montado) return;

          if (firebaseUser) {
            const dadosAtualizados = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || "",
              displayName: firebaseUser.displayName || usuario?.displayName || "Usuario"
            };
            setUsuario(dadosAtualizados);
            await AsyncStorage.setItem("@user", JSON.stringify(dadosAtualizados));
          } else if (!sessaoSalva) {
            // Se nao ha usuario logado nem sessao persistida, bloqueia o acesso
            router.replace("/");
          }
          setCarregando(false);
        });

        return unsubscribe;
      } catch (error) {
        console.error("Erro ao carregar dados do usuario:", error);
        setCarregando(false);
      }
    };

    carregarUsuario();

    return () => {
      montado = false;
    };
  }, []);

  // Funcao de Logout (Requisito 3.4)
  const handleLogout = async () => {
    Alert.alert("Encerrar Sessao", "Deseja realmente sair da sua conta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          setProcessandoAcao(true);
          try {
            // 1. Encerra a sessao no Firebase Auth
            await signOut(auth);

            // 2. Remove os dados de persistencia do AsyncStorage
            await AsyncStorage.removeItem("@user");

            // 3. Redireciona para a tela de login
            router.replace("/");
          } catch (error: any) {
            console.error("Erro ao realizar logout:", error);
            Alert.alert("Erro", "Nao foi possivel encerrar a sessao.");
          } finally {
            setProcessandoAcao(false);
          }
        }
      }
    ]);
  };

  // Funcao de Exclusao de Conta (Requisito 3.6)
  const handleExcluirConta = () => {
    // Alerta de confirmacao conforme orientacao da prova:
    Alert.alert(
      "Excluir Conta",
      "Tem certeza que deseja excluir sua conta? Essa acao nao podera ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar Exclusao",
          style: "destructive",
          onPress: async () => {
            const currentUser = auth.currentUser;

            if (!currentUser) {
              Alert.alert("Erro", "Usuario nao encontrado para exclusao.");
              return;
            }

            setProcessandoAcao(true);

            try {
              // 1. Exclui a conta do Firebase Authentication
              await deleteUser(currentUser);

              // 2. Remove os dados locais do AsyncStorage
              await AsyncStorage.removeItem("@user");

              // 3. Feedback e redirecionamento para o login
              Alert.alert("Conta Excluida", "Sua conta foi excluida com sucesso.", [
                {
                  text: "OK",
                  onPress: () => router.replace("/")
                }
              ]);
            } catch (error: any) {
              console.error("Erro ao excluir conta:", error);
              const mensagem = traduzirErroFirebase(error?.code || "");
              Alert.alert("Falha na Exclusao", mensagem);
            } finally {
              setProcessandoAcao(false);
            }
          }
        }
      ]
    );
  };

  if (carregando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00B37E" />
        <Text style={styles.loadingText}>Carregando perfil...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Cabecalho */}
        <View style={styles.header}>
          <Text style={styles.badge}>Area Autenticada</Text>
          <Text style={styles.titulo}>Perfil do Usuario</Text>
          <Text style={styles.subtitulo}>Informacoes da sessao atual</Text>
        </View>

        {/* Card de Informacoes do Usuario */}
        <View style={styles.card}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarTexto}>
                {(usuario?.displayName || usuario?.email || "U").charAt(0).toUpperCase()}
              </Text>
            </View>
          </View>

          {/* Nome */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nome:</Text>
            <Text style={styles.infoValor}>
              {usuario?.displayName || "Nao informado"}
            </Text>
          </View>

          {/* E-mail */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>E-mail:</Text>
            <Text style={styles.infoValor}>
              {usuario?.email || "Nao informado"}
            </Text>
          </View>

          {/* UID */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>UID Firebase:</Text>
            <Text style={[styles.infoValor, styles.uidValor]} numberOfLines={1} ellipsizeMode="middle">
              {usuario?.uid || "Nao disponivel"}
            </Text>
          </View>

          {/* Status */}
          <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.infoLabel}>Status da Sessao:</Text>
            <View style={styles.statusBadge}>
              <View style={styles.statusPonto} />
              <Text style={styles.statusTexto}>Ativa no AsyncStorage</Text>
            </View>
          </View>
        </View>

        {/* Botoes de Acao */}
        <View style={styles.acoesContainer}>
          {/* Botao de Logout */}
          <TouchableOpacity
            style={[styles.botaoLogout, processandoAcao && styles.botaoDesabilitado]}
            onPress={handleLogout}
            disabled={processandoAcao}
          >
            {processandoAcao ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.textoBotaoLogout}>Sair da Conta</Text>
            )}
          </TouchableOpacity>

          {/* Botao de Excluir Conta */}
          <TouchableOpacity
            style={[styles.botaoExcluir, processandoAcao && styles.botaoDesabilitado]}
            onPress={handleExcluirConta}
            disabled={processandoAcao}
          >
            <Text style={styles.textoBotaoExcluir}>Excluir Conta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#121212"
  },
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
  container: {
    padding: 24,
    flexGrow: 1,
    justifyContent: "space-between"
  },
  header: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 24
  },
  badge: {
    color: "#00B37E",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 6
  },
  titulo: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#ffffff"
  },
  subtitulo: {
    fontSize: 14,
    color: "#888",
    marginTop: 4
  },
  card: {
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 16
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#00B37E",
    justifyContent: "center",
    alignItems: "center"
  },
  avatarTexto: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff"
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A"
  },
  infoLabel: {
    color: "#888",
    fontSize: 14,
    fontWeight: "500"
  },
  infoValor: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
    maxWidth: "60%",
    textAlign: "right"
  },
  uidValor: {
    fontSize: 12,
    color: "#aaa",
    fontFamily: "monospace"
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 179, 126, 0.15)",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6
  },
  statusPonto: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#00B37E",
    marginRight: 6
  },
  statusTexto: {
    color: "#00B37E",
    fontSize: 12,
    fontWeight: "600"
  },
  acoesContainer: {
    marginTop: 32,
    gap: 12
  },
  botaoLogout: {
    backgroundColor: "#2A2A2A",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#444"
  },
  textoBotaoLogout: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold"
  },
  botaoExcluir: {
    backgroundColor: "#DC2626",
    padding: 16,
    borderRadius: 10,
    alignItems: "center"
  },
  textoBotaoExcluir: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold"
  },
  botaoDesabilitado: {
    opacity: 0.6
  }
});
