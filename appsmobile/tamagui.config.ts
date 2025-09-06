import { config } from '@tamagui/config/v3'
import { createTamagui } from 'tamagui'

// Create the tamagui config using the base config
const tamaguiConfig = createTamagui(config)

// TypeScript configuration
export type AppConfig = typeof tamaguiConfig

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default tamaguiConfig
