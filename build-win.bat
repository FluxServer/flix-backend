@setlocal enableextensions
@cd /d "%~dp0"

set OPENSSL_DIR=C:\Program Files\OpenSSL
set PATH=%PATH%;C:\Program Files\OpenSSL\bin
@REM set OPENSSL_INCLUDE_DIR=C:\Program Files\OpenSSL-Win64\include
set OPENSSL_LIB_DIR=C:\Program Files\OpenSSL\lib

cargo build --release