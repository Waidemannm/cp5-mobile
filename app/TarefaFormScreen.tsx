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
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { collection, doc, addDoc, updateDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../services/firebaseConfig";

export default function TarefaFormScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id } = params;

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState("");
  const [status, setStatus] = useState("Pendente");
  
  const [carregando, setCarregando] = useState(false);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (id) {
      carregarTarefa();
    }
  }, [id]);

  const carregarTarefa = async () => {
    try {
      setCarregando(true);
      const user = auth.currentUser;
      if (!user) return;

      const docRef = doc(db, "usuarios", user.uid, "tarefas", id as string);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setTitulo(data.titulo || "");
        setDescricao(data.descricao || "");
        setData(data.data || "");
        setStatus(data.status || "Pendente");
      } else {
        Alert.alert("Erro", "Tarefa não encontrada.");
        router.back();
      }
    } catch (error) {
      console.error("Erro ao carregar tarefa:", error);
      Alert.alert("Erro", "Não foi possível carregar os dados.");
    } finally {
      setCarregando(false);
    }
  };

  const handleSalvar = async () => {
    if (!titulo.trim() || !descricao.trim() || !data.trim() || !status.trim()) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    try {
      setSalvando(true);
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Erro", "Usuário não autenticado.");
        return;
      }

      const tarefaData = {
        titulo,
        descricao,
        data,
        status
      };

      if (id) {
        // Atualizar
        const docRef = doc(db, "usuarios", user.uid, "tarefas", id as string);
        await updateDoc(docRef, tarefaData);
        Alert.alert("Sucesso", "Tarefa atualizada com sucesso!");
      } else {
        // Criar
        const tarefasRef = collection(db, "usuarios", user.uid, "tarefas");
        await addDoc(tarefasRef, tarefaData);
        Alert.alert("Sucesso", "Tarefa cadastrada com sucesso!");
      }
      
      router.back();
    } catch (error) {
      console.error("Erro ao salvar tarefa:", error);
      Alert.alert("Erro", "Não foi possível salvar a tarefa.");
    } finally {
      setSalvando(false);
    }
  };

  if (carregando) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size="large" color="#00B37E" style={styles.loader} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.botaoVoltar}>
              <Text style={styles.textoBotaoVoltar}>{"< Voltar"}</Text>
            </TouchableOpacity>
            <Text style={styles.tituloHeader}>{id ? "Editar Tarefa" : "Nova Tarefa"}</Text>
            <View style={{ width: 60 }} />
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Título</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Estudar React Native"
              placeholderTextColor="#555"
              value={titulo}
              onChangeText={setTitulo}
            />

            <Text style={styles.label}>Descrição</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Ex: Fazer o CheckPoint 5 de Mobile..."
              placeholderTextColor="#555"
              value={descricao}
              onChangeText={setDescricao}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <Text style={styles.label}>Data</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 20/10/2023"
              placeholderTextColor="#555"
              value={data}
              onChangeText={setData}
            />

            <Text style={styles.label}>Status</Text>
            <View style={styles.statusContainer}>
              {["Pendente", "Em Andamento", "Concluída"].map((op) => (
                <TouchableOpacity
                  key={op}
                  style={[
                    styles.statusOption,
                    status === op && styles.statusOptionSelected
                  ]}
                  onPress={() => setStatus(op)}
                >
                  <Text
                    style={[
                      styles.statusOptionText,
                      status === op && styles.statusOptionTextSelected
                    ]}
                  >
                    {op}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.botaoSalvar, salvando && styles.botaoDesabilitado]}
              onPress={handleSalvar}
              disabled={salvando}
            >
              {salvando ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.textoBotaoSalvar}>
                  {id ? "Salvar Alterações" : "Cadastrar Tarefa"}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#121212"
  },
  loader: {
    flex: 1,
    justifyContent: "center"
  },
  container: {
    flexGrow: 1
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A"
  },
  botaoVoltar: {
    padding: 8
  },
  textoBotaoVoltar: {
    color: "#00B37E",
    fontSize: 16,
    fontWeight: "bold"
  },
  tituloHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff"
  },
  form: {
    padding: 24
  },
  label: {
    color: "#e1e1e6",
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "500"
  },
  input: {
    backgroundColor: "#1E1E1E",
    borderWidth: 1,
    borderColor: "#2A2A2A",
    borderRadius: 8,
    padding: 14,
    color: "#ffffff",
    fontSize: 16,
    marginBottom: 20
  },
  textArea: {
    height: 100
  },
  statusContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 32
  },
  statusOption: {
    backgroundColor: "#1E1E1E",
    borderWidth: 1,
    borderColor: "#2A2A2A",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16
  },
  statusOptionSelected: {
    backgroundColor: "rgba(0, 179, 126, 0.2)",
    borderColor: "#00B37E"
  },
  statusOptionText: {
    color: "#aaa",
    fontSize: 14,
    fontWeight: "600"
  },
  statusOptionTextSelected: {
    color: "#00B37E"
  },
  botaoSalvar: {
    backgroundColor: "#00B37E",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10
  },
  textoBotaoSalvar: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold"
  },
  botaoDesabilitado: {
    opacity: 0.7
  }
});
