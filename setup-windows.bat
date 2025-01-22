@setlocal enableextensions
@cd /d "%~dp0"

set OPENSSL_DIR=C:\Program Files\OpenSSL-Win64
set PATH=%PATH%;C:\Program Files\OpenSSL-Win64\bin
@REM set OPENSSL_INCLUDE_DIR=C:\Program Files\OpenSSL-Win64\include
set OPENSSL_LIB_DIR=C:\Program Files\OpenSSL-Win64\lib\VC\x64\MD

bun run debug

PAUSE