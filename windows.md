**Running Flix on Windows: Special Instructions**

### Requirements
To successfully run Flix on Windows, ensure you have the following components installed:

- **OpenSSL 3.x Full**
- **Bun.sh & Node.js**
- **Windows 10 or 11** (Build 22H2 or Higher)
- **Rust**

### Building FlixRS
Follow these steps to build FlixRS:

1. Run the provided batch script:

    ```bat
    setup-windows.bat
    ```

    This script sets up the necessary environment for building FlixRS. Ensure that you modify the PATH variable to include the OpenSSL installation directory according to your Windows setup.

    **OR**

2. Alternatively, you can fetch the FlixRS Runtime from the Releases folder.

### Limitations
Keep in mind the following limitations when using Flix on Windows:

- **Windows Permission Restrictions:** Windows imposes limitations on file exploration due to permission constraints.
- **Limited NGINX Management:** NGINX management capabilities are restricted on Windows.

These instructions should help you set up and run Flix on your Windows system efficiently.