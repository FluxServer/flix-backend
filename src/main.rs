use acme2_eab::gen_rsa_private_key;
use acme2_eab::openssl::x509::X509;
use acme2_eab::AccountBuilder;
use acme2_eab::AuthorizationStatus;
use acme2_eab::ChallengeStatus;
use acme2_eab::Csr;
use acme2_eab::DirectoryBuilder;
use acme2_eab::Error;
use acme2_eab::OrderBuilder;
use acme2_eab::OrderStatus;
use std::env;
use std::fs;
use std::io::Read;
use std::time::Duration;
extern crate base64;
use std::fs::File;
use std::io::Write;
use std::str;
use sevenz_rust::*;
use sysinfo::{
    Components, Disks, System,
};

const LETS_ENCRYPT_URL: &'static str = "https://acme-v02.api.letsencrypt.org/directory";

#[tokio::main]
async fn main() -> Result<(), Error> {
    let args: Vec<String> = env::args().collect();

    if args.len() < 2 {
        eprintln!("No Arguments were passed out");
        std::process::exit(1);
    }

    let pass_encrypted = &args[1];

    let decoded_bytes = base64::decode(pass_encrypted).unwrap();
    let _decoded_string = str::from_utf8(&decoded_bytes).unwrap();

    let _parse_json = json::parse(_decoded_string).unwrap();

    let mut sys = System::new_all();

    sys.refresh_all();

    if _parse_json["action"] == "verinfo" {
        print!("OK:0.1")
    }

    if _parse_json["action"] == "disklist" {
        let disks = Disks::new_with_refreshed_list();

        println!("{:?}" , disks);
    }

    if _parse_json["action"] == "swapinfo" {
        println!("{}:{}:{}", sys.total_swap(), sys.used_swap(), sys.free_swap())
    }

    if _parse_json["action"] == "compinfo" {
        println!("{:?}" , Components::new_with_refreshed_list())
    }

    if _parse_json["action"] == "decompress" {
        let zip_location = format!("{}", _parse_json["path"]);
        let out_location = format!("{}", _parse_json["output"]);
        let _password = format!("{}", _parse_json["password"]);

        println!("Extracting {} into {}" , zip_location, out_location);

        if _parse_json["password"] == "none" {
            sevenz_rust::decompress_file(zip_location, out_location).unwrap();
        }else {
            println!("Backend does not supports 7z Decryption via Password");
            std::process::exit(6);
            //sevenz_rust::decompress_file_with_password(zip_location, out_location, Password::from(password)).expect("complete");
        }

        println!("Extracted Successfully");
    }

    if _parse_json["action"] == "compress" {
        let zip_location = format!("{}", _parse_json["path"]);
        let out_location = format!("{}", _parse_json["output"]);

        let _password = format!("{}", _parse_json["password"]);

        if _parse_json["password"] == "none" {
            sevenz_rust::compress_to_path_encrypted(zip_location, out_location, Password::empty()).expect("compress ok");
        }else {
            println!("Backend does not supports 7z Encryption via Password");
            std::process::exit(6);
        }
    }

    if _parse_json["action"] == "ssl-exp-info" {
        let file_path = format!(
            "/www/flix/user_dir/sites/{}/cert_file.crt",
            _parse_json["domain"]
        );
        if fs::metadata(file_path).is_ok() {
            let file_path = format!(
                "/www/flix/user_dir/sites/{}/cert_file.crt",
                _parse_json["domain"]
            );
            let file = File::open(file_path);
            let mut cert_pem = Vec::new();
            file.unwrap().read_to_end(&mut cert_pem).unwrap();

            let cert = X509::from_pem(&cert_pem)?;

            let not_after = cert.not_after();

            println!(">info {:?}", not_after)
        }else{
            println!(">info Jan 01 00:00:00 1970 GMT")
        }
    }

    if _parse_json["action"] == "new_ssl" {
        //
        // SSL INITATE NEW CERTIFICATE
        // NEW CERTIFICATE INITATION COMMAND
        // SSL NEW
        // SSL NEW
        //
        let dir = DirectoryBuilder::new(LETS_ENCRYPT_URL.to_string())
            .build()
            .await?;

        print!("Passed!\n\n");

        let mut builder = AccountBuilder::new(dir.clone());

        print!("Using E-Mail : {} \n\n", _parse_json["email"]);

        builder.contact(vec![format!("mailto:{}", _parse_json["email"]).to_string()]);
        builder.terms_of_service_agreed(true);
        let account = builder.build().await?;

        let mut builder = OrderBuilder::new(account);
        builder.add_dns_identifier(_parse_json["domain"].to_string());
        let order = builder.build().await?;

        let authorizations = order.authorizations().await?;

        for auth in authorizations {
            let challenge = auth.get_challenge("http-01").unwrap();
            let mut file = File::create(format!(
                "/www/flix/user_dir/sites/{}/.well-known/acme-challenge/{}",
                _parse_json["domain"],
                challenge.token.clone().unwrap()
            ))
            .unwrap();

            let mut file_2 = File::create(format!(
                "/www/flix/user_dir/sites/{}/.well-known/{}",
                _parse_json["domain"],
                challenge.token.clone().unwrap()
            ))
            .unwrap();

            let challenge_key = challenge.key_authorization();

            if challenge_key.is_ok() {
                match challenge_key {
                    Ok(Some(value)) => {
                        file.write_all(value.as_bytes()).unwrap();
                        file_2.write_all(value.as_bytes()).unwrap()
                    }
                    Ok(None) => {
                        println!("No value present");
                    }
                    Err(_) => todo!(),
                }

                println!(
                    "Challenge Has been written into {}",
                    format!(
                        "/www/flix/user_dir/sites/{}/.well-known/acme-challenge/{}",
                        _parse_json["domain"],
                        challenge.token.clone().unwrap()
                    )
                );

                println!(
                    "Challenge Has been written into {}",
                    format!(
                        "/www/flix/user_dir/sites/{}/.well-known/{}",
                        _parse_json["domain"],
                        challenge.token.clone().unwrap()
                    )
                )
            }

            let challenge = challenge.validate().await?;

            // Poll the challenge every 5 seconds until it is in either the
            // `valid` or `invalid` state.
            let challenge = challenge.wait_done(Duration::from_secs(5), 3).await?;

            assert_eq!(challenge.status, ChallengeStatus::Valid);

            // You can now remove the challenge file hosted on your webserver.

            // Poll the authorization every 5 seconds until it is in either the
            // `valid` or `invalid` state.
            let authorization = auth.wait_done(Duration::from_secs(5), 3).await?;
            assert_eq!(authorization.status, AuthorizationStatus::Valid)
        }

        let order = order.wait_ready(Duration::from_secs(5), 3).await?;

        assert_eq!(order.status, OrderStatus::Ready);

        // Generate an RSA private key for the certificate.
        let pkey = gen_rsa_private_key(4096)?;

        print!("{:?}", pkey);

        let mut pkey_file = File::create(format!(
            "/www/flix/user_dir/sites/{}/cert_public.key",
            _parse_json["domain"]
        ))
        .unwrap();

        let pkeyf = pkey.private_key_to_pem_pkcs8()?;

        pkey_file.write_all(&pkeyf).unwrap();

        let order = order.finalize(Csr::Automatic(pkey)).await?;

        // Poll the order every 5 seconds until it is in either the
        // `valid` or `invalid` state. Valid means that the certificate
        // has been provisioned, and is now ready for download.
        let order = order.wait_done(Duration::from_secs(5), 3).await?;

        assert_eq!(order.status, OrderStatus::Valid);

        // Download the certificate, and panic if it doesn't exist.
        let certificate = order.certificate().await?.unwrap();

        assert!(certificate.len() > 1);

        println!("CERT GENERATED \n \n");
        println!("{:?}", certificate);

        let crt_first = certificate.first().unwrap().to_pem()?;

        let mut crt_file = File::create(format!(
            "/www/flix/user_dir/sites/{}/cert_file.crt",
            _parse_json["domain"]
        ))
        .unwrap();

        crt_file.write_all(&crt_first).unwrap();
    }

    std::process::exit(0);
}
