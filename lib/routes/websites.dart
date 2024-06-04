import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_client/utils/request.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../utils/responsive.dart';

class WebPage extends StatefulWidget {
  const WebPage({super.key, required this.callback});

  final Function callback;

  @override
  State<WebPage> createState() => _WebPageState();
}

class _WebPageState extends State<WebPage> {
  bool isLoading = false;
  late SharedPreferences prefs;

  TextEditingController webDomain = TextEditingController();
  TextEditingController webProxy = TextEditingController();
  bool webPHPEnabled = false;
  bool webProxyEnabled = false;
  int applicationId = 0;


  List<Map> sitesList = [];
  List<Map> applList = [];

  @override
  void initState() {
    super.initState();
    setPrefs();
  }

  void setPrefs() async {
    SharedPreferences pref = await SharedPreferences.getInstance();
    setState(() {
      prefs = pref;
    });

    fetchWebsites();
    fetchApplications();
  }

  void fetchApplications() async {
    setState(() {
      isLoading = true;
    });

    Map<String, dynamic> applications = await makeRequest(
        prefs: prefs, method: "GET", data: {}, endpoint: "v1/auth/app/list");

    if (!context.mounted) return;

    setState(() {
      isLoading = false;
    });

    if (applications['status'] == true) {
      setState(() {
        applList = List.from(applications['data']);
      });
    } else {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content: Text(applications['message']),
        behavior: SnackBarBehavior.floating,
        width: 280,
      ));
    }
  }

  void fetchWebsites() async {
    setState(() {
      isLoading = true;
    });

    Map<String, dynamic> sites = await makeRequest(
        prefs: prefs, method: "GET", data: {}, endpoint: "v1/auth/sites/list");

    if (!context.mounted) return;

    setState(() {
      isLoading = false;
    });

    if (sites['status'] == true) {
      setState(() {
        sitesList = List.from(sites['data']);
      });
    } else {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content: Text(sites['message']),
        behavior: SnackBarBehavior.floating,
        width: 280,
      ));
    }
  }

  Widget colOrRow({required List<Widget> children}) {
    return isMobile(context)
        ? Column(
            children: children,
          )
        : Row(
            children: children,
          );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
        child: Column(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                FilledButton(onPressed: () => {}, child: const Text("Add"))
              ],
            ),
            const Divider(),
            Column(
              children: [
                for (var site in sitesList)
                  Card(
                    child: SizedBox(
                      width: 1000,
                      child: Padding(
                        padding: const EdgeInsets.all(18.0),
                        child: Column(
                            mainAxisAlignment: MainAxisAlignment.start,
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Icon(
                                    site['site_ssl_enabled'] ? Icons.lock_outline : Icons.lock_open_outlined,
                                    color: site['site_ssl_enabled'] ? Colors.green : Colors.red,
                                  ),
                                  Text(
                                    site['site_domain_1'],
                                    style: const TextStyle(fontSize: 20),
                                  ),
                                ],
                              ),
                              const Divider(),
                              colOrRow(children: [
                                SizedBox(
                                  width: 200,
                                  height: 80,
                                  child: Container(
                                    decoration: BoxDecoration(
                                      border: Border.all(color: Colors.black),
                                      borderRadius: BorderRadius.circular(2)
                                    ),
                                    child: ListTile(
                                      titleAlignment: ListTileTitleAlignment.top,
                                      onTap: () async {},
                                      leading: Icon(
                                        site['certificate']['expired'] ?
                                              Icons.broken_image
                                            : site['site_ssl_enabled'] ? Icons.lock_outline : Icons.lock_open_outlined,
                                        color: site['site_ssl_enabled'] ? Colors.green : Colors.red,
                                      ),
                                      title: const Text("SSL Certificate"),
                                      subtitle: site['site_ssl_enabled'] ? Column(
                                        mainAxisAlignment: MainAxisAlignment.start,
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text("${site['certificate']['daysLeft']} Days Left")
                                        ],
                                      ) : const Text("Click to assign SSL"),
                                    ),
                                  ),
                                ),
                                SizedBox(
                                  width: 200,
                                  height: 80,
                                  child: Container(
                                    decoration: BoxDecoration(
                                        border: Border.all(color: Colors.black),
                                        borderRadius: BorderRadius.circular(2)
                                    ),
                                    child: ListTile(
                                      titleAlignment: ListTileTitleAlignment.top,
                                      leading: Icon(
                                        site['site_proxy_enabled'] ? Icons.link : Icons.link_off,
                                        color: site['site_proxy_enabled'] ? Colors.green : Colors.red,
                                      ),
                                      title: const Text("Site Proxy"),
                                      subtitle: site['site_proxy_enabled'] ? Column(
                                        mainAxisAlignment: MainAxisAlignment.start,
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text("/ -> 127.0.0.1:${site['site_proxy_port']}")
                                        ],
                                      ) : const Text("Proxy Disabled"),
                                    ),
                                  ),
                                ),
                                SizedBox(
                                  width: 200,
                                  height: 80,
                                  child: Container(
                                    decoration: BoxDecoration(
                                        border: Border.all(color: Colors.black),
                                        borderRadius: BorderRadius.circular(2)
                                    ),
                                    child: ListTile(
                                      titleAlignment: ListTileTitleAlignment.top,
                                      leading: FaIcon(
                                        FontAwesomeIcons.php,
                                        color: site['site_php_enabled'] ? Colors.blue : Colors.red,
                                      ),
                                      title: const Text("PHP"),
                                      subtitle: site['site_php_enabled'] ? Column(
                                        mainAxisAlignment: MainAxisAlignment.start,
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text("PHP Version : ${site['site_php_version']}")
                                        ],
                                      ) : const Text("PHP Disabled"),
                                    ),
                                  ),
                                )
                              ])
                            ]),
                      ),
                    ),
                  )
              ],
            )
          ],
        ),
      ),
      floatingActionButton: isLoading
          ? const Card(
              child: Padding(
                padding: EdgeInsets.all(18.0),
                child: CircularProgressIndicator(),
              ),
            )
          : FilledButton(
              onPressed: () => fetchWebsites(),
              child: const Icon(Icons.refresh)),
    );
  }
}
