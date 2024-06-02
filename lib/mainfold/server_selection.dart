import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../utils/responsive.dart';

class ServerSelectionPage extends StatefulWidget {
  const ServerSelectionPage({super.key});

  @override
  State<ServerSelectionPage> createState() => _ServerSelectionPageState();
}

class _ServerSelectionPageState extends State<ServerSelectionPage> {
  List<Map> servers = [];
  late SharedPreferences prefs;
  bool isLoading = false;

  TextEditingController serverName = TextEditingController();
  TextEditingController serverAPI = TextEditingController();

  @override
  void initState() {
    super.initState();
    initSharedPrefs();
  }

  void initSharedPrefs () async {
    SharedPreferences pref = await SharedPreferences.getInstance();
    setState(() {
      prefs = pref;
    });
  }

  void fetchServers () async {
    Set<String> keys = prefs.getKeys();
    List<Map> tempMapBuild = [];

    for(var key in keys) {
      tempMapBuild.add({
        'name': key.replaceFirst("!server:", ""),
        'api' : prefs.get(key),
      });
    }

    setState(() {
      servers = tempMapBuild;
    });
  }

  void processAddServer() async {
    Navigator.of(context).pop();

    prefs.setString("!server:${serverName.value.text}", serverAPI.value.text);

    fetchServers();

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text("Sucessfully added"),behavior: SnackBarBehavior.floating,width: 200,)
    );
  }

  void setServer(String id){
    setState(() {
      isLoading = true;
    });
  }

  void newServer() {
    showDialog(context: context, builder: (ctx) => AlertDialog(
      title: const Text("New Server"),
      content: SingleChildScrollView(
        child: SizedBox(
          width: isMobile(context) ? null : MediaQuery.of(context).size.width - 600,
          height: isMobile(context) ? null : MediaQuery.of(context).size.height - 400,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.start,
            children: [
              const ListTile(
                leading: Icon(Icons.info),
                title: Text("Some Examples are \"aqua-server\" or \"production or staging servers\""),
              ),
              TextFormField(
                controller: serverName,
                decoration: const InputDecoration(
                  labelText: "Server Name/Label"
                ),
              ),
              const ListTile(
                  leading: Icon(Icons.info),
                  title: Text("The API Must Point to FLix Backend URI with PORT HTTP/HTTPS should be provided by the user as of now."),
              ),
              TextFormField(
                controller: serverAPI,
                decoration: const InputDecoration(
                    labelText: "Server URL/API"
                ),
              )
            ],
          ),
        ),
      ),
      actions: [
        TextButton(onPressed: () => Navigator.of(context).pop(), child: const Text("Cancel")),
        FilledButton(onPressed: () => processAddServer(), child: const Text("Add"))
      ],
    ));
  }

  Widget serverLists() {
    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.end,
          children: [
            isMobile(context) ? const SizedBox() : FilledButton(onPressed: () => newServer(), child: const Text("New Server")),
          ],
        ),
        const Divider(),
        for(var server in servers) ListTile(
          leading: const Icon(Icons.computer),
          title: Text(server['name']),
          onTap: () => setServer(server['name']),
          subtitle: Text(server['api']),
        )
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Flix Web Host Panel"),
        centerTitle: true,
      ),
      floatingActionButton: isLoading ? const Card(
        child: Padding(
          padding: EdgeInsets.all(18.0),
          child: CircularProgressIndicator(),
        ),
      ) : null,
      body: isMobile(context) ? const Text("Meow") : Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Center(
            child: SizedBox(
              width: MediaQuery.of(context).size.width - 380,
              height: MediaQuery.of(context).size.height - 320,
              child: Card(
                child: SingleChildScrollView(
                  child: Padding(
                    padding: const EdgeInsets.all(12.0),
                    child: serverLists(),
                  ),
                ),
              ),
            ),
          )
        ],
      ),
    );
  }
}