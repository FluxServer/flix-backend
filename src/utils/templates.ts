import { join } from "node:path";

export const template = async (template: string, snip: string, site: {
    site_domain: String
    site_ssl_enabled: Boolean
    site_proxy_enabled: Boolean
    site_proxy_port: number
    site_php_enabled: Boolean,
    site_php_version: String,
    site_ssl_crt_file: String
    site_ssl_key_file: String
}) => {
  let path = join(process.cwd(), 'src', 'templates', template);
  let file = await Bun.file(path).text();

  file = file.replaceAll("{domain_name}", site.site_domain as string);
  file = file.replaceAll("{config}", "");
  file = file.replaceAll("{enable_ssl}", site.site_ssl_enabled ? "" : "#");
  file = file.replaceAll("{certfile}", site.site_ssl_crt_file as string);
  file = file.replaceAll("{certkey}", site.site_ssl_key_file as string);

  let snippets = "";

  let localSnippet = await snippet("local.conf");
  let phpSnippet = await snippet("php.conf");
  let proxySnippet = await snippet("proxy.conf");

  snippets += site.site_php_enabled ? phpSnippet : "";
  snippets += site.site_proxy_enabled ? proxySnippet : "";

  snippets += !(site.site_php_enabled || site.site_proxy_enabled) ? localSnippet : "";

  file = site.site_ssl_enabled ? file.replaceAll("{snippets}", snippets) : file.replace("{snippets}", snippets);

  async function snippet(sniper: string) {
    let path = join(process.cwd(), 'src', 'templates', 'snippets', snip, sniper);
    let file = await Bun.file(path).text();

    file = file.replaceAll("{proxy_url}", `http://127.0.0.1:${site.site_proxy_port}`);
    file = file.replaceAll("{version}", site.site_php_version as string);

    return file;
  }

  return file.toString();
};
