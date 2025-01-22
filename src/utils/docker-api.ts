export const dockerFetch = async (endpoint: string) => {
    const proc = Bun.spawn(
        [
            "curl",
            "--unix-socket",
            "/run/docker.sock",
            `http://localhost${endpoint}`,
        ],
        {
            stdio: ["pipe", "pipe", "pipe"],
        },
    );
    await proc.exited;

    return new Response(proc.stdout).json() as any;
};

export const dockerSend = async (endpoint: string, postData: any) => {
    const proc = Bun.spawn(
        [
            "curl",
            "--unix-socket",
            "/run/docker.sock",
            "-H",
            "Content-Type: application/json",
            "-d",
            JSON.stringify(postData),
            "-X",
            "POST",
            `http://localhost${endpoint}`,
        ],
        {
            stdio: ["pipe", "pipe", "pipe"],
        },
    );
    await proc.exited;

    return new Response(proc.stdout).json() as any;
};
