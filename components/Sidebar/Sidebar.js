import React from 'react';
import { ThemeContext } from '../DarkMode/themeContext';
import tw from 'twin.macro';
import Image from "next/image";

export const Sidebar = () => {
  const { theme, setTheme } = React.useContext(ThemeContext);

  function isDark() {
    return theme === 'dark';
  }

  return (
    <div tw="laptop:fixed flex flex-row laptop:flex-col justify-between items-center bg-tertiary w-screen h-[72px] laptop:w-[72px] laptop:h-screen laptop:rounded-r-3xl z-40 laptop:h-screen">
      {/* Logo */}
      <div tw="flex flex-row h-[72px] w-[72px] items-center justify-center bg-[#7C5DFA] rounded-r-3xl">
        <Image tw="z-20" src="/assets/logo.svg" width={28} height={28} alt="logo" />
        <div tw="absolute h-[36px] w-[72px] top-[36px] bg-[#9277FF] rounded-br-3xl rounded-tl-3xl"></div>
      </div>
      <div tw="flex flex-row laptop:flex-col h-full laptop:h-auto pr-6 laptop:pr-0 laptop:pb-6 laptop:w-full">
        <button onClick={() => setTheme(isDark() ? "light" : "dark")} tw="text-primary mr-6 laptop:mr-0 laptop:self-center laptop:mb-6">{isDark() ? <Image src="/assets/icon-moon.svg" width={20} height={20} alt="moon-icon" /> : <Image src="/assets/icon-sun.svg" width={20} height={20} alt="sun-icon" />}</button>
        <div tw="border border-[#494E6E]"></div>
        <div tw="h-8 w-8 rounded-full ml-6 laptop:ml-0 laptop:mt-6 bg-[url('/assets/image-avatar.jpg')] bg-cover bg-no-repeat self-center">
        </div>
      </div>
    </div>
  );
};
