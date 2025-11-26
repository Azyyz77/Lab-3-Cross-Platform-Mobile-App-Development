import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
  StatusBar,
  Dimensions,
  RefreshControl,
} from "react-native";
import NoteItem from "../components/NoteItem";
import NoteInput from "../components/NoteInput";
import { Note } from "../types/note";
import appwriteService from "../services/appwriteService";
import authService from "../services/authService";

const { width } = Dimensions.get('window');

interface NotesScreenProps {
  onLogout: () => void;
}

export default function NotesScreen({ onLogout }: NotesScreenProps) {
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    loadUserName();
  }, []);

  const loadUserName = async () => {
    const user = await authService.getCurrentUser();
    if (user) {
      setUserName(user.name);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", style: "destructive", onPress: onLogout },
      ]
    );
  };
  const [notes, setNotes] = useState<Note[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [noteText, setNoteText] = useState<string>("");
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Load notes on component mount
  useEffect(() => {
    loadNotes();
  }, []);

  // Function to load notes from Appwrite
  const loadNotes = async () => {
    try {
      setLoading(true);
      const fetchedNotes = await appwriteService.getNotes();
      setNotes(fetchedNotes);
    } catch (error: any) {
      console.error("Error fetching notes:", error);
      Alert.alert(
        "Error Loading Notes", 
        error.message || "Failed to load notes. Please check your Appwrite permissions."
      );
    } finally {
      setLoading(false);
    }
  };

  // Function to add or update a note
  const saveNote = async () => {
    if (noteText.trim() === "") {
      Alert.alert("Error", "Please enter some text for your note.");
      return;
    }

    try {
      if (editingNote) {
        // Update existing note
        const updatedNote = await appwriteService.updateNote(
          editingNote.id,
          noteText
        );
        setNotes(
          notes.map((note) => (note.id === editingNote.id ? updatedNote : note))
        );
        setEditingNote(null);
      } else {
        // Add new note
        const newNote = await appwriteService.createNote(noteText);
        setNotes([newNote, ...notes]);
      }

      setNoteText("");
      setModalVisible(false);
    } catch (error) {
      Alert.alert("Error", "Failed to save note. Please try again.");
      console.error(error);
    }
  };

  // Function to delete a note
  const deleteNote = async (id: string) => {
    Alert.alert(
      "Delete Note",
      "Are you sure you want to delete this note?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await appwriteService.deleteNote(id);
              setNotes(notes.filter((note) => note.id !== id));
            } catch (error) {
              Alert.alert("Error", "Failed to delete note. Please try again.");
              console.error(error);
            }
          },
        },
      ]
    );
  };

  // Function to open edit mode
  const editNote = (note: Note) => {
    setEditingNote(note);
    setNoteText(note.content);
    setModalVisible(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setModalVisible(false);
    setNoteText("");
    setEditingNote(null);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <StatusBar barStyle="light-content" backgroundColor="#3498db" />
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading notes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3498db" />
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>My Notes</Text>
          {userName && <Text style={styles.userNameText}>Hi, {userName}!</Text>}
        </View>
        <View style={styles.headerActions}>
          <Text style={styles.noteCount}>{notes.length} {notes.length === 1 ? 'note' : 'notes'}</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutButtonText}>🚪</Text>
          </TouchableOpacity>
        </View>
      </View>

      {notes.length > 0 ? (
        <FlatList
          data={notes}
          renderItem={({ item }) => (
            <NoteItem note={item} onEdit={editNote} onDelete={deleteNote} />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.notesList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={loadNotes}
              colors={["#3498db"]}
              tintColor="#3498db"
            />
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📝</Text>
          <Text style={styles.emptyText}>No notes yet</Text>
          <Text style={styles.emptySubtext}>Tap the + button to create your first note!</Text>
        </View>
      )}

      <NoteInput
        visible={modalVisible}
        onClose={closeModal}
        onSave={saveNote}
        noteText={noteText}
        setNoteText={setNoteText}
        isEditing={!!editingNote}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#7f8c8d",
  },
  header: {
    height: Platform.OS === "ios" ? 110 : 100,
    backgroundColor: "#3498db",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingBottom: 15,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  headerTitle: {
    color: "white",
    fontSize: width < 380 ? 22 : 26,
    fontWeight: "bold",
  },
  userNameText: {
    color: "white",
    fontSize: 14,
    opacity: 0.8,
    marginTop: 4,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  noteCount: {
    color: "white",
    fontSize: 14,
    opacity: 0.9,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  addButtonText: {
    fontSize: 26,
    color: "#3498db",
    fontWeight: "bold",
    marginTop: -2,
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e74c3c",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  logoutButtonText: {
    fontSize: 20,
  },
  notesList: {
    padding: 16,
    paddingBottom: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: "#7f8c8d",
    textAlign: "center",
  },
});
