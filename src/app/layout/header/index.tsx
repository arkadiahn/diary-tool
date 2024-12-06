// import LanguageSelector from "./languageSelector";
import ThemeSwitch from "./themeSwitch";

export default function Header() {
    return (
        <header className="absolute top-0 left-0 w-full h-12 flex items-center justify-between p-2">
            <ThemeSwitch />
            {/* <LanguageSelector /> */}
        </header>
    );
}
