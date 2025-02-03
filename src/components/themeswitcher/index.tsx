"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@heroui/react";

//custom component imports
import { MoonSvg, SunSvg } from "../svgs";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div>
      {theme === 'dark' && (<Button onPress={(e) => setTheme('light')} variant="bordered">
        <SunSvg />
      </Button>)}
      {theme === 'light' && (<Button onPress={(e) => setTheme('dark')} variant="bordered">
        <MoonSvg />
      </Button>)}
    </div>
  )
};