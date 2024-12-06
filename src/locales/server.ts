import { createI18nServer } from "next-international/server";

export const { getI18n, getScopedI18n, getStaticParams, getCurrentLocale } =
    createI18nServer({
        "en-US": () => import("../translations/en-US"),
        "de-DE": () => import("../translations/de-DE"),
    });
