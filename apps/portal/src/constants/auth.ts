import googleIcon from "@iconify/icons-flat-color-icons/google";
import githubIcon from "@iconify/icons-fe/github";

export const AUTH_PROVIDERS = [
    { name: "Google", icon: googleIcon, providerKey: "google" },
    { name: "GitHub", icon: githubIcon, providerKey: "github" },
] as const;
