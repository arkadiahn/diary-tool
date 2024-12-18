"use client";

import {
    useChangeLocale,
    useCurrentLocale,
    useScopedI18n,
} from "@/locales/client";
import { Select, SelectItem } from "@nextui-org/react";

/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
/* -------------------------------------------------------------------------- */
export default function LanguageSelector() {
    const changeLocale = useChangeLocale({
        preserveSearchParams: true,
    });
    const t = useScopedI18n("languages");
    const locale = useCurrentLocale();

    const getCountryFlag = (countryCode: string) => {
        const codePoints = countryCode
            .toUpperCase()
            .split("")
            .map((char) => 127397 + char.charCodeAt(0));
        return String.fromCodePoint(...codePoints);
    };

    return (
        <Select
            className="w-32"
            aria-label="Language"
            selectionMode="single"
            disallowEmptySelection
            selectedKeys={[locale]}
            items={(process.env.NEXT_PUBLIC_LOCALES?.split(",") ?? []).map(
                (locale) => ({
                    key: locale,
                    // @ts-expect-error IDK
                    label: `${getCountryFlag(locale.split("-")[1])} ${t(locale)}`,
                }),
            )}
            // biome-ignore lint/suspicious/noExplicitAny: some error idk
            onSelectionChange={(value) => changeLocale(value.currentKey as any)}
        >
            {(locale) => (
                <SelectItem key={locale.key} value={locale.key}>
                    {locale.label}
                </SelectItem>
            )}
        </Select>
    );
}
