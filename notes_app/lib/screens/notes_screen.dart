import 'package:flutter/material.dart';
import '../components/note_item.dart';

class NotesScreen extends StatefulWidget {
  const NotesScreen({Key? key}) : super(key: key);

  @override
  State<NotesScreen> createState() => _NotesScreenState();
}

class _NotesScreenState extends State<NotesScreen> {
  // Sample notes data
  final List<Map<String, dynamic>> notes = [
    {
      'title': 'Shopping List',
      'content': 'Milk, Eggs, Bread',
      'color': Colors.blue.shade100
    },
    {
      'title': 'Meeting Notes',
      'content': 'Discuss project timeline and assign tasks to team members',
      'color': Colors.green.shade100
    },
    {
      'title': 'Ideas',
      'content': 'New app features to implement: dark mode, cloud sync, notifications',
      'color': Colors.orange.shade100
    },
    {
      'title': 'Books to Read',
      'content': '1. Atomic Habits\n2. Deep Work\n3. The Psychology of Money',
      'color': Colors.purple.shade100
    },
    {
      'title': 'Weekly Goals',
      'content': '- Complete Flutter project\n- Exercise 3 times\n- Call mom',
      'color': Colors.pink.shade100
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey.shade100,
      appBar: AppBar(
        backgroundColor: Colors.blue.shade700,
        elevation: 0,
        title: const Text(
          'My Notes',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () {
            Navigator.pop(context);
          },
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Search clicked')),
              );
            },
          ),
          IconButton(
            icon: const Icon(Icons.sort),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Sort clicked')),
              );
            },
          ),
        ],
      ),
      body: Column(
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            color: Colors.blue.shade700,
            child: Row(
              children: [
                Text(
                  '${notes.length} Notes',
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const Spacer(),
                const Text(
                  'Last edited: Today',
                  style: TextStyle(
                    color: Colors.white70,
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ),
          Expanded(
            child: notes.isEmpty
                ? const Center(
                    child: Text(
                      'No notes yet. Create one!',
                      style: TextStyle(
                        fontSize: 18,
                        color: Colors.grey,
                      ),
                    ),
                  )
                : Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: GridView.builder(
                      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 2,
                        childAspectRatio: 1,
                        crossAxisSpacing: 10,
                        mainAxisSpacing: 10,
                      ),
                      itemCount: notes.length,
                      itemBuilder: (context, index) {
                        return NoteItem(
                          title: notes[index]['title'] ?? '',
                          content: notes[index]['content'] ?? '',
                          color: notes[index]['color'] ?? Colors.white,
                        );
                      },
                    ),
                  ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        backgroundColor: Colors.blue.shade700,
        onPressed: () {
          // Add new note functionality would go here
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Add new note clicked')),
          );
        },
        child: const Icon(Icons.add),
      ),
    );
  }
}