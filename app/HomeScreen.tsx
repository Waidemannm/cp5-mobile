import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebaseConfig";

export default function HomeScreen() {
  const router = useRouter();
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/");
      } else {
        setCarregando(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (carregando) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#00B37E" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.titulo}>Gerenciador de Tarefas</Text>
          <Text style={styles.subtitulo}>O que vamos fazer hoje?</Text>
        </View>

        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => router.push("/TarefasListScreen")}
          >
            <Text style={styles.menuButtonText}>Minhas Tarefas</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuButton, styles.menuButtonSecondary]}
            onPress={() => router.push({ pathname: "/TarefaFormScreen" })}
          >
            <Text style={styles.menuButtonText}>Nova Tarefa</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuButton, styles.menuButtonOutline]}
            onPress={() => router.push("/PerfilScreen")}
          >
            <Text style={styles.menuButtonTextOutline}>Meu Perfil</Text>
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
  container: {
    padding: 24,
    flexGrow: 1,
    justifyContent: "center"
  },
  header: {
    alignItems: "center",
    marginBottom: 48
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center"
  },
  subtitulo: {
    fontSize: 16,
    color: "#888",
    marginTop: 8,
    textAlign: "center"
  },
  menuContainer: {
    gap: 16
  },
  menuButton: {
    backgroundColor: "#00B37E",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4
  },
  menuButtonSecondary: {
    backgroundColor: "#29292E"
  },
  menuButtonOutline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#444"
  },
  menuButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold"
  },
  menuButtonTextOutline: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold"
  }
});
