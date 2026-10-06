import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import { collection, query, getDocs, deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "../services/firebaseConfig";

interface Tarefa {
  id: string;
  titulo: string;
  descricao: string;
  data: string;
  status: string;
}

export default function TarefasListScreen() {
  const router = useRouter();
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [carregando, setCarregando] = useState(true);

  const carregarTarefas = async () => {
    try {
      setCarregando(true);
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Erro", "Usuário não autenticado.");
        return;
      }

      const q = query(collection(db, "usuarios", user.uid, "tarefas"));
      const querySnapshot = await getDocs(q);
      
      const lista: Tarefa[] = [];
      querySnapshot.forEach((docSnap) => {
        lista.push({ id: docSnap.id, ...docSnap.data() } as Tarefa);
      });
      
      setTarefas(lista);
    } catch (error) {
      console.error("Erro ao carregar tarefas:", error);
      Alert.alert("Erro", "Não foi possível carregar as tarefas.");
    } finally {
      setCarregando(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarTarefas();
    }, [])
  );

  const handleExcluir = (id: string) => {
    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja excluir esta tarefa?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              const user = auth.currentUser;
              if (!user) return;
              
              await deleteDoc(doc(db, "usuarios", user.uid, "tarefas", id));
              Alert.alert("Sucesso", "Tarefa excluída com sucesso.");
              carregarTarefas(); // recarrega a lista
            } catch (error) {
              console.error("Erro ao excluir:", error);
              Alert.alert("Erro", "Não foi possível excluir a tarefa.");
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }: { item: Tarefa }) => (
    <View style={styles.card}>
      <View style={styles.cardInfo}>
        <Text style={styles.tituloTarefa}>{item.titulo}</Text>
        <Text style={styles.descricaoTarefa} numberOfLines={2}>{item.descricao}</Text>
        <Text style={styles.dataTarefa}>Data: {item.data}</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusTexto}>{item.status}</Text>
        </View>
      </View>
      
      <View style={styles.cardAcoes}>
        <TouchableOpacity
          style={styles.botaoEditar}
          onPress={() => router.push({ pathname: "/TarefaFormScreen", params: { id: item.id } })}
        >
          <Text style={styles.textoBotaoAcao}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.botaoExcluir}
          onPress={() => handleExcluir(item.id)}
        >
          <Text style={styles.textoBotaoAcao}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.botaoVoltar}>
          <Text style={styles.textoBotaoVoltar}>{"< Voltar"}</Text>
        </TouchableOpacity>
        <Text style={styles.titulo}>Minhas Tarefas</Text>
        <View style={{ width: 60 }} />
      </View>

      {carregando ? (
        <ActivityIndicator size="large" color="#00B37E" style={styles.loader} />
      ) : tarefas.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhum registro encontrado.</Text>
        </View>
      ) : (
        <FlatList
          data={tarefas}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
      
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/TarefaFormScreen")}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#121212"
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
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff"
  },
  loader: {
    flex: 1,
    justifyContent: "center"
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  emptyText: {
    color: "#888",
    fontSize: 16
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80
  },
  card: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#2A2A2A"
  },
  cardInfo: {
    marginBottom: 12
  },
  tituloTarefa: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4
  },
  descricaoTarefa: {
    fontSize: 14,
    color: "#aaa",
    marginBottom: 8
  },
  dataTarefa: {
    fontSize: 12,
    color: "#888",
    marginBottom: 8
  },
  statusBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(0, 179, 126, 0.2)",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4
  },
  statusTexto: {
    color: "#00B37E",
    fontSize: 12,
    fontWeight: "bold"
  },
  cardAcoes: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: "#2A2A2A",
    paddingTop: 12
  },
  botaoEditar: {
    backgroundColor: "#29292E",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6
  },
  botaoExcluir: {
    backgroundColor: "#DC2626",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6
  },
  textoBotaoAcao: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600"
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#00B37E",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4
  },
  fabText: {
    fontSize: 32,
    color: "#fff",
    fontWeight: "bold",
    marginTop: -4
  }
});
